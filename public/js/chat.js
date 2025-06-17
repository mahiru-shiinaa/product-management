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
  const div = document.querySelector("div");
  const myId = document.querySelector(".chat").getAttribute("my-id");
  if(myId === data.user_id) {
    div.classList.add("inner-outgoing");
  }
   else {
    div.classList.add("inner-incoming");
   }
  div.innerHTML = `

                <div class="inner-name">${data.fullName}</div>
                <div class="inner-content">${data.content}</div>
    `;
    body.appendChild(div);
});
