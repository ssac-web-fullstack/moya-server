const express = require('express');
const app = express();
const cors = require('cors');

const user = require('./routes/user');
const board = require('./routes/board');
const chat = require('./routes/chat');

app.use(cors());
app.use(express.json());

app.use('/api/0.1/user', user);
app.use('/api/0.1/board', board);
app.use('/api/0.1/chat', chat);

app.listen(3001, (req, res) => {
  console.log('server is listening on port 3001');
});
