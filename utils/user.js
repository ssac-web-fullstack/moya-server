const users = [];

const removeById = (array, id) => {
  const index = array.findIndex((arr) => arr.id === id);
  array.splice(index, 1);
};

const addUser = ({ id, name, room }) => {
  if (!name || !room) return { error: 'Username and room are required.' };
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.room === room && user.name === name
  );
  // if (existingUser) return { error: 'Username already exists.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
};

const removeUser = (id) => {
  removeById(users, id);
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = { addUser, removeUser, getUser, getUsersInRoom };
