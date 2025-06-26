const User  = require("../../models/user.model");
const RoomChat = require("../../models/room-chat.model");

// [GET] /rooms-chat
module.exports.index = (req, res) => {
    res.render("client/pages/rooms-chat/index", { pageTitle: "Danh sách phòng" });
};

//[GET] /rooms-chat/create
module.exports.create = async (req, res) => {
const listFriends = res.locals.user.friendList;
for (const friend of listFriends) {
    const infoFriend = await User.findOne({ _id: friend.user_id }).select("fullName avatar");
    friend.infoFriend = infoFriend;
}
    res.render("client/pages/rooms-chat/create", { pageTitle: "Tạo phòng", listFriends: listFriends } );
};

//[POST] /rooms-chat/create
module.exports.createPost = (req, res) => {
    const title = req.body.title;
    const usersId = req.body.usersId;
const usersArray = Array.isArray(usersId) ? usersId : [usersId];
    const dataChat = {
        title: title,
        typeRoom: "group",
        users: [
        ]
    };
    usersArray.forEach((id) => {
        dataChat.users.push({
            user_id: id,
            role: "user",
        })
    })
    usersArray.forEach((id) => {
        dataChat.users.push({
            user_id: res.locals.user.id,
            role: "superAdmin",
        })
    })
    const room = new RoomChat(dataChat);
    room.save();
    console.log('dataChat', dataChat);
    res.redirect(`/chat/${room.id}`);
 //   res.redirect("/rooms-chat");
};