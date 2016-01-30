/**
 * Created by pablo on 1/30/2016.
 */

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
});

module.exports = router;