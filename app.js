var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

// set the routes
var routes = require('./routes/index');
var add = require('./routes/add');

// line responsible for getting our app started
var app = express();

// setting our default views to the views directory
app.set('views', path.join(__dirname, 'views'));
// set the view engine
app.set('view engine', 'html');
// this allows me to use .html (instead of .ejs files) for html rendering
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use('/', routes);
app.get('/add', add.addWakeData);

module.exports = app;