// get the sample json for wake data
var wakeData = require('../sampleWakeData.json');

exports.addWakeData = function(req, res) {
    var date        = req.body.date;
    var hour        = req.body.hour;
    var minute      = req.body.minute;
    var meridiem    = req.body.meridiem;
    var wakeFeeling = req.body.wakeFeeling;

    var newWakeData = {
        "date": date,
        "hour": hour,
        "minute": minute,
        "meridiem": meridiem,
        "wakeFeeling": wakeFeeling
    };

    console.log(newWakeData);
    wakeData["wakeData"].push(newWakeData);
    res.json(wakeData);
};

exports.getAll = function(req, res) {
    res.json(wakeData["wakeData"]);
};