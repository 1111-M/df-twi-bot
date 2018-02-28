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

var infoObj = {
  malaria: {
    info: "A disease caused by a plasmodium parasite, transmitted by the bite of infected mosquitoes.",
    symptoms: "Symptoms are chills, fever, and sweating, usually occurring a few weeks after being bitten.",
    treatment: "Treatment includes antimalarial drugs like Anti-parasite and Antibiotics."
  },
  diabetes: {
    info: "A group of diseases that result in too much sugar in the blood (high blood glucose). Type 1 diabetes - A chronic condition in which the pancreas produces little or no insulin. Type 2 diabetes - A chronic condition that affects the way the body processes blood sugar (glucose).",
    symptoms: "Often, there are no symptoms. When symptoms do occur, they include excessive thirst or urination, fatigue, weight loss, or blurred vision.",
    treatment: "Controlling blood sugar through diet, oral medications, or insulin is the main treatment. Regular screening for complications is also required."
  },
  typhoid: {
    info: "A bacterial disease spread through contaminated food and water or close contact.",
    symptoms: "Symptoms include high fever, headache, belly pain, and either constipation or diarrhea.",
    treatment: "Treatment includes antibiotics and fluids."
  },
  jaundice: {
    info: "A liver condition that causes yellowing of a newborn baby's skin and eyes. Neonatal jaundice is common in preterm babies. The cause is often an immature liver. Infection, medications, or blood disorders may cause more serious cases.",
    symptoms: "Symptoms include yellowing of the skin and the whites of the eyes that appears within days after birth.",
    treatment: "In most cases, treatment isn't needed. Light therapy (phototherapy) can help resolve moderate or severe cases."
  },
  chicken_pox: {
    info: "A highly contagious viral infection causing an itchy, blister-like rash on the skin. Chickenpox is highly contagious to those who haven't had the disease or been vaccinated against it.",
    symptoms: "Skin: blister, scab, ulcers, or red spots. Whole body: fatigue, fever, or loss of appetite. Also common: headache, itching, sore throat, or swollen lymph nodes",
    treatment: "Chickenpox can be prevented by a vaccine. Usually self-treatable, although high-risk groups may receive antiviral medications."
  }
};


app.post('/interact', function (req, res) {
  var response;
  var action = req.body.queryResult.action; // action info

  if (action === 'info') {
    console.log(req.body);
    var parameters = req.body.queryResult.parameters;

    for (var disease in infoObj) {
      if(disease === parameters.disease) {
        var info = parameters.information;
        response = infoObj[disease].info;
        // Return the results to API.AI
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ 'speech': response, 'displayText': response, 'source': 'df-twi-bot' });
        break;
      }
    };
  }
  res.status(200);  
});

app.listen((process.env.PORT || 8000), function () {
  console.log('Server up and listening');
});