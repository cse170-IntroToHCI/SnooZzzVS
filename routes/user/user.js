
var db = require('../../db');
module.exports.user = {};

// for grabbing data on "Account" page
module.exports.GET = function(req, res) {
    // TODO
};

module.exports.POST = function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "sleepObjectId": "1",
        "wakeObjectId": "2",
        "session": req.session
    };

    console.log(req.session);
    console.log("\n");
    console.log(req.session.id);
    // db call to add new user
    var usersCollection = db.get().collection('users');
    usersCollection.insertOne(newUser);

    res.status(200).end();
};

module.exports.DELETE = function(req, res) {
    req.logout;
    return res.status(200);
};



// USER LOGIN
module.exports.loginPOST = function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var usersCollection = db.get().collection('users');

    return usersCollection.find().toArray(function(err, users) {
        if(err) {
            console.log("error: " + err);
            return res.status(400).end();
        } else {
            for(var user_i = 0; user_i < users.length; ++user_i) {
                if(users[user_i].email === email) {
                    if(users[user_i].password === password) {
                        return res.status(200).end();
                    }
                }
            }
            return res.status(400).end();
        }
    });
};