const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const dbConfig = require('./db-config.json');

const user = require('./routes/user');
const chat = require('./routes/chat');

const db = mysql.createPool({
  host: dbConfig.host,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  timezone: dbConfig.timezone,
  connectionLimit: dbConfig.connectionLimit,
});

app.use(cors());
app.use(express.json());

app.use('/api/0.1/user', user);
app.use('/api/0.1/chat', chat);

app.listen(3001, (req, res) => {
  console.log('server is listening on port 3001');
});
