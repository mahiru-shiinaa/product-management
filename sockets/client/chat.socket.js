const Chat = require("../../models/chat.model");
const uploadToCloudinary = require("../../helpers/uploadCloudinary");

module.exports = async (res) => {
    const userId = res.locals.user.id;
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      let images = [];
      for (const imageBuffer of data.images) {
        const url = await uploadToCloudinary(imageBuffer);
        images.push(url);
      }

      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: images,
      });
      await chat.save();
      //Trả data về client
      _io.emit("SEVER_RETURN_MESSAGE", {
        user_id: userId,
        fullName: res.locals.user.fullName,
        content: data.content,
        images: images,
      });
    });
    socket.on("CLIENT_SEND_TYPING", async (type) => {
      socket.broadcast.emit("SEVER_RETURN_TYPING", {
        user_id: userId,
        fullName: res.locals.user.fullName,
        type: type,
      });
    });
  }); 
};