var fs = require("fs").promises;

const excludeOne = (property, object) => {
  var clone = Object.assign({}, object);
  delete clone[property];
  return clone;
};

const createGroup = (users, roomName) => {
  const roomId = uuid();
  chats[roomId].participants = [];
  for (const user in Users) {
    chats[roomId].participants.push(users[user]);
  }

  return roomId;
};

const addUserToGroup = (user, roomId, chats, sockets) => {
  chats[roomId].participants.push(user);
  //TODO prevent user duplication
  sockets[user.userID].join(roomId);
};

const createRoom = (users, roomId, sockets) => {
  for (const user in users) {
    if (user.online) {
      sockets[user.userID].join(roomId);
    }
  }
};

const getUsers = async () => {
  let users = await fs
    .readFile(`${__dirname}/dataMock/users.json`)
    .catch((err) => {
      console.log(err);
    });
  return JSON.parse(users);
};

const updateUsers = (users) => {
  fs.writeFile(
    `${__dirname}/dataMock/users.json`,
    JSON.stringify(users),
    function (err) {
      if (err) throw err;
      console.log("added new user to DB");
    }
  );
};

const setUpServer = async () => {
  const users = await getUsers();
  return users;
};

const userBySocketId = (id, users) => {
  for (let user in users) {
    if (users[user].socketId === id) {
      return users[user];
    }
  }
  return false;
};

const uuid = () => {
  return new Date().getTime();
};

module.exports = {
  excludeOne,
  createGroup,
  createRoom,
  addUserToGroup,
  getUsers,
  updateUsers,
  setUpServer,
  userBySocketId,
  uuid,
};
