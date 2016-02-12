// get the sample json for sleep data
var sleepData = require('../sampleSleepData.json');

exports.addSleepData = function(req, res) {
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

    console.log(newSleepData);
    sleepData["sleepData"].push(newSleepData);
    res.json(sleepData);
};

exports.getAll = function(req, res) {
    res.json(sleepData["sleepData"]);
};