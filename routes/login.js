// get the sample json for alarm data
var users = require('../sampleUsers.json');

exports.checkLoginCredentials = function(req, res) {
    var email    = req.body.email;
    var password = req.body.password;

    // loop through all users
    var allUsers = users.users;
    for(var i = 0; i < allUsers.length; ++i) {
        var user_i = allUsers[i];
        if(user_i.email === email) {
            if(user_i.password === password) {
                res.status(200).end();
            }
        }
    }

    res.status(400).end();
};

exports.addUser = function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;

    var newUser = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password
    };

    users["users"].push(newUser);
    res.status(200).end();
};