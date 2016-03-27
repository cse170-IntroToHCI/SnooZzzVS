var DEBUG = 1;
var db = require('../../db');
var ObjectId = require('mongodb').ObjectID;
module.exports.sleepData = {};

module.exports.POST = function(req, res) {
    var date        = req.body.date;
    var meridiem    = req.body.meridiem;
    var feeling     = req.body.feeling;
    var sess        = req.session;

    if(DEBUG === 0) console.log("Before @ Date:", date);
    var formatDateArray = date.split(":");
    date = formatDateArray[0]+":"+formatDateArray[1];
    if(DEBUG === 0) console.log("After  @ Date:", date);

    var newSleepData = {
        "date": date,
        "meridiem": meridiem,
        "feeling": feeling
    };

    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.update(
        { _id: ObjectId(sess.sleepObjectId) },
        { $push: {
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
                return res.status(400);
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
    var date        = req.body.date;
    var meridiem    = req.body.meridiem;
    var feeling     = req.body.feeling;
    var sess        = req.session;

    if(DEBUG) console.log("Before @ Date:", date);
    var formatDateArray = date.split(":");
    date = formatDateArray[0]+":"+formatDateArray[1];
    if(DEBUG) console.log("After  @ Date:", date);

    var newSleepData = {
        "date": date,
        "meridiem": meridiem,
        "feeling": feeling
    };

    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');
    console.log("req.body",req.body);
    sleepDataCollection.find({_id: ObjectId(sleepObjectId)}).toArray(function(err, sleepDataObjectArray) {
        if(err) {
            console.log("Error-Sleep Data Error@GET: ", err);
            return res.status(400).end();
        } else {
            //var sleepData = sleepDataObjectArray[0].sleepData;

            if(DEBUG === 0) {
                console.log("sleepDataObjectArray", sleepDataObjectArray);
                console.log("******************************");
                console.log("sleepDataObjectArray[0].sleepData", sleepDataObjectArray[0].sleepData);
                console.log("******************************");
            }
            console.log("My     Date:", date);
            for(targetDate in sleepDataObjectArray[0].sleepData) {
                if(new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getFullYear() === new Date(date).getFullYear() &&
                   new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getMonth() === new Date(date).getMonth() &&
                   new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getDate() === new Date(date).getDate() &&
                   new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getHours() === new Date(date).getHours() &&
                   sleepDataObjectArray[0].sleepData[targetDate].meridiem === meridiem) {
                    console.log("Target Date:", sleepDataObjectArray[0].sleepData[targetDate].date);
                    sleepDataCollection.update(
                        { _id: ObjectId(sess.sleepObjectId), $where:
                    function() {
                        var help = new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getFullYear() === new Date(date).getFullYear() &&
                            new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getMonth() === new Date(date).getMonth() &&
                            new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getDate() === new Date(date).getDate() &&
                            new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getHours() === new Date(date).getHours() &&
                            sleepDataObjectArray[0].sleepData[targetDate].meridiem === meridiem;
                        console.log("help", help);
                        return help;
                    }},  // query
                        { $push: {                                                      // update
                                sleepData: {
                                    $each: [newSleepData],
                                    $sort: {date: 1}
                                }
                          }
                        },
                        function(err, result) {
                            if(err) {
                                console.log("Update Sleep Data Failed:");//, err);
                                return res.status(400).end();
                            } else if(!result) {
                                console.log("No Data Found to Update");
                                return res.status(200).end();
                            } else {
                                console.log("Sleep Data Updated:");//, result);
                                return res.status(200).send("Sleep Data Updated").end();
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

    // Format the date
    if(DEBUG) console.log("Before @ Date:", date);
    var formatDateArray = date.split(":");
    date = formatDateArray[0]+":"+formatDateArray[1];
    if(DEBUG) console.log("After  @ Date:", date);
    if(DEBUG) {
        console.log("sleep date: " + date);
    }

    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.find({_id: ObjectId(sleepObjectId)}).toArray(function(err, sleepDataObjectArray) {
        if(err) {
            console.log("Error-Sleep Data Error@GET: ", err);
            return res.status(400).end();
        } else {
            console.log("Searching...");
            var sleepDataArray = sleepDataObjectArray[0].sleepData;
            for(sleepDataIndex in sleepDataArray) {
                var sleepDate = sleepDataArray[sleepDataIndex].date;
                if(new Date(sleepDate).getFullYear() === new Date(date).getFullYear() &&
                   new Date(sleepDate).getMonth()    === new Date(date).getMonth() &&
                   new Date(sleepDate).getDate()     === new Date(date).getDate()) {
                    console.log("Given Date Exists");
                    return res.status(200).send(sleepDataArray[sleepDataIndex]).end();
                }
            }

            console.log("Given Date Does Not Exist");
            return res.status(200).send().end();
        }
    });
};

