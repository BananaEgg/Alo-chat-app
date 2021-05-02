import {
  addElementHtml,
  removeElementHtml,
  getRandomColor,
} from "/utils.js";
import { ChatFooter } from "./html.js";
import { Message, Chat, SideBar, ChatWindow, NewChat } from "./components.js";

//TODO change margin for a replying message
const ChatView = (socket) => {
  var allUsers = {};
  var currentChat = { chat: "public chat", group: true };
  ChatWindow(currentChat);
  SideBar();
  addElementHtml("messageTreadContainer", "div", "chatFooter", ChatFooter);

  socket.on("income message", (msg) => {
    const signedInUser = JSON.parse(localStorage.getItem("aloChatUser"));
    if (msg.author.userID === signedInUser.userID) {
      msg.sentByUser = true;
      Message(msg);
    } else {
      msg.author.color = allUsers[msg.author.userID].color;
      msg.sentByUser = false;
      Message(msg);
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
    Chat(user);
  });

  socket.on("user online", (user) => {
    removeElementHtml(user.userID);
    Chat(user);
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
