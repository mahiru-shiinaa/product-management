
const mongoose = require("mongoose");


// Tạo khung dữ liệu
const roomChatSchema = new mongoose.Schema({
    title: String,
    avatar: String,
    typeRoom: String,
    status: String,
    users : [
        {
            user_id: String,
            role: String
        }
    ],
    deleted: {
        type: Boolean,
        default: false
    },
    deletedAt: Date
}, {
    // Dùng để thêm thời gian tạo và cập nhật sản phẩm tự động
    timestamps: true
});

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const RoomChat = mongoose.model("Role", roomChatSchema, "rooms-chat");

module.exports = RoomChat;