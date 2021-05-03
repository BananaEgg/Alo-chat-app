const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const services = require("./services.js");
app.use(express.static(`${__dirname}/public`));

app.get("/", (req, res) => {
  res.sendFile("/index.html");
});

http.listen(process.env.PORT || 5000, () => {
  console.log("Server started :-) ");
});

services.setUpServer().then((users) => {
  var sockets = {};
  var chats = { "public chat": { name: "Public chat", participants: {} } };
  const publicChatId = "public chat";
  services.createRoom(users, publicChatId, sockets);

  io.on("connection", (socket) => {
    socket.on("join again", (userID) => {
      sockets[userID] = socket;
      if (users[userID]) {
        users[userID].socketId = socket.id;
        users[userID].online = true;
        services.updateUsers(users);
        socket.emit("successfully signedIn");
        socket.emit("all users", services.excludeOne(userID, users));
        io.to(publicChatId).emit("user online", users[userID]);
        services.addUserToGroup(users[userID], publicChatId, chats, sockets);
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
        const userID = services.uuid();
        sockets[userID] = socket;
        const newUser = {
          name,
          socketId: socket.id,
          online: true,
          userID: userID,
        };
        users[userID] = newUser;
        services.updateUsers(users);
        socket.emit("name approval", { name, userID });
        socket.emit("all users", services.excludeOne(userID, users));
        io.to("public chat").emit("user joined", newUser);
        services.addUserToGroup(users[userID], publicChatId, chats, sockets);
      }
    });

    socket.on("outgoing message", (message) => {
      message._id = services.uuid();
      message.author = services.userBySocketId(socket.id, users);
      if (message.chat.group) {
        io.to(message.chat.chat).emit("income message", message);
      } else {
        sockets[message.chat].emit(services.userBySocketId(socket.id), message);
      }
    });

    socket.on("disconnect", function () {
      try {
        let user = services.userBySocketId(socket.id);
        user.online = false;
        services.updateUsers(users);
        delete sockets[socket.id];
        io.to("public chat").emit("user offline", user);
      } catch (err) {
        console.error(err, "Error while user disconnected");
      }
    });
  });
});
