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
// SERVER_SEND_MESSAGE