'use strict';

var express = require('express');
var router = express.Router();

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

router.get('/settings', function(req, res) {
    res.render('settings');
});

router.get('/login', function(req, res) {
    res.render('login');
});

router.get('/signup', function(req, res) {
    res.render('signup');
});

module.exports = router;