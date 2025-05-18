
const mongoose = require("mongoose");

// Tạo khung dữ liệu
const productSchema = new mongoose.Schema({
    title: String,
    price: Number,
    thumbnail: String,
    description: String,
    stock: Number,
    discountPercentage: Number,
    position: Number,
    deleted: Boolean,
    status: String,
    deletedAt: Date

});

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;