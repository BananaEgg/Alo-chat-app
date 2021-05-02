const express = require("express");
var fs = require("fs").promises;
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const config = require("./config/config");

app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

http.listen(process.env.PORT || 5000, () => {
  console.log("Server started :-) ");
});

//TODO add to utils file -------
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

const addUserToGroup = (user, roomId) => {
  chats[roomId].participants.push(user);
  //TODO prevent user duplication
  sockets[user.userID].join(roomId);
};

const createRoom = (users, roomId) => {
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

var sockets = {};
var users;
var chats = { "public chat": { name: "Public chat", participants: [] } };
const publicChatId = "public chat";
createRoom(users, publicChatId);
const setUpServer = async () => {
  users = await getUsers();
};

setUpServer().then(() => {
  io.on("connection", (socket) => {
    socket.on("join again", (userID) => {
      sockets[userID] = socket;
      if (users[userID]) {
        users[userID].socketId = socket.id;
        users[userID].online = true;
        updateUsers(users);
        socket.emit("successfully signedIn");
        socket.emit("all users", excludeOne(userID, users));
        io.to(publicChatId).emit("user online", users[userID]);
        addUserToGroup(users[userID], publicChatId);
      } else {
        socket.emit("bad credentials");
        console.error("undefined user trying to join");
      }
    });

    socket.on("check name", (name) => {
      const nameList = Object.keys(users).map((a) => users[a].name);
      if (Object.values(nameList).includes(name)) {
        socket.emit("name approval", false);
      } else {
        const userID = uuid();
        sockets[userID] = socket;
        const newUser = {
          name,
          socketId: socket.id,
          online: true,
          userID: userID,
        };
        users[userID] = newUser;
        updateUsers(users);
        socket.emit("name approval", { name, userID });
        socket.emit("all users", excludeOne(userID, users));
        io.to("public chat").emit("user joined", newUser);
        addUserToGroup(users[userID], publicChatId);
      }
    });

    socket.on("outgoing message", (message) => {
      message._id = uuid();
      message.author = userBySocketId(socket.id);
      if (message.chat.group) {
        io.to(message.chat.chat).emit("income message", message);
      }

      //TODO add single user message
    });

    socket.on("disconnect", function () {
      try {
        let user = userBySocketId(socket.id);
        user.online = false;
        updateUsers(users);
        delete sockets[socket.id];
        io.to("public chat").emit("user offline", user);
      } catch (err) {
        console.error(err, "Error while user disconnected");
      }

      //TODO add update offline
    });
  });
});
// function findUserByName(name) {
//   for (let socketId in users) {
//     if (users[socketId].name === name.toLowerCase()) {
//       return socketId;
//     }
//   }
//   return false;
// }

const userBySocketId = (id) => {
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
