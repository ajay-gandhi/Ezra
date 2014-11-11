var express      = require('express'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    Promise      = require('es6-promise').Promise,
    crypt        = require('./crypt.js'),
    sc_module    = require('./studentcenter');

var app = express();

var students = {};
var timeouts = {};

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
app.post('/login', function (req, res) {
  // Get the encoded username and pw from the request
  var netid    = req.body.netid;
  var password = req.body.password;

  if (students[netid]) {
    update_timeout(netid);
    res.send('true');
  }

  var sc = new sc_module();
  sc.login(netid, password)
    .then(function (StudentCenter) {
      // Store the student's headless browser locally
      students[netid] = StudentCenter;
      // Update the timeout that deletes that student's browser (logout)
      update_timeout(netid);
      res.send('true');
    })
    .catch(function () {
      res.send('false');
    });
});

// Display the student's courses in JSON
app.get('/courses', function (req, res) {
  var netid = req.query.netid;
  var StudentCenter = students[netid];

  // Get the student's courses
  StudentCenter.getCourses().then(function (courses) {
    res.send(JSON.stringify(courses));
  });
});

// Start the server
app.listen(app.get('port'), function() {
  console.log('Server running on port ' + app.get('port'));
});


/******************************************************************************/
/******************************* Local Function *******************************/
/******************************************************************************/

var update_timeout = function (netid) {
  var login_expiration_time = 300000; // 5 minutes

  var t = setTimeout(function () {
    delete students[netid];
    delete timeouts[netid];
  }, login_expiration_time);

  timeouts[netid] = t;
}