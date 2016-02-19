'use strict';

var express = require('express');
var router = express.Router();
var wakeData = require('./wake');
var sleepData = require('./sleep');
var alarmData = require('./alarm');
var login = require('./login');

router.get('/', function(req, res) {
    res.render('login');
});

router.get('/index', function(req, res) {
    res.render('index');
});

router.get('/home', function(req, res) {
    res.render('index');
});

router.get('/sleep', function(req, res) {
    res.render('sleep');
});

router.get('/wake', function(req, res) {
    res.render('wake');
});

router.get('/happinessHistory', function(req, res) {
    res.render('happinessHistory');
});

router.get('/enterGoals', function(req, res) {
    res.render('enterGoals');
});

router.get('/sleepData', function(req, res) {
    res.render('sleepData');
});

router.get('/wakeData', function(req, res) {
    res.render('wakeData');
});

router.get('/compare', function(req, res) {
    res.render('compare');
});

router.get('/alarm', function(req, res) {
    res.render('alarm');
});

router.get('/alarmSounds', function(req, res) {
    res.render('alarmSounds');
});

router.get('/addAlarm', function(req, res) {
    res.render('addAlarm');
});

router.get('/account', function(req, res) {
    res.render('account');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/signup', function(req, res) {
    res.render('signup');
});

router.get('/help', function(req, res) {
    res.render('help');
});

// FOR DB "JSON"
router.post('/postWakeData', wakeData.addWakeData);
router.get('/getAllWakeData', wakeData.getAll);

router.post('/postSleepData', sleepData.addSleepData);
router.get('/getAllSleepData', sleepData.getAll);

router.post('/postAlarmData', alarmData.addAlarmData);
router.get('/getAllAlarmData', alarmData.getAll);

router.post('/login', login.checkLoginCredentials);

module.exports = router;