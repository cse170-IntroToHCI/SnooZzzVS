
var db = require('../../db');
var ObjectId = require('mongodb').ObjectID;
module.exports.sleepData = {};

module.exports.POST = function(req, res) {
    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.update(
        {
            _id: ObjectId(sleepObjectId)
        },
        {
            $push: {
                sleepData: {
                    $each: [req.body],
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
    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.find(
        {
            _id: ObjectId(sleepObjectId)
        }).toArray(function(err, sleepDataObject) {
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
    console.log("Updating ...");
    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.update(
        {   // query
            _id: ObjectId(sleepObjectId),
            sleepData: req.body.query
        },
        {   // update
            $set: {
                "sleepData.$" : req.body.update
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
};

module.exports.DELETE = function(req, res) {
    var sleepObjectId = req.session.sleepObjectId;
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.update(
        {
            _id: ObjectId(sleepObjectId)
        },
        {
            $pull: {
                sleepData: req.query
            }
        },
        function(err, result) {
            if(err) {
                console.log("err", err);
                return res.status(400).end();
            } else {
                console.log("Deleted!");
                return res.status(200).end();
            }
        }
    );
};

module.exports.SEARCH = function(req, res) {
    var date = req.query.date;
    var sleepObjectId = req.session.sleepObjectId;

    console.log("Searching for " +date+ " in Database...");
    var sleepDataCollection = db.get().collection('sleepData');
    sleepDataCollection.find(
        {   // query
            _id: ObjectId(sleepObjectId)
        }).toArray(function(err, result) {
        if(err) {
            console.log("Error-Sleep Data Error@GET: " + err);
            return res.status(400).end();
        } else if(result) {
            // result array is empty
            if(result.length === 0) {
                console.log("Given Date Does Not Exist");
                return res.status(200).send().end();
            } else {
                var resultArray = [];
                var sleepDataArray = result[0].sleepData;
                for(sleepDataIndex in sleepDataArray) {
                    var sleepDate = sleepDataArray[sleepDataIndex].date;
                    if(sleepDate === date) {
                        resultArray.push(sleepDataArray[sleepDataIndex]);
                    }
                }
                // No matching date found
                if(resultArray.length === 0) {
                    console.log("Given Date Does Not Exist");
                    return res.status(200).send().end();
                }
                console.log("Given Date Exists");
                return res.status(200).send(resultArray);
            }
        }
    });
};
