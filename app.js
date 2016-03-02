var express = require('express');
//var redis = require('redis');
//var cookieParser = require('cookie-parser');
var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
//var mongoStore = require('connect-mongodb');
//var MongoStore = require('connect-mongostore')(session);
var MongoStore = require('connect-mongo/es5')(session);
//var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
// setup connection to mongo database
var db = require('./db');
db.connect();
// line responsible for getting our app started
var app = express();

app.use(session({
    store: new MongoStore({
        url: db.getURI()
    }),
    secret: 'joke2',
    saveUninitialized: true,
    resave: true
}));

// setting our default views to the views directory
app.set('views', path.join(__dirname, 'views'));
// set the view engine
app.set('view engine', 'html');
// this allows me to use .html (instead of .ejs files) for html rendering
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
}));

var routes = require('./routes/routes');
app.use('/', routes);

module.exports = app;