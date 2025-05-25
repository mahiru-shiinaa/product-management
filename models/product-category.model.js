
const mongoose = require("mongoose");

const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

// Tạo khung dữ liệu
const productCategorySchema = new mongoose.Schema({
    title: String,
    thumbnail: String,
    parent_id: {
        type: String,
        default: ""
    },
    description: String,
    position: Number,
    slug: {
        type: String,
        slug: "title",
        unique: true,          // Slug là duy nhất
        slugPaddingSize: 4     // Nếu trùng, nó thêm -0001, -0002...
    },
    // Kiểu là boolean, nếu mà tạo mới thì để kiểu mặc định là false
    deleted: {
        type: Boolean,
        default: false
    },
    status: String,
    deletedAt: Date

}, {
    // Dùng để thêm thời gian tạo và cập nhật sản phẩm tự động
    timestamps: true
});

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "products-category");

module.exports = ProductCategory;