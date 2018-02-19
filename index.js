var express = require('express');

var app = express();

// var request = require('request');

var bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());


app.post('/', function(req, res) {
  console.log(req);
  var action = req.body.result.action; // action info

  // var issue = '';

  if (action === 'info') {
    console.log(req.body);
  }
  res.status(200);
});

app.listen((process.env.PORT || 8000), function() {
  console.log('Server up and listening');
});
