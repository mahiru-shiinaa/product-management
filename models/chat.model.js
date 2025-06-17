
const mongoose = require("mongoose");


// Tạo khung dữ liệu
const chatSchema = new mongoose.Schema(
    // Dùng để thêm thời gian tạo và cập nhật sản phẩm tự động
    {
        user_id: String,
        room_chat_id: String,
        content: String,
        images: Array,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date

    },
    { timestamps: true }
);

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const Chat = mongoose.model("Chat", chatSchema, "chats");

module.exports = Chat;