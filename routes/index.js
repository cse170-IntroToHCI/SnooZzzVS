/**
 * Created by pablo on 1/30/2016.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

router.get('/sleep', function(req, res) {
    res.render('sleep');
});

router.get('/wake', function(req, res) {
    res.render('wake');
});

router.get('/happinesshistory', function(req, res) {
    res.render('happinessHistory');
});

router.get('/entergoals', function(req, res) {
    res.render('enterGoals');
});

// include routes for "/compare" and "/alarm"

module.exports = router;