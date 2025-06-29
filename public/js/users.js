// Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", async () => {
      button.closest(".box-user").classList.add("add");
      const userId = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
// Chức năng hủy kết bạn
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", async () => {
      button.closest(".box-user").classList.remove("add");
      const userId = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
// Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", async () => {
      button.closest(".box-user").classList.add("refuse");
      const userId = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
// Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", async () => {
      button.closest(".box-user").classList.add("accepted");
      const userId = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}

// SEVER_RETURN_LENGTH_ACCEPT_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
  console.log("data: ", data);
  const lengthAcceptFriend = document.querySelector("[badge-users-accept]");
  const userId = lengthAcceptFriend.getAttribute("badge-users-accept");
  if (userId == data.userId) {
    lengthAcceptFriend.innerHTML = data.lengthAcceptFriends;
  }
});
// END SEVER_RETURN_LENGTH_ACCEPT_FRIEND

//SERVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SERVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
  // Trang lời mời kết bạn
  const dataUserAccept = document.querySelector("[data-users-accept]");
  if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-users-accept");
    if (userId == data.userId) {
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-6");
      newBoxUser.setAttribute("user-id", data.infoUserA._id);
      newBoxUser.innerHTML = `
        <div class="col-6">
            <div class="box-user add">
                <div class="inner-avatar">
                <img src=${
                  data.infoUserA.avatar
                    ? data.infoUserA.avatar
                    : "/images/avatar_default.png"
                } alt="">
                </div>
                <div class="inner-info">
                <div class="inner-name">${data.infoUserA.fullName}</div>
                <div class="inner-buttons">
                    <button 
                    class="btn btn-sm btn-primary ms-1" 
                    btn-accept-friend="${data.infoUserA._id}">
                    Chấp nhận
                    </button>
                    <button 
                    class="btn btn-sm btn-secondary ms-1" 
                    btn-refuse-friend="${data.infoUserA._id}">
                    Xóa
                    </button>
                    <button 
                    class="btn btn-sm btn-secondary ms-1" 
                    btn-deleted-friend="btn-deleted-friend" 
                    disabled="disabled">
                    Đã xóa
                    </button>
                    <button 
                    class="btn btn-sm btn-secondary ms-1" 
                    btn-accepted-friend="btn-accepted-friend" 
                    disabled="disabled">
                    Đã chấp nhận
                    </button>
                </div>
                </div>
            </div>
            </div>`;
      dataUserAccept.appendChild(newBoxUser);
      // Bắt sự kiện cho nút xóa mới
      const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
      btnRefuseFriend.addEventListener("click", async () => {
        btnRefuseFriend.closest(".box-user").classList.add("refuse");
        const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");
        socket.emit("CLIENT_REFUSE_FRIEND", userId);
      });
      // Bắt sự kiện cho nút chấp nhận mới
      const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
      btnAcceptFriend.addEventListener("click", async () => {
        btnAcceptFriend.closest(".box-user").classList.add("accepted");
        const userId = btnAcceptFriend.getAttribute("btn-accept-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
      });
    }
  }
  // Trang danh sách người dùng
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
    if (userId == data.userId) {
      const boxUserRemove = document.querySelector(
        `[user-id="${data.infoUserA._id}"]`
      );
      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }
});
// END SERVER_RETURN_INFO_ACCEPT_FRIEND

//SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const dataUserAccept = document.querySelector("[data-users-accept]");
  const userId = dataUserAccept.getAttribute("data-users-accept");
  if (userId == data.userId) {
    // Xóa A khỏi ds của B
    const boxUserRemove = document.querySelector(`[user-id="${data.userIdA}"]`);
    if (boxUserRemove) {
      dataUserAccept.removeChild(boxUserRemove);
    }
  }
});
// END SERVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
  const dataUserOnline = document.querySelector("[data-users-friends");
  if(dataUserOnline){
    const boxUser = dataUserOnline.querySelector(`[user-id="${userId}"]`);
    if(boxUser){
      boxUser.querySelector("[status]").setAttribute("status", "online");
    }
  }
});
// END SERVER_RETURN_USER_ONLINE

// SERVER_RETURN_USER_OFFLINE
socket.on("SERVER_RETURN_USER_OFFLINE", (userId) => {
  const dataUserOnline = document.querySelector("[data-users-friends");
  if(dataUserOnline){
    const boxUser = dataUserOnline.querySelector(`[user-id="${userId}"]`);
    if(boxUser){
      boxUser.querySelector("[status]").setAttribute("status", "offline");
    }
  }
});
// END SERVER_RETURN_USER_OFFLINE