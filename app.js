var express = require('express');
//var redis = require('redis');
//var cookieParser = require('cookie-parser');
var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
//var mongoStore = require('connect-mongodb');
//var MongoStore = require('connect-mongostore')(session);
//var MongoStore = require('connect-mongo/es5')(session);
//var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./db');
var app = express();
var ObjectId = require('mongodb').ObjectID;
db.connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'supposedToBeASecret',
    maxAge: new Date(Date.now() + (10 * 60 * 60 * 1000)), // 10 hours
    saveUninitialized: true,
    resave: false
}));

// User - Create User Route
app.post('/user', function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var sess = req.session;

    var newUserSleepData = {
        "sleepData": []
    };
    var newUserWakeData = {
        "wakeData": []
    };

    // Layer 1 - Insert empty array for sleepData data
    var sleepCollection = db.get().collection('sleepData');
    sleepCollection.insertOne(newUserSleepData, function(err, newSleepDoc) {
        if(err) {
            console.log("Error-Account Creation@sleepCollection: " + err);
            console.log("Signup Failure");
            return res.status(400).end();
        } else {
            // Layer 2 - Insert empty array for wake data
            var wakeCollection  = db.get().collection('wakeData');
            var userWakeDoc = wakeCollection.insertOne(newUserWakeData, function(err, newWakeDoc) {
                if(err) {
                    console.log("Error-Account Creation@wakeCollection: " + err);
                    console.log("Signup Failure");
                    return res.status(400).end();
                } else {
                    var newUser = {
                        "firstName": firstName,
                        "lastName": lastName,
                        "email": email,
                        "password": password,
                        "sleepObjectId": newSleepDoc.ops[0]._id,
                        "wakeObjectId": newWakeDoc.ops[0]._id
                    };
                    // Layer 3 - Check if email exists in DB
                    var usersCollection = db.get().collection('users');
                    usersCollection.find({email: email}).toArray(function(err, duplicateEmail) {
                        if(err) {
                            console.log("Error-Email Duplication: " + err);
                            console.log("Signup Failure");
                            return res.status(400).end();
                        } else if(duplicateEmail.length > 0) {
                            console.log("Error-Email Duplication: Email already registered");
                            console.log(duplicateEmail[0].email);
                            console.log("Signup Failure");
                            return res.status(400).end();
                        } else {
                            // Layer 4 - Signup Success
                            // Create session token
                            usersCollection.insertOne(newUser);
                            sess.email = email;
                            sess.sleepObjectId = newSleepDoc.ops[0]._id;
                            sess.wakeObjectId = newWakeDoc.ops[0]._id;
                            console.log("Signup Success");
                            return res.status(200).end();
                        }
                    });
                }
            });
        }
    });
});

// User - Get User Route
app.get('/user', function(req, res) {
    var email = req.session.email;
    var usersCollection = db.get().collection('users');
    return usersCollection.find({email: email}).toArray(function(err, user) {
        if(err) {
            console.log("Error-Get User Failure: " + err);
            return res.status(400).end();
        } else {
            console.log("Fetching User Data...");
            var userStrippedInfo = {
                firstName: user[0].firstName,
                lastName: user[0].lastName,
                email: user[0].email
            };

            return res.status(200).json(userStrippedInfo).end();
        }
    })
});

// User - Update User Email Route
app.put('/user/updateEmail', function(req, res) {
    var currentEmail = req.body.currentEmail;
    var newEmail = req.body.newEmail;
    var confirmEmail = req.body.confirmEmail;

    if(newEmail !== confirmEmail) {
        console.log("New Emails don't match");
        return res.status(400).end();
    } else if(currentEmail !== req.session.email) {
        console.log("Current Email is wrong.");
        return res.status(400).end();
    }

    var usersCollection = db.get().collection('users');
    // CHECK IF EMAIL ALREADY EXISTS
    usersCollection.find({email: newEmail}).toArray(function(err, user) {
        if(err) {
            console.log("Error Updating Email");
            console.log(err);
            return res.status(400).end();
        } else if(user) {
            console.log("Email already exists");
            console.log(user);
            return res.status(400).end();
        }
    });

    // PERFORM UPDATE
    usersCollection.find({email: currentEmail}).toArray(function(err, user) {
        if(err) {
            console.log("Error Updating Email");
            console.log(err);
            return res.status(400).send("Failed to update Email").end();
        }
        user[0].email = newEmail;
        usersCollection.update({email: currentEmail}, user[0], function(err, update) {
            if(err) {
                console.log("Update Email Failed");
                return res.status(400).end();
            } else {
                req.session.email = newEmail;
                return res.status(200).send("Email Updated").end();
            }
        });
    });
});

// User - Update User Password Route
app.put('/user/updatePassword', function(req, res) {
    var currentPassword = req.body.currentPassword;
    var newPassword     = req.body.newPassword;
    var confirmPassword = req.body.confirmPassword;

    if(newPassword !== confirmPassword) {
        console.log("New Passwords don't match");
        return res.status(400).end();
    }

    // PERFORM UPDATE
    var usersCollection = db.get().collection('users');
    usersCollection.find({email: req.session.email}).toArray(function(err, user) {
        if(err) {
            console.log("Error Updating Password");
            console.log(err);
            return res.status(400).send("Failed to update Password").end();
        }
        user[0].password = newPassword;
        usersCollection.update({email: req.session.email}, user[0], function(err, update) {
            if(err) {
                console.log("Update Password Failed");
                return res.status(400).end();
            } else {
                return res.status(200).send("Password Updated").end();
            }
        });
    });
});

// User - Delete User Route
app.delete('/user', function(req, res) {
    var email = req.session.email;
    var sleepObjectId = req.session.sleepObjectId;
    var wakeObjectId = req.session.wakeObjectId;
    var usersCollection = db.get().collection('users');
    var sleepDataCollection = db.get().collection('sleepData');
    var wakeDataCollection = db.get().collection('wakeData');

    // delete sleep/wake data tied to the email
    sleepDataCollection.remove({_id: ObjectId(sleepObjectId)});
    wakeDataCollection.remove({_id: ObjectId(wakeObjectId)});
    usersCollection.remove({email: email});

    req.session.destroy(function(err) {
        if(err) {
            console.log("Error-Delete User Failure: " + err);
            return res.status(400).end();
        } else {
            console.log("Delete User Success");
            return res.status(200).end();
        }
    });
});

// Login route
app.post('/user/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var sess = req.session;

    var usersCollection = db.get().collection('users');

    return usersCollection.find().toArray(function(err, users) {
        if(err) {
            console.log("Error-Login Failure: " + err);
            return res.status(400).end();
        } else {
            for(var user_i = 0; user_i < users.length; ++user_i) {
                if(users[user_i].email === email) {
                    if(users[user_i].password === password) {
                        sess.email = email;
                        sess.sleepObjectId = users[user_i].sleepObjectId;
                        sess.wakeObjectId = users[user_i].wakeObjectId;
                        console.log("Login Success");
                        return res.status(200).end();
                    }
                }
            }
            return res.status(400).end();
        }
    });
});

// Logout route
app.get('/user/logout', function(req, res) {
    req.session.destroy(function(err) {
        if(err) {
            console.log("Error-logout Failure: " + err);
            return res.status(400).end();
        } else {
            console.log("Logout Success");
            return res.status(200).end();
        }
    });
});

var routes = require('./routes/routes');
app.use('/', routes);

module.exports = app;