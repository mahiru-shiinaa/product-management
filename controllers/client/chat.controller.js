const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");
const RoomChat = require("../../models/room-chat.model");
const chatSocket = require("../../sockets/client/chat.socket");
//[GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  const userId = res.locals.user.id;
  chatSocket(req, res);

  const chats = await Chat.find({
    deleted: false,
    room_chat_id: roomChatId,
  });
  const roomChat = await RoomChat.findById(roomChatId);
  const userIds = roomChat.users.map((user) => user.user_id);
  
  const usersMessage = await User.findOne({
    $and: [{ _id: { $in: userIds } }, { _id: { $ne: userId } }],
    deleted: false,
  }).select("fullName");
  
  chats.usersMessage = usersMessage;
  for (const chat of chats) {
    const infoUser = await User.findById(chat.user_id).select("fullName");
    chat.infoUser = infoUser;
  }
  res.render("client/pages/chat/index", { pageTitle: "Chat", chats: chats });
};
