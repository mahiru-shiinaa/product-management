const bodyChat = document.querySelector(".chat .inner-body");
bodyChat.scrollTop = bodyChat.scrollHeight;
import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = formSendData.content.value;
    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      formSendData.content.value = "";
    }
  });
}
// SERVER_RETURN_MESSAGE

socket.on("SEVER_RETURN_MESSAGE", (data) => {
  console.log(data);
  const body = document.querySelector(".chat .inner-body");
  const div = document.createElement("div");
  const myId = document.querySelector(".chat").getAttribute("my-id");
  if (myId === data.user_id) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
  }
  div.innerHTML = `

                <div class="inner-name">${data.fullName}</div>
                <div class="inner-content">${data.content}</div>
    `;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
});

// document.querySelector('emoji-picker')
//   .addEventListener('emoji-click', event => console.log(event.detail));

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const buttonIcon = document.querySelector(".button-icon");
  if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
      tooltip.classList.toggle("shown");
    };
  }

  const input = document.querySelector('input[name="content"]');
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    input.value += icon;
    console.log("icon", icon);
  });
}
