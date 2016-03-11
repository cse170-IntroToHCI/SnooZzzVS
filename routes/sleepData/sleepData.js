
var db = require('../../db');
var ObjectId = require('mongodb').ObjectID;
module.exports.sleepData = {};

module.exports.POST = function(req, res) {
    var date        = req.body.date;
    var hour        = req.body.hour;
    var minute      = req.body.minute;
    var meridiem    = req.body.meridiem;
    var feeling     = req.body.feeling;
    var sess = req.session;

    var newSleepData = {
        "date": date,
        "hour": hour,
        "minute": minute,
        "meridiem": meridiem,
        "feeling": feeling
    };

    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.update(
        {_id: ObjectId(sess.sleepObjectId)},
        {$push: {sleepData: newSleepData}}
    );
    return res.status(200).end();
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
    var updateData = {
        date: date,
        hour: req.body.hour,
        minute: req.body.minunte,
        meridiem: req.body.meridiem,
        feeling: req.body.feeling
    };

    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');
    console.log("req.body",req.body);
    sleepDataCollection.find({_id: ObjectId(sleepObjectId)}).toArray(function(err, sleepDataObjectArray) {
        if(err) {
            console.log("Error-Sleep Data Error@GET: " + err);
            return res.status(400).end();
        } else {
            console.log("sleepDataObjectArray",sleepDataObjectArray);
            console.log("******************************");
            console.log("sleepDataObjectArray[0].sleepData", sleepDataObjectArray[0].sleepData);
            console.log("******************************");
            for(targetDate in sleepDataObjectArray[0].sleepData) {
                console.log("targetDate:",targetDate);
                if(new Date(sleepDataObjectArray[0].sleepData[targetDate].date).getTime() === new Date(date).getTime()) {

                    //console.log("FOUND IT BEFORE: ", sleepDataObjectArray[0].sleepData[targetDate]);
                    //sleepDataObjectArray[0].sleepData[targetDate] = updateData;
                    //console.log("FOUND IT AFTER : ", sleepDataObjectArray[0].sleepData[targetDate]);
                    ////sleepDataCollection.save(
                    ////    {
                    ////        date: date,
                    ////        hour: ,
                    ////        minute: ,
                    ////        meridiem: ,
                    ////        feeling
                    ////    }
                    ////);
                    console.log("############################");

                    sleepDataCollection.find({_id: ObjectId(sleepObjectId), "sleepData.date": date}).toArray(function(err, wtf) {
                        console.log("err:",err);
                        console.log("wtf:",wtf);
                    });

                    sleepDataCollection.find({_id: ObjectId(sleepObjectId)}).toArray(function(err1, wtf1) {
                        console.log("err1:",err1);
                        console.log("wtf1:",wtf1);
                    });

                    sleepDataCollection.find({"sleepData.date": date}).toArray(function(err2, wtf2) {
                        console.log("err2:",err2);
                        console.log("wtf2:",wtf2);
                    });

                    sleepDataCollection.update({_id: ObjectId(sleepObjectId), "sleepData.date": date}, {$set: {"sleepData.$" : req.body}}, function(err, update) {
                        if(err) {
                            console.log("Update Sleep Data Failed");
                            console.log(err);
                            return res.status(400).end();
                        } else if(!update) {
                            console.log("Nothing found to update");
                            return res.status(200).end();
                        } else {
                            console.log("Sleep Data Updated");
                            console.log("+++++++++++++++++++++++++");
                            //console.log("update: ", update);
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