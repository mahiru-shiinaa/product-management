const User = require("../../models/user.model");

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    // Người dùng gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;
      console.log("userId", userId);

      // Thêm id của A vào acceptFriend của B
      const exitUserAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!exitUserAinB) {
        await User.updateOne(
          { _id: userId },
          { $push: { acceptFriends: myUserId } }
        );
      }

      // Thêm id của B vào requestFriends của A
      const exitUserBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!exitUserBinA) {
        await User.updateOne(
          { _id: myUserId },
          { $push: { requestFriends: userId } }
        );
      }
      // Lấy đội dài
      const infoUserB = await User.findOne({ _id: userId });
      const lengthAcceptFriends = infoUserB.acceptFriends.length;

      socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
        userId,
        lengthAcceptFriends,
      })
    });
    // Người dùng hủy gửi yêu cầu kết bạn
    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Xóa id của A trong acceptFriend của B
      const exitUserAinB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (exitUserAinB) {
        await User.updateOne(
          { _id: userId },
          { $pull: { acceptFriends: myUserId } }
        );
      }

      // Xóa id của B trong requestFriends của A
      const exitUserBinA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (exitUserBinA) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { requestFriends: userId } }
        );
      }
    });
    // Người dùng từ chối kết bạn
    socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Xóa id của A trong acceptFriend của B
      const exitUserAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (exitUserAinB) {
        await User.updateOne(
          { _id: myUserId },
          { $pull: { acceptFriends: userId } }
        );
      }

      // Xóa id của B trong requestFriends của A
      const exitUserBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (exitUserBinA) {
        await User.updateOne(
          { _id: userId },
          { $pull: { requestFriends: myUserId } }
        );
      }
    });

    // Người dùng chấp nhận kết bạn
    socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      // Xóa id của A trong acceptFriend của B
      // Thêm {user_id, room_chat_id} của A vào friendList của B
      const exitUserAinB = await User.findOne({
        _id: myUserId,
        acceptFriends: userId,
      });
      if (exitUserAinB) {
        await User.updateOne(
          { _id: myUserId },
          { 
            $push: { friendList: {
              user_id: userId,
              room_chat_id: ""
            } },
            $pull: { acceptFriends: userId } }
        );
      }

      // Xóa id của B trong requestFriends của A
      // Thêm {user_id, room_chat_id} của B vào friendList của A
      const exitUserBinA = await User.findOne({
        _id: userId,
        requestFriends: myUserId,
      });
      if (exitUserBinA) {
        await User.updateOne(
          { _id: userId },
          { 
            $push: { friendList: {
              user_id: myUserId,
              room_chat_id: ""
            } },
            $pull: { requestFriends: myUserId } }
        );
      }
    });
  });
};
