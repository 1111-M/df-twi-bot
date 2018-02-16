const express = require('express');

const app = express();

// const request = require('request');

const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(bodyParser.json());


app.post('/', (req, res) => {
  console.log(req);
  const action = req.body.result.action; // action info

  // const issue = '';

  if (action === 'info') {
    console.log(req.body);
  }
  res.status(200);
});

app.listen((process.env.PORT || 8000), () => {
  console.log('Server up and listening');
});
