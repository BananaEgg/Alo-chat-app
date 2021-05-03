import { addElementHtml , clearElementHtml} from "../../utils.js";

const SingUpForm = () => {
  const html = ` <form onsubmit="sendName(event)">
    <h1 class="cardTitle" >Alo</h1>
    <h5 class="cardSubtitle">chit chat while you at</h5>
    <input type="text" id="nameInput" placeholder="My name is..." autofocus>
    <br /><br /><input class="greenButton" type="submit" value="Sign up" />
    </form>`;
  clearElementHtml("mainSpace");
  addElementHtml("mainSpace", "div", "signIn", html);
  addElementHtml("body", "div", "overLay", "");
};

export { SingUpForm };
