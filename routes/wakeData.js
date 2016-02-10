var sampleWakeData = require("../sampleWakeData.json");

exports.addWakeData = function(req, res) {
    var date = req.query.date;
    var hour = req.query.hour;
    var minute = req.query.minute;
    var meridiem = req.qeury.meridiem;
    var newWakeData = {
        date: date,
        hour: hour,
        minute: minute,
        meridiem: meridiem
    };

    res.render('wakeData');
    data["wakeData"].push(newWakeData);
};