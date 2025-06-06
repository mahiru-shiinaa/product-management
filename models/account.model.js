
const mongoose = require("mongoose");
const generate = require("../helpers/generate");

// Tạo khung dữ liệu
const accountSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    token: {
        type: String,
        default: generate.generateToken()
    },
    phone: String,
    avatar: String,
    role_id: String,
    status: String,

    // Kiểu là boolean, nếu mà tạo mới thì để kiểu mặc định là false
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
const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;