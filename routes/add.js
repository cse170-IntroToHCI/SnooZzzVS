var wakeData = require("../sampleWakeData.json");

exports.addWakeData = function(req, res) {
    var date = req.query.date;
    var hour = req.query.hour;
    var minute = req.query.minute;
    var meridiem = req.query.meridiem;
    var wakeFeeling = req.query.wakeFeeling;
    var newWakeData = {
        "date": date,
        "hour": hour,
        "minute": minute,
        "meridiem": meridiem,
        "wakeFeeling": wakeFeeling
    };

    res.render('add');
    wakeData["wakeData"].push(newWakeData);
};