
var db = require('../../db');
var ObjectId = require('mongodb').ObjectID;
module.exports.wakeData = {};

module.exports.POST = function(req, res) {
    var date        = req.body.date;
    var hour        = req.body.hour;
    var minute      = req.body.minute;
    var meridiem    = req.body.meridiem;
    var wakeFeeling = req.body.wakeFeeling;
    var sess = req.session;

    var newWakeData = {
        "date": date,
        "hour": hour,
        "minute": minute,
        "meridiem": meridiem,
        "wakeFeeling": wakeFeeling
    };

    var wakeDataCollection = db.get().collection('wakeData');
    wakeDataCollection.update(
        {_id: ObjectId(sess.wakeObjectId)},
        {$push: {wakeData: newWakeData}}
    );
    return res.status(200).end();
};

module.exports.GET = function(req, res) {
    var email = req.session.email;
    var wakeDataCollection = db.get().collection('wakeData');
    wakeDataCollection.find({_id: ObjectId(req.session.wakeObjectId)}).toArray(function(err, wakeDataObject) {
        if(err) {
            console.log("Error-Wake Data Error@GET: " + err);
            return res.status(400).end();
        } else {
            console.log("Fetching WakeData...");
            var wakeData = wakeDataObject[0].wakeData;
            return res.status(200).send(wakeData).end();
        }
    });
};

module.exports.PUT    = function(req, res) {};

module.exports.DELETE = function(req, res) {};