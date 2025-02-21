const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


const app = express();
app.use(bodyParser.json());
app.use(cors());
module.exports = app;


const PORT = process.env.PORT || 3000;

const USER_ID = 'john_doe_17091999';
const EMAIL = 'john@xyz.com';
const ROLL_NUMBER = 'ABCD123';

app.post('/bfhl', (req, res) => {
  const { data } = req.body;

  if (!data || !Array.isArray(data)) {
    return res.status(400).json({ is_success: false, message: "Invalid input data" });
  }

  const odd_numbers = [];
  const even_numbers = [];
  const alphabets = [];

  data.forEach(item => {
    if (typeof item === 'string') {
      if (/^[0-9]+$/.test(item)) {
        const num = parseInt(item);
        if (num % 2 === 0) {
          even_numbers.push(item);
        } else {
          odd_numbers.push(item);
        }
      } else if (/^[A-Za-z]$/.test(item)) {
        alphabets.push(item);
      }
    }
  });

  res.json({
    is_success: true,
    user_id: USER_ID,
    email: EMAIL,
    roll_number: ROLL_NUMBER,
    odd_numbers,
    even_numbers,
    alphabets
  });
});

app.get('/bfhl', (req, res) => {
  res.json({ operation_code: 1 });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
