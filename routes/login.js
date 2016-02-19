// get the sample json for alarm data
var users = require('../sampleUsers.json');

exports.checkLoginCredentials = function(req, res) {
    var email    = req.body.email;
    var password = req.body.password;

    console.log(email + "\n" + password);

    // loop through all users
    var allUsers = users.users;
    for(var i = 0; i < allUsers.length; ++i) {
        var user_i = allUsers[i];
        if(user_i.email === email) {
            if(user_i.password === password) {
                console.log("YAY!");
                res.status(200).end();
                return 0;
            }
        }
    }

    res.status(400).end();
    return 1;
};

exports.addUser = function(req, res) {};

exports.getAll = function(req, res) {
    res.json(alarmData["alarmData"]);
};