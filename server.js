const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    credentials: true,
  },
});

const user = require('./routes/user');
const board = require('./routes/board');
const chat = require('./routes/chat');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./utils/user');

// app.use(cors());
app.use(express.json());

app.use('/api/0.1/user', user);
app.use('/api/0.1/board', board);
app.use('/api/0.1/chat', chat);

io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('message', ({ message }) => {
    console.log(message);
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { id: uuidv4(), message });
  });

  socket.on('join', ({ username, roomNo }) => {
    const { user } = addUser({ id: socket.id, name: username, room: roomNo });
    console.log(user);
    socket.join(user.room);
    io.to(roomNo).emit('message', {
      id: uuidv4(),
      message: `${roomNo}번방 입장하셨습니다`,
    });
    io.to(roomNo).emit('onConnect', { text: `${roomNo}번 입장` });
  });

  socket.on('disconnect', () => {
    removeUser(socket.id);
    console.log('연결이 종료');
  });
});

server.listen(3001, (req, res) => {
  console.log('server is listening on port 3001');
});
