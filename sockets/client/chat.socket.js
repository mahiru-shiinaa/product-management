const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadCloudinary");

module.exports = async (req, res) => {
    const userId = res.locals.user.id;
    const roomChatId = req.params.roomChatId;
  _io.once("connection", (socket) => {
    socket.join(roomChatId);
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];
      for (const imageBuffer of data.images) {
        const url = await uploadToCloudinary(imageBuffer);
        images.push(url);
      }

      const chat = new Chat({
        user_id: userId,
        room_chat_id: roomChatId,
        content: data.content,
        images: images,
      });
      await chat.save();
      //Trả data về client
      _io.to(roomChatId).emit("SEVER_RETURN_MESSAGE", {
        user_id: userId,
        fullName: res.locals.user.fullName,
        content: data.content,
        images: images,
      });
    });
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.to(roomChatId).emit("SEVER_RETURN_TYPING", {
        user_id: userId,
        fullName: res.locals.user.fullName,
        type: type,
      });
    });
  }); 
};