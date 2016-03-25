var DEBUG = 1;
var db = require('../../db');
var ObjectId = require('mongodb').ObjectID;
module.exports.wakeData = {};

module.exports.POST = function(req, res) {
    var date        = req.body.date,
        meridiem    = req.body.meridiem,
        feeling     = req.body.feeling,
        sess        = req.session;

    var formatDateArray = date.split(":");
    date = formatDateArray[0]+":"+formatDateArray[1];

    var newWakeData = {
        "date": date,
        "meridiem": meridiem,
        "feeling": feeling
    };

    var wakeDataCollection = db.get().collection('wakeData');
    wakeDataCollection.update(
        {_id: ObjectId(sess.wakeObjectId)},
        {$push: {wakeData: newWakeData}}
    );
    return res.status(200).end();
};

module.exports.GET = function(req, res) {
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
