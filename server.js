const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const regist = require('./routes/regist');
const login = require('./routes/login');
const board = require('./routes/board');
const chat = require('./routes/chat');

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use('/api/0.1/regist', regist);
app.use('/api/0.1/login', login);
app.use('/api/0.1/board', board);
app.use('/api/0.1/chat', chat);

app.listen(process.env.PORT, (req, res) => {
  console.log('server is listening on port', process.env.PORT);
});
