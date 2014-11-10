var express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    Promise      = require('es6-promise').Promise,
    crypt        = require('./crypt.js'),
    sc_module    = require('./studentcenter');

var app = express();

// Enable POST requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

// Enable reading and writing of cookies
app.use(cookieParser());

app.set('port', (process.env.PORT || 5000));

// Static content in the html/ subdir
app.use(express.static(__dirname + '/html'));

// Requesting user's courses
app.post('/courses', function (req, res) {
  // Get the encoded username and pw from the request
  var netid    = req.body.netid;
  var password = req.body.password;

  var sc = new sc_module();
  sc.login(netid, password)
    .then(function (StudentCenter) {
      StudentCenter.getCourses().then(function (courses) {
        res.send(JSON.stringify(courses));
      });
    })
    .catch();
});

// Start the server
app.listen(app.get('port'), function() {
  console.log('Server running on port ' + app.get('port'));
});