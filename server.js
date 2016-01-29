var express = require('express');
var path = require('path');
var app = express();

// tells express to look files to render in views directory
//app.set('views', __dirname + '/views');
//app.set('view engine', 'html');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
// app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/views'));

// set the home page route
app.get('/', function(req, res) {
    res.render('index.html');
});

app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});