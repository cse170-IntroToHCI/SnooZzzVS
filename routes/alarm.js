// get the sample json for alarm data
var alarmData = require('../sampleAlarmData.json');

exports.addAlarmData = function(req, res) {
    var hour        = req.body.hour;
    var minute      = req.body.minute;
    var meridiem    = req.body.meridiem;

    var newAlarmData = {
        "hour": hour,
        "minute": minute,
        "meridiem": meridiem
    };

    alarmData["alarmData"].push(newAlarmData);
    res.json(alarmData);
    console.log(alarmData);
};

exports.getAll = function(req, res) {
    res.json(alarmData["alarmData"]);
};