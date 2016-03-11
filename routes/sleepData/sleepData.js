
var db = require('../../db');
var ObjectId = require('mongodb').ObjectID;
module.exports.sleepData = {};

function compare(a,b) {
    if (a.date < b.date)
        return -1;
    else if (a.date > b.date)
        return 1;
    else
        return 0;
}

module.exports.POST = function(req, res) {
    var thedate     = req.body.date;
    var hour        = req.body.hour;
    var minute      = req.body.minute;
    var meridiem    = req.body.meridiem;
    var feeling     = req.body.feeling;
    var sess        = req.session;

    var newSleepData = {
        "date": thedate,
        "hour": hour,
        "minute": minute,
        "meridiem": meridiem,
        "feeling": feeling
    };

    // must use update when pushing to an array
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.update(
        {_id: ObjectId(sess.sleepObjectId)},
        {$push: {
                sleepData: {
                    $each: [newSleepData],
                    $sort: {date: 1}
                }
            }
        },
        function(err, result) {
            if(err) {
                console.log("Error Posting Sleep Data");
                console.log(err);
                return res.status(400).end();
            } else {
                console.log("Posted Sleep Data");
                return res.status(200).end();
            }
        }
    );
};

module.exports.GET = function(req, res) {
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.find({_id: ObjectId(req.session.sleepObjectId)}).toArray(function(err, sleepDataObject) {
        if(err) {
            console.log("Error-Sleep Data Error@GET: " + err);
            return res.status(400).end();
        } else {
            console.log("Fetching SleepData...");
            var sleepData = sleepDataObject[0].sleepData;
            return res.status(200).send(sleepData).end();
        }
    });
};

module.exports.PUT    = function(req, res) {
    var date = req.body.date;
    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.find({_id: ObjectId(sleepObjectId)}).toArray(function(err, sleepDataObjectArray) {
        if(err) {
            console.log("Error-Sleep Data Error@GET: " + err);
            return res.status(400).end();
        } else {
            for(targetDate in sleepDataObjectArray[0].sleepData) {
                if(new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getTime() === new Date(date).getTime()) {
                    sleepDataCollection.update(
                        {_id: ObjectId(sleepObjectId), "sleepData.date": date}, // query
                        {$set: {"sleepData.$" : req.body}},                     // update
                        function(err, update) {
                            if(err) {
                                console.log("Update Sleep Data Failed");
                                console.log(err);
                                return res.status(400).end();
                            } else {
                                console.log("Sleep Data Updated");
                                return res.status(200).end();
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
    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.find({_id: ObjectId(sleepObjectId)}).toArray(function(err, sleepDataObjectArray) {
        if(err) {
            console.log("Error-Sleep Data Error@GET: " + err);
            return res.status(400).end();
        } else {
            console.log("Searching...");
            var sleepDataArray = sleepDataObjectArray[0].sleepData;
            for(sleepDataIndex in sleepDataArray) {
                var sleepDate = sleepDataArray[sleepDataIndex].date;
                if(new Date(sleepDate).getTime() === new Date(date).getTime()) {
                    console.log("Given Date Exists");
                    return res.status(200).send(sleepDataArray[sleepDataIndex]).end();
                }
            }

            console.log("Given Date Does Not Exist");
            return res.status(200).send().end();
        }
    });
};
