const RoomChat = require("../../models/room-chat.model");

module.exports.isAccess = async (req, res, next) => {
  try {
    const userId = res.locals.user.id;
  const roomChatId = req.params.roomChatId;
  const roomChat = await RoomChat.findOne({
    _id: roomChatId,
    deleted: false,
    users: { $elemMatch: { user_id: userId } },
  });
  if (!roomChat) {
    return res.redirect("/");
  } else {
    next();
  }
  } catch (error) {
    res.redirect("/");
  }
};
