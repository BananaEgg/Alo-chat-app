import { addElementHtml, addFirstChild, clearElementHtml } from "/utils.js";

const Message = (message) => {
  const time = message.time;
  const signInUser = JSON.parse(localStorage.getItem("aloChatUser"));
  if (message.sentByUser) {
    var html = `<div class="sentMessage textMessage"> <p class="messageText">${message.message}</p> 
    <p class="messageTime">${time}</p> </div>
    `;
  } else {
    var html = `<div class="receivedMessage textMessage"> <p class="messageAuthorName" style="color:${message.author.color}">${message.author.name}</p>  <p class="messageText">${message.message}</p> 
    <p class="messageTime">${time}</p> </div>
    `;
  }
  addElementHtml("messageTread", "div", message._id, html, "messageContainer");
};

const ChatWindow = (chat) => {
  const html = `<div id="messageTreadContainer"><div id="chatTitleBar"> <img  class="avatar" src="./images/groupAvatar.png"> <p class="userName"> ${chat.chat}</P> </div>  <div id="messageTread"></div></div>`;
  clearElementHtml("mainSpace");
  addElementHtml("mainSpace", "div", "chatView", html);
};

const Chat = (chat) => {
  if (chat.group) {
    var html = `<img  class="avatar" src="./images/avatarDefault.png">
    <p class="userName"> ${chat.name}</p>  <div class="userDivider"></div> `;
  } else {
    var html = `<img  class="avatar" src="./images/avatarDefault.png">
    <p class="userName"> ${chat.name}</p>  <p class="${
      chat.online ? "online" : "offline"
    }"> ${
      chat.online ? "online" : "offline"
    }</p> <div class="userDivider"></div> `;
  }
  addElementHtml("usersContainer", "span", chat.userID, html);
};

const NewChat = (chat) => {
  if (chat.group) {
    var html = `<img  class="avatar" src="./images/avatarDefault.png">
    <p class="userName"> ${chat.name}</p>  <div class="userDivider"></div> `;
  } else {
    var html = `<img  class="avatar" src="./images/avatarDefault.png">
    <p class="userName"> ${chat.name}</p>  <p class="${
      chat.online ? "online" : "offline"
    }"> ${
      chat.online ? "online" : "offline"
    }</p> <div class="userDivider"></div> `;
  }
  addFirstChild("usersContainer", "span", chat.userID, html);
};

const SideBar = (currentUser) => {
  const html = `<div id="sideBarHeader"> <img id="userProfilePic"  class="avatar" src="./images/minyonAvatar.jpg"><p class="userName" >${currentUser.name}</P></div>
  <div id="usersContainer"></div> 
  `;
  addFirstChild("chatView", "div", "sideBar", html);
};

export { Message, Chat, SideBar, ChatWindow, NewChat };
