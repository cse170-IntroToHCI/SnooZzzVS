'use strict';

var express = require('express');
var router = express.Router();
var wakeData = require('./wake');
var sleepData = require('./sleep');
var alarmData = require('./alarm');
var users = require('./login');
var user = require('./user/user');

/*
*  Helper Functions
*/
var authenticate = function(req, res, next) {
    if(req.session.email) {
        return next();
    } else {
        console.log("Authentication Failure.");
        return res.status(401).redirect('/');
    }
};

var stillLoggedIn = function(req, res, next) {
    if(req.session.email) {
        return res.status(200).redirect('/index');
    } else {
        return next();
    }
};

/*
 *  Routes
 */
router.get('/signup', stillLoggedIn, function(req, res) {
    res.render('signup');
});

router.get('/', stillLoggedIn, function(req, res) {
    res.render('login');
});

router.get('/login', stillLoggedIn, function(req, res) {
    res.render('login');
});

router.get('/index', authenticate, function(req, res) {
    res.render('index');
});

router.get('/home', authenticate, function(req, res) {
    res.render('index');
});

router.get('/sleep', authenticate, function(req, res) {
    res.render('sleep');
});

router.get('/wake', authenticate, function(req, res) {
    res.render('wake');
});

router.get('/happinessHistory', authenticate, function(req, res) {
    res.render('happinessHistory');
});

router.get('/compare', authenticate, function(req, res) {
    res.render('compare');
});

router.get('/compare2', authenticate, function(req, res) {
    res.render('compare2');
});

router.get('/account', authenticate, function(req, res) {
    res.render('account');
});

router.get('/help', authenticate, function(req, res) {
    res.render('help');
});

// FOR DB "JSON"
router.post('/postWakeData', wakeData.addWakeData);
router.get('/getAllWakeData', wakeData.getAll);

router.post('/postSleepData', sleepData.addSleepData);
router.get('/getAllSleepData', sleepData.getAll);

router.post('/postAlarmData', alarmData.addAlarmData);
router.get('/getAllAlarmData', alarmData.getAll);

router.post('/login', users.checkLoginCredentials);
router.post('/signup', users.addUser);

// FOR MONGODB


/*
*  Routes/pages that we didn't have time to implement
*  or are considered useless
*/
router.get('/alarm', function(req, res) {
    res.render('alarm');
});

router.get('/alarmSounds', function(req, res) {
    res.render('alarmSounds');
});

router.get('/addAlarm', function(req, res) {
    res.render('addAlarm');
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

// ------------- eof ---------------

module.exports = router;