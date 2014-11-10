/**
 * This module controls the server itself, including dynamic and static data.
 */

var express    = require('express'),
    bodyParser = require('body-parser');
    Promise    = require('es6-promise').Promise,
    crypt      = require('./crypt.js');
    sc_module  = require('./studentcenter');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/html'));

app.post('/courses', function (req, res) {
  console.log('Received request at /');

  // Get the encoded username and pw from the request
  // var netid = crypt.decode(req.query.netid);
  // var password = crypt.decode(req.query.password);
  var netid    = req.body.netid;
  var password = req.body.password;

  var sc = new sc_module();
  sc.init(netid, password)
    .then(function (StudentCenter) {
      console.log('Logged in successfully.');
      StudentCenter.getCourses().then(function (courses) {
        res.send(JSON.stringify(courses));
        console.log();
      });
    })
    .catch(console.error);
});

// Actually start the server
app.listen(app.get('port'), function() {
  console.log('Server running on port ' + app.get('port'));
});