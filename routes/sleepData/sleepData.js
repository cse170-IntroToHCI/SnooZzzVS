
var db = require('../../db');
var ObjectId = require('mongodb').ObjectID;
module.exports.sleepData = {};

module.exports.POST = function(req, res) {
    var date        = req.body.date;
    var hour        = req.body.hour;
    var minute      = req.body.minute;
    var meridiem    = req.body.meridiem;
    var sleepFeeling = req.body.sleepFeeling;
    var sess = req.session;

    var newSleepData = {
        "date": date,
        "hour": hour,
        "minute": minute,
        "meridiem": meridiem,
        "sleepFeeling": sleepFeeling
    };

    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.update(
        {_id: ObjectId(sess.sleepObjectId)},
        {$push: {sleepData: newSleepData}}
    );
    return res.status(200).end();
};

module.exports.GET = function(req, res) {
    var email = req.session.email;
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.find({_id: ObjectId(req.session.sleepObjectId)}).toArray(function(err, sleepDataObject) {
        if(err) {
            console.log("Error-Sleep Data Error@GET: " + err);
            return res.status(400).end();
        } else {
            console.log("Fetching SleepData...");
            var sleepData = sleepDataObject[0].sleepData;
            console.log(sleepData);
            return res.status(200).send(sleepData).end();
        }
    });
};

module.exports.PUT    = function(req, res) {};

module.exports.DELETE = function(req, res) {};