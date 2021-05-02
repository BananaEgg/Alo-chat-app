const ChatFooter = `<div id="inputContainer">
                            <form id="messageInputForm" onsubmit="event.preventDefault() ,sendMessage()">
                            <textarea id="messageInput" rows="1" name="message" wrap="hard" onkeypress="checkSubmit(event, this)" placeholder="Type a message" autofocus></textarea>
                        <button type="submit" id="sendButton"><img id="sendButtonIcon" src="./icons/icons8-email-send-96.png"></button>
                            </form>
                    </div>`


export {ChatFooter };
