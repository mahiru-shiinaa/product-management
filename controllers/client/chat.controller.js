const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");
//[GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  //SoketIo
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (data) => {
      const chat = new Chat({
        user_id: userId,
        content: data.content,
        images: data.images,
      });
      await chat.save();
      //Trả data về client
      _io.emit("SEVER_RETURN_MESSAGE", {
        user_id: userId,
        fullName: res.locals.user.fullName,
        content: data.content,
        images: data.images,
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

  const chats = await Chat.find({
    deleted: false,
  });
  for (const chat of chats) {
    const infoUser = await User.findById(chat.user_id).select("fullName");
    chat.infoUser = infoUser;
  }
  res.render("client/pages/chat/index", { pageTitle: "Chat", chats: chats });
};
