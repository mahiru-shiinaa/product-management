const User = require("../../models/user.model");
const usersSocket = require("../../sockets/client/users.socket");

//[GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  //Socket
  usersSocket(res);
  //End socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;
  
  
  const users = await User.find({
    $and: [{_id: { $ne: userId }}, {_id: { $nin: requestFriends }}, {_id: { $nin: acceptFriends }}],
    deleted: false,
    status: "active",
  }).select("avatar fullName");
  res.render("client/pages/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};

//[GET] /users/request
module.exports.request = async (req, res) => {
  //Socket
  usersSocket(res);
  //End socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const requestFriends = myUser.requestFriends;
  
  const users = await User.find({
    _id: { $in: requestFriends },
    deleted: false,
    status: "active",
  }).select("id avatar fullName");
  res.render("client/pages/users/request", {
    pageTitle: "Lời mời đã gửi",
    users: users,
  });
};

//[GET] /users/accept
module.exports.accept = async (req, res) => {
  //Socket
  usersSocket(res);
  //End socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const acceptFriends = myUser.acceptFriends;
  
  const users = await User.find({
    _id: { $in: acceptFriends },
    deleted: false,
    status: "active",
  }).select("id avatar fullName");
  res.render("client/pages/users/accept", {
    pageTitle: "Lời mời đã nhận",
    users: users,
  });
};

//[GET] /users/friends
module.exports.friends = async (req, res) => {
  //Socket
  usersSocket(res);
  //End socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({ _id: userId });
  const friendList = myUser.friendList;
  const friendListId = friendList.map((friend) => friend.user_id);
  const users = await User.find({
    _id: { $in: friendListId },
    deleted: false,
    status: "active",
  }).select("id avatar fullName statusOnline");
  users.forEach((user) => {
    const infoUser = friendList.find((friend) => friend.user_id === user.id);
    user.room_chat_id = infoUser.room_chat_id;
  })
  res.render("client/pages/users/friends", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
