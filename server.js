const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const dotenv = require('dotenv');

const user = require('./routes/user');
const board = require('./routes/board');
const chat = require('./routes/chat');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/0.1/user', user);
app.use('/api/0.1/board', board);
app.use('/api/0.1/chat', chat);

dotenv.config();
app.listen(process.env.PORT, (req, res) => {
  console.log('server is listening on port', process.env.PORT);
});
