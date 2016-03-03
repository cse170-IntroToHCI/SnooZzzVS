var express = require('express');
//var redis = require('redis');
//var cookieParser = require('cookie-parser');
var session = require('express-session');
//var RedisStore = require('connect-redis')(session);
//var mongoStore = require('connect-mongodb');
//var MongoStore = require('connect-mongostore')(session);
//var MongoStore = require('connect-mongo/es5')(session);
//var mongoose = require('mongoose');
var path = require('path');
var bodyParser = require('body-parser');
var db = require('./db');
var app = express();
var user = require('./routes/user/user');
db.connect();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    //store: new MongoStore({
    //    url: db.getURI()
    //}),
    secret: 'supposedToBeASecret',
    saveUninitialized: true,
    resave: false
}));

//app.post('/user', user.POST);
app.post('/user', function(req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var email = req.body.email;
    var password = req.body.password;
    var sess = req.session;

    sess.firstName = firstName;
    sess.email = email;
    sess.sleepObjectId = db.randomObjectId();
    sess.wakeObjectId = db.randomObjectId();

    var newUser = {
        "firstName": firstName,
        "lastName": lastName,
        "email": email,
        "password": password,
        "sleepObjectId": sess.sleepObjectId,
        "wakeObjectId": sess.wakeObjectId,
        "session": sess
    };

    console.log("req.session: ");
    console.log(req.session);
    console.log("\n");
    console.log("req.session.id: "+req.session.id);
    // db call to add new user
    var usersCollection = db.get().collection('users');
    usersCollection.insertOne(newUser);

    res.status(200).json(newUser).end();
});

app.get('/user', user.GET);
app.put('/user', user.PUT);
app.delete('/user', user.DELETE);
// Login route
app.post('/user/login', user.loginPOST);
// Logout route
app.post('/user/logout', user.logoutPOST);

var routes = require('./routes/routes');
app.use('/', routes);

module.exports = app;