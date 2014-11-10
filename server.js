/**
 * This module controls the server itself, including dynamic and static data.
 */

var express = require('express'),
    Promise = require('es6-promise').Promise;
    sc_module = require('./studentcenter');

var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + 'html'));

app.get('/courses', function (req, res) {
  console.log('Received request at /');
  var sc = new sc_module();
  sc.init()
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