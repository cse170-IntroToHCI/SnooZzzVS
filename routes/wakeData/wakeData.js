
var db = require('../../db');
var ObjectId = require('mongodb').ObjectID;
module.exports.wakeData = {};

module.exports.POST = function(req, res) {
    var date        = req.body.date;
    var hour        = req.body.hour;
    var minute      = req.body.minute;
    var meridiem    = req.body.meridiem;
    var feeling     = req.body.feeling;
    var sess = req.session;

    var newWakeData = {
        "date": date,
        "hour": hour,
        "minute": minute,
        "meridiem": meridiem,
        "feeling": feeling
    };

    // must use update when pushing to an array
    var wakeDataCollection = db.get().collection('wakeData');
    wakeDataCollection.update(
        {_id: ObjectId(sess.wakeObjectId)},
        {
            $push: {
                wakeData: {
                    $each: [newWakeData],
                    $sort: {date: 1}
                }
            }
        },
        function(err, result) {
            if(err) {
                console.log("Error Posting Wake Data");
                console.log(err);
                return res.status(400).end();
            } else {
                console.log("Posted Wake Data");
                return res.status(200).end();
            }
        }
    );
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

module.exports.PUT    = function(req, res) {
    var date = req.body.date;
    var wakeObjectId = req.session.wakeObjectId;
    var wakeDataCollection = db.get().collection('wakeData');
    wakeDataCollection.find({_id: ObjectId(wakeObjectId)}).toArray(function(err, wakeDataObjectArray) {
        if(err) {
            console.log("Error-Wake Data Error@GET: " + err);
            return res.status(400).end();
        } else {
            for(targetDate in wakeDataObjectArray[0].wakeData) {
                if(new Date(wakeDataObjectArray[0].wakeData[targetDate].date).getTime() === new Date(date).getTime()) {
                    wakeDataCollection.update(
                        {_id: ObjectId(wakeObjectId), "wakeData.date": date}, // query
                        {$set: {"wakeData.$" : req.body}},                     // update
                        function(err, update) {
                            if(err) {
                                console.log("Update Wake Data Failed");
                                console.log(err);
                                return res.status(400).end();
                            } else {
                                console.log("Wake Data Updated");
                                return res.status(200).send("Wake Data Updated").end();
                            }
                        });
                }
            }
        }
    });
};

module.exports.DELETE = function(req, res) {};

module.exports.SEARCH = function(req, res) {
    var date = req.query.date;
    var wakeObjectId = req.session.wakeObjectId;
    var wakeDataCollection = db.get().collection('wakeData');
    wakeDataCollection.find({_id: ObjectId(wakeObjectId)}).toArray(function(err, wakeDataObjectArray) {
        if(err) {
            console.log("Error-Wake Data Error@GET: " + err);
            return res.status(400).end();
        } else {
            console.log("Searching...");
            var wakeDataArray = wakeDataObjectArray[0].wakeData;
            for(wakeDataIndex in wakeDataArray) {
                var wakeDate = wakeDataArray[wakeDataIndex].date;
                if(new Date(wakeDate).getTime() === new Date(date).getTime()) {
                    console.log("Given Date Exists");
                    return res.status(200).send(wakeDataArray[wakeDataIndex]).end();
                }
            }

            console.log("Given Date Does Not Exist");
            return res.status(200).send().end();
        }
    });
};