const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send({message: 'hello world'});
});

// this endpoint is for verifying front-end reCaptcha
app.get('/grecaptcha', async (req, res) => {
  
  const url = 'https://www.google.com/recaptcha/api/siteverify';
  const secret = '6LfltbYUAAAAAMD8Lb-S58aGgohZuOKRGBsqpztI';

  let query = req.url.split('?')[1] + '&secret=' + secret;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }

  try {
    const resp = await fetch(url + '?' + query);
    const code = resp.status;
    const data = await resp.json();

    if (!data.success) {
      return res.status(400).json({message: data['error-codes']});
    }

    return res.status(code).json({data});

  } catch (error) {

    return res.status(500).json({message: 'Something went wrong...'});
  }
});


let numbers;

// back-end challenege
app.post('/data', (req, res) => {
  const arr = req.body;
  const message = 'Payload must a be list of EXACTLY 500 numbers!';

  if (!Array.isArray(arr)) {
    return res.status(400).json({message});
  }

  for (let item of arr) {
    if (typeof item !== 'number') {
      return res.status(400).json({message});
    }
  }

  if (arr.length !== 500) {
    return res.status(400).json({message});
  }

  numbers = arr;

  res.status(200).json('ok');
});

app.listen(8080, () => {
  console.log(`App is listening on port: 8080`);
});