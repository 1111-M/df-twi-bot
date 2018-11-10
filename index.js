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
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET
});


var infoObj = {
  malaria: {
    information: "A disease caused by a plasmodium parasite, transmitted by the bite of infected mosquitoes.",
    symptoms: "Symptoms are chills, fever, and sweating, usually occurring a few weeks after being bitten.",
    treatment: "Treatment includes antimalarial drugs like Anti-parasite and Antibiotics.",
    cure: "Treatment includes antimalarial drugs like Anti-parasite and Antibiotics.",
    medicines: "Some of the medicines are: Dihydroartemisinin, Clindamycin"
  },
  diabetes: {
    information: "A group of diseases that result in too much sugar in the blood (high blood glucose). Type 1 diabetes - A chronic condition in which the pancreas produces little or no insulin. Type 2 diabetes - A chronic condition that affects the way the body processes blood sugar (glucose).",
    symptoms: "Often, there are no symptoms. When symptoms do occur, they include excessive thirst or urination, fatigue, weight loss, or blurred vision.",
    treatment: "Controlling blood sugar through diet, oral medications, or insulin is the main treatment. Regular screening for complications is also required.",
    cure: "Controlling blood sugar through diet, oral medications, or insulin is the main treatment. Regular screening for complications is also required.",
    medicines: "Some of the medicines are: Glimepiride, Insulin"
  },
  typhoid: {
    information: "A bacterial disease spread through contaminated food and water or close contact.",
    symptoms: "Symptoms include high fever, headache, belly pain, and either constipation or diarrhea.",
    treatment: "Treatment includes antibiotics and fluids.",
    cure: "Treatment includes antibiotics and fluids.",
    medicines: "Some of the medicines are: Ciprofloxacin, Amoxicillin"
  },
  jaundice: {
    information: "A liver condition that causes yellowing of a newborn baby's skin and eyes. Neonatal jaundice is common in preterm babies. The cause is often an immature liver. Infection, medications, or blood disorders may cause more serious cases.",
    symptoms: "Symptoms include yellowing of the skin and the whites of the eyes that appears within days after birth.",
    treatment: "In most cases, treatment isn't needed. Light therapy (phototherapy) can help resolve moderate or severe cases.",
    cure: "In most cases, treatment isn't needed. Light therapy (phototherapy) can help resolve moderate or severe cases.",
    medicines: "Medicines are not required usually. Light therapy, IV fluids can help resolve moderate or severe cases."
  },
  chicken_pox: {
    information: "A highly contagious viral infection causing an itchy, blister-like rash on the skin. Chickenpox is highly contagious to those who haven't had the disease or been vaccinated against it.",
    symptoms: "Skin: blister, scab, ulcers, or red spots. Whole body: fatigue, fever, or loss of appetite. Also common: headache, itching, sore throat, or swollen lymph nodes.",
    treatment: "Chickenpox can be prevented by a vaccine. Usually self-treatable, although high-risk groups may receive antiviral medications.",
    cure: "Chickenpox can be prevented by a vaccine. Usually self-treatable, although high-risk groups may receive antiviral medications.",
    medicines: "Some of the medicines are: Acetaminophen, Acyclovir, Diphenhydramine"
  },
  leprosy: {
    information: "A chronic, curable infectious disease mainly causing skin lesions and nerve damage. Leprosy is caused by infection with the bacterium Mycobacterium leprae. It mainly affects the skin, eyes nose and peripheral nerves",
    symptoms: "Symptoms include light colored or red skin patches with reduced sensation, numbness and weakness in hands and feet.",
    treatment: "Leprosy can be cured with 6-12 months of multi-drug therapy. Early treatment avoids disability.",
    cure: "Leprosy can be cured with 6-12 months of multi-drug therapy. Early treatment avoids disability.",
    medicines: "Some of the medicines are: Prednisone, Clarithromycin"
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
        var infoRequested = parameters.info_type;
        response = infoObj[disease][infoRequested];
        console.log(response);
        var askNext = '\n\nWhat else would you like to know?';
        // Return the results to API.AI
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json({ 'fulfillmentText': response + askNext, 'source': 'df-twi-bot' });
        break;
      }
    };
    if(response === undefined) {
      response = "Oh! that's embarrassing for me. That didnt work. Please try something else"
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ 'fulfillmentText': response, 'source': 'df-twi-bot' });
    }
  }
  res.status(200);  
});

app.listen((process.env.PORT || 8000), function () {
  console.log('Server up and listening');
});
