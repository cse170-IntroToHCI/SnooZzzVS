'use strict';

var express = require('express');
var router = express.Router();
var sleepData = require('./sleepData/sleepData');
var wakeData = require('./wakeData/wakeData');

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
 *  Public Routes
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

/*
 *  MongoDB Routes
 */
router.post('/sleepData', sleepData.POST);
router.get('/sleepData', sleepData.GET);
router.put('/sleepData', sleepData.PUT);
router.delete('/sleepData', sleepData.DELETE);

router.post('/wakeData', wakeData.POST);
router.get('/wakeData', wakeData.GET);
router.put('/wakeData', wakeData.PUT);
router.delete('/wakeData', wakeData.DELETE);

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

// ------------- eof ---------------

module.exports = router;