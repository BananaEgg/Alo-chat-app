import { addElementHtml, removeElementHtml, getRandomColor } from "/utils.js";
import { ChatFooter } from "./html.js";
import { Message, Chat, SideBar, ChatWindow, NewChat } from "./components.js";

//TODO change margin for a replying message
const ChatView = (socket, currentUser) => {
  var allUsers = {};
  var currentChat = { chat: "public chat", group: true };
  ChatWindow(currentChat);
  SideBar(currentUser);
  addElementHtml("messageTreadContainer", "div", "chatFooter", ChatFooter);

  socket.on("income message", (msg) => {
    if (msg.author.userID === currentUser.userID) {
      msg.sentByUser = true;
      Message(msg,currentUser);
    } else {
      msg.author.color = allUsers[msg.author.userID].color;
      msg.sentByUser = false;
      Message(msg,currentUser);
    }
    let messageThread = document.getElementById("messageTread");
    messageThread.scrollTop = messageThread.scrollHeight;
  });

  socket.on("all users", (users) => {
    allUsers = filterOnlineUsers(users);
    for (const user in allUsers) {
      Chat(allUsers[user]);
      allUsers[user].color = getRandomColor();
    }
  });

  socket.on("user joined", (user) => {
    NewChat(user);
    user.color = getRandomColor();
    allUsers[user.userID] = user;
  });

  socket.on("user offline", (user) => {
    removeElementHtml(user.userID);
    if (user) {
      Chat(user);
    }
  });

  socket.on("user online", (user) => {
    removeElementHtml(user.userID);
    NewChat(user);
  });

  const checkSubmit = (e) => {
    if (e.which === 13 && !e.shiftKey) {
      sendMessage();
    }
  };

  const sendMessage = () => {
    let message = document.getElementById("messageInput").value;
    message = message.trim();
    if (message !== "") {
      document.getElementById("messageInputForm").reset();
      document.getElementById("messageInput").focus();
      let today = new Date();
      let time =
        today.getHours() +
        ":" +
        (today.getMinutes() < 10
          ? "0" + today.getMinutes()
          : today.getMinutes());

      socket.emit("outgoing message", {
        message: message,
        time: time,
        chat: currentChat,
      });
    }
  };

  const filterOnlineUsers = (users) => {
    let online = {};
    let offline = {};
    for (const user in users) {
      if (users[user].online) {
        online[user] = users[user];
      } else {
        offline[user] = users[user];
      }
    }
    return { ...online, ...offline };
  };

  window.sendMessage = sendMessage;
  window.checkSubmit = checkSubmit;
};

export { ChatView };
