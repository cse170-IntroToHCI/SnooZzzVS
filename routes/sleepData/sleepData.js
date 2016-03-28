
var db = require('../../db');
var ObjectId = require('mongodb').ObjectID;
module.exports.sleepData = {};

module.exports.POST = function(req, res) {
    var date        = req.body.date;
    var hour        = req.body.hour;
    var minute      = req.body.minute;
    var meridiem    = req.body.meridiem;
    var feeling     = req.body.feeling;
    var sess        = req.session;

    var newSleepData = {
        "date": date,
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
    var date = req.body.date,
        hours = req.body.hour,
        meridiem = req.body.meridiem;
    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');

    sleepDataCollection.update(
        {   // query
            _id: ObjectId(sleepObjectId),
            "sleepData.date": date,
            "sleepData.hour": hours,
            "sleepData.meridiem": meridiem
        },
        {   // update
            $set: {
                "sleepData.$" : req.body
            }
        },
        function(err, update) {
            if(err) {
                console.log("Update Sleep Data Failed");
                console.log(err);
                return res.status(400).end();
            } else if(update) {
                console.log("Sleep Data Updated");
                return res.status(200).end();
            } else {
                console.log("No Sleep Data Updated");
                return res.status(200).end();
            }
        }
    );

    //sleepDataCollection.find({_id: ObjectId(sleepObjectId)}).toArray(function(err, sleepDataObjectArray) {
    //    if(err) {
    //        console.log("Error-Sleep Data Error@GET: " + err);
    //        return res.status(400).end();
    //    } else {
    //        var help = sleepDataObjectArray[0].sleepData;
    //        var myDate = new Date(date);
    //        console.log("myDate", myDate);
    //        for(var targetDate in help) {
    //            var splitHelpDate = help[targetDate].date.toString().split("/");
    //            var helpDate = new Date(
    //                splitHelpDate[2],       // year
    //                splitHelpDate[0]-1,     // month
    //                splitHelpDate[1],       // day
    //                help[targetDate].hour
    //            );
    //
    //            if(helpDate.getFullYear() === myDate.getFullYear() &&
    //               helpDate.getMonth() === myDate.getMonth() &&
    //               helpDate.getDate() === myDate.getDate() &&
    //               helpDate.getHours() === parseInt(hours) &&
    //               help[targetDate].meridiem === meridiem) {
    //                console.log("hello");
    //            }
    //        }
    //    }
    //});
};

module.exports.DELETE = function(req, res) {};

module.exports.SEARCH = function(req, res) {
    var date = req.query.date;
    var sleepObjectId = req.session.sleepObjectId;

    console.log("Searching...");
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.find(
        {   // query
            _id: ObjectId(sleepObjectId),
            "sleepData.date": date
        }).toArray(function(err, result) {
        if(err) {
            console.log("Error-Sleep Data Error@GET: " + err);
            return res.status(400).end();
        } else if(result) {
            console.log("Given Date Exists");
            var resultArray = [];
            var sleepDataArray = result[0].sleepData;
            for(sleepDataIndex in sleepDataArray) {
                var sleepDate = sleepDataArray[sleepDataIndex].date;
                if(sleepDate === date) {
                    resultArray.push(sleepDataArray[sleepDataIndex]);
                }
            }
            return res.status(200).send(resultArray);
        } else {
            console.log("Given Date Does Not Exist");
            return res.status(200).send().end();
        }
    });
};
