
const mongoose = require("mongoose");


// Tạo khung dữ liệu
const cartSchema = new mongoose.Schema(
    // Dùng để thêm thời gian tạo và cập nhật sản phẩm tự động
    {
        user_id: String,
        products: [
            {
                product_id: String,
                quantity: Number
            }
        ]
    },
    { timestamps: true }
);

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;