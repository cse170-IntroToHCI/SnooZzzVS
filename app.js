var express = require('express');
var MongoStore = require('connect-mongo')(express);
var path = require('path');
var bodyParser = require('body-parser');
// setup connection to mongo database
var db = require('./db').connect();
// line responsible for getting our app started
var app = express();
var routes = require('./routes/routes');

// Taken from
// http://stackoverflow.com/questions/16711328/how-to-create-session-using-mongodb-in-node-js
// required to handle session cookies
/*app.use(express.cookieParser());
app.use(express.session({
    secret: 'MY_SECRET',
    cookie: {
        maxAge : 100000
    },
    store : new MongoStore({
        db: 'sessionstore'
    })
}));*/
app.use(session({
    secret: 'foo',
    store: new MongoStore({ db: db})
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
app.use('/', routes);

module.exports = app;