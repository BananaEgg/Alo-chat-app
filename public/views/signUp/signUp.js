import { removeElementHtml } from "/utils.js";
import { ChatView } from "../chat/chat.js";
import { SingUpForm } from "./components.js";

const SignUp = (socket) => {
  SingUpForm();

  socket.on("name approval", (res) => {
    if (res) {
      removeElementHtml("signIn");
      removeElementHtml("overLay");
      localStorage.setItem("aloChatUser", JSON.stringify(res));
      ChatView(socket, res);
    } else {
      alert("Name already taken, please choose another name.");
    }
  });

  const sendName = (event) => {
    event.preventDefault();
    const userName = document.getElementById("nameInput").value;
    document.getElementById("nameInput").value = "";

    if (userName.length < 2) {
      alert("Name too short");
    } else {
      socket.emit("check name", userName);
    }
  };

  window.sendName = sendName;
};

export { SignUp };
