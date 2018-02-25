var express = require('express');
var request = require('request');
var qs = require('querystring');
var Twit = require('twit');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());

var twitObj = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

app.post('/createDefaultWelcomeMsg', function (req, res) {
  var qs = {
    name: req.body.name,
    welcome_message: {
      message_data: {
        text: req.body.message
      }
    }
  };

  twitObj.post('direct_messages/welcome_messages/new', qs, function(err, data, response) {
    if(err) {
      console.log(err);
      res.status(500);
    } else {
      console.log(data);
      res.status(200).json(data);
    }    
  });  
});

app.post('/createWelcomeMessageRule', function (req, res) {
  var overwriteEnvMsgId = req.body.should_overwrite;
  var qs;
  if(overwriteEnvMsgId === true) {
    if(req.body.welcome_msg_id === undefined || req.body.welcome_msg_id === null  || req.body.welcome_msg_id === '') {
      res.status(400).json({ error_msg: 'Please provide message ID if overwrite is true'});
    } else {
      qs = {
        welcome_message_rule: {
          welcome_message_id: req.body.welcome_msg_id
        }
      };
    }
  } else {
    qs = {
      welcome_message_rule: {
        welcome_message_id: process.env.TWITTER_DEFAULT_WELCOME_MSG_ID  
      }
    };
  }

  if(qs !== undefined) {
    twitObj.post('direct_messages/welcome_messages/rules/new', qs, function(err, data, response) {
      if(err) {
        console.log(err);
        res.status(500);
      } else {
        console.log(data);
        res.status(200).json(data);
      }    
    });
  }   
});


app.post('/interact', function (req, res) {
  console.log(req);
  var action = req.body.result.action; // action info

  // var issue = '';

  if (action === 'info') {
    console.log(req.body);
  }
  res.status(200);
});

app.listen((process.env.PORT || 8000), function () {
  console.log('Server up and listening');
});