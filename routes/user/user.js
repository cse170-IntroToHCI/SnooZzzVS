// Make DB calls here
// Make CRUD calls here
var db = require('../../db');

module.exports.user = {};

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
        "password": password
    };

    console.log(newUser);
    // db call to add new user
    //db.db.collection('users').insertOne(newUser);
    var collection = db.get().collection('users');
    collection.insertOne(newUser);

    res.status(200).end();
};