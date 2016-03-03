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
var user = require('./routes/user/user');
db.connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    //store: new MongoStore({
    //    url: db.getURI()
    //}),
    secret: 'supposedToBeASecret',
    saveUninitialized: true,
    resave: false
}));

// User Create Route
app.post('/user', function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var sess = req.session;

    sess.firstName = firstName;
    sess.email = email;
    //sess.sleepObjectId = db.randomObjectId();
    //sess.wakeObjectId = db.randomObjectId();

    var newUser = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "sleepObjectId": sess.sleepObjectId,
        "wakeObjectId": sess.wakeObjectId
    };

    console.log("req.session:");
    console.log(req.session);
    console.log("\n");
    console.log("req.session.id: "+req.session.id);
    // db call to add new user
    var usersCollection = db.get().collection('users');
    usersCollection.insertOne(newUser);

    res.status(200).json(newUser).end();
});

// User Get Route
app.get('/user', user.GET);
// User Update Route
app.put('/user', user.PUT);
// User Delete Route
app.delete('/user', user.DELETE);

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