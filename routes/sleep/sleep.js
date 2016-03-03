
var db = require('../../db');
module.exports.sleep = {};

module.exports.POST   = function(req, res) {
    var date        = req.body.date;
    var hour        = req.body.hour;
    var minute      = req.body.minute;
    var meridiem    = req.body.meridiem;
    var sleepFeeling = req.body.sleepFeeling;

    var newSleepData = {
        "date": date,
        "hour": hour,
        "minute": minute,
        "meridiem": meridiem,
        "sleepFeeling": sleepFeeling
    };

    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.insertOne(newSleepData);
    return res.status(200).end();
};

module.exports.GET    = function(req, res) {
    var email = req.session.email;
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.find({email: email}).toArray(function(err, sleepData) {
        if(err) {
            console.log("Error-Sleep Data Error: " + err);
            return res.status(400).end();
        } else {
            console.log("Fetching Data...");
            return res.status(200).json(sleepData).end();
        }
    });
};

module.exports.PUT    = function(req, res) {};

module.exports.DELETE = function(req, res) {};