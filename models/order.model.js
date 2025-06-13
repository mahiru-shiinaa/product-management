
const mongoose = require("mongoose");


// Tạo khung dữ liệu
const orderSchema = new mongoose.Schema(
    // Dùng để thêm thời gian tạo và cập nhật sản phẩm tự động
    {
       user_id: String,
       cart_id: String,
       userInfo: {
        fullName: String,
        address: String,
        phone: String
       },
       products: [
        {
            product_id: String,
            price: Number,
            discountPercentage: Number,
            quantity: Number
        }
       ]
    },
    { timestamps: true }
);

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;