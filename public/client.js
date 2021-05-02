import { ChatView } from "./views/chat/chat.js";
import { SignUp } from "./views/signUp/signUp.js";
var HOST = location.origin.replace(/^http/, "ws");

const socket = io(HOST, {
  reconnectionDelayMax: 1000,
});

socket.on("connect", () => {
  let user = localStorage.getItem("aloChatUser");
  user = JSON.parse(user);

  if (user) {
    socket.emit("join again", user.userID);
  } else {
    SignUp(socket);
  }
});

socket.on("bad credentials", () => {
  alert("Bad credentials, clear cookies and try again.");
});

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
});

socket.on("successfully signedIn", () => {
  ChatView(socket);
});
