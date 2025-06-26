const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
var timeOut;
import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";
document.addEventListener("DOMContentLoaded", function () {
  // Kiểm tra xem phần tử #myUploader có tồn tại không
  const container = document.getElementById("myUploader");
  if (!container) {
    console.error("Không tìm thấy #myUploader trong DOM!");
    return;
  }

  // Khởi tạo FileUploadWithPreview
  const upload = new FileUploadWithPreview("myUploader", {
    multiple: true,
    maxFileCount: 6,
  });

  // Chỉ gán vào window SAU KHI upload khởi tạo thành công
  window.FileUploadWithPreview = window.FileUploadWithPreview || {};
  window.FileUploadWithPreview.instances =
    window.FileUploadWithPreview.instances || {};
  window.FileUploadWithPreview.instances.myUploader = upload; // ✅ Đúng thứ tự
});

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const uploader = window.FileUploadWithPreview.instances?.myUploader;
    const images = uploader?.cachedFileArray || [];
    const input = formSendData.querySelector('input[name="content"]');
    const content = input?.value.trim() || "";

    if (content || images.length > 0) {
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      formSendData.content.value = "";
      const uploader = window.FileUploadWithPreview.instances.myUploader;
      uploader.clearPreviewPanel(); // Xoá preview
      uploader.cachedFileArray = [];

      socket.emit("CLIENT_SEND_TYPING", "hide");
    }
  });
}
// SERVER_RETURN_MESSAGE

socket.on("SEVER_RETURN_MESSAGE", (data) => {
  console.log(data);
  let htmlContent = "";
  let htmlImages = "";
  const body = document.querySelector(".chat .inner-body");

  const div = document.createElement("div");
  const myId = document.querySelector(".chat").getAttribute("my-id");
  const boxTyping = document.querySelector(".chat .inner-list-typing");

  if (myId === data.user_id) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
  }
  if (data.content) {
    htmlContent = `
     <div class="inner-name">${data.fullName}</div>
     <div class="inner-content">${data.content}</div>
    `;
  }
  if (data.images.length) {
    htmlImages += `
     <div class="inner-images ">`;
    for (const image of data.images) {
      htmlImages += `   
        <img src="${image}" alt="">  
      `;
    }
    htmlImages += `</div>`;
  }
  div.innerHTML = `
      ${htmlContent}
      ${htmlImages}
               
    `;
  body.insertBefore(div, boxTyping);
  const imagesContainer = div.querySelector(".inner-images");
  if (imagesContainer) {
    new Viewer(imagesContainer, {
      toolbar: true,
      navbar: false,
      title: false,
      tooltip: true,
      movable: false,
      scalable: false,
      zoomable: true,
      transition: true,
    });
  }

  body.scrollTop = body.scrollHeight;
});

// showTyping
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hide");
  }, 3000);
};

const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const buttonIcon = document.querySelector(".button-icon");
  if (buttonIcon) {
    const tooltip = document.querySelector(".tooltip");
    Popper.createPopper(buttonIcon, tooltip);

    buttonIcon.onclick = () => {
      tooltip.classList.toggle("shown");
    };
    window.addEventListener("pointerdown", (e) => {
      if (!tooltip.contains(e.target) && !buttonIcon.contains(e.target)) {
        tooltip.classList.remove("shown");
      }
    });
  }

  const input = document.querySelector('input[name="content"]');
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    input.value += icon;
    const end = input.value.length;
    input.setSelectionRange(end, end);
    showTyping();
  });

  input.addEventListener("keyup", () => {
    showTyping();
  });
}

const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
  socket.on("SEVER_RETURN_TYPING", (data) => {
    if (data.type === "show") {
      const exitTyping = elementListTyping.querySelector(
        `[user-id="${data.user_id}"]`
      );
      console.log("exitTyping", exitTyping);
      if (!exitTyping) {
        const div = document.createElement("div");
        div.setAttribute("user-id", data.user_id);
        div.classList.add("box-typing");
        div.innerHTML = `
      <div class="inner-name">${data.fullName} </div>
        <div class="inner-dots">
        <span></span>
        <span></span>
        <span></span>
        </div>

    `;
        bodyChat.scrollTop = bodyChat.scrollHeight;
        elementListTyping.appendChild(div);
      }
    } else {
      const boxTypingRemove = elementListTyping.querySelector(
        `[user-id="${data.user_id}"]`
      );
      if (boxTypingRemove) {
        elementListTyping.removeChild(boxTypingRemove);
      }
    }
  });
}

// document.addEventListener("DOMContentLoaded", () => {
//   const imageGroups = document.querySelectorAll(".chat .inner-images");
//   imageGroups.forEach((group) => {
//     new Viewer(group, {
//       toolbar: true,
//       navbar: false,
//       title: false,
//       tooltip: true,
//       movable: false,
//       scalable: false,
//       zoomable: true,
//       transition: true,
//     });
//   });
// });
const chatBody = document.querySelector(".chat .inner-body");
if (chatBody) {
  const gallery = new Viewer(chatBody);
}
