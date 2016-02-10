var wakeData = require('../sampleWakeData');

exports.view = function(req, res) {
    console.log(data);
    res.render('wake', wakeData);
};