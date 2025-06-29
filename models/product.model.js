const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);

// Tạo khung dữ liệu
const productSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    thumbnail: String,
    description: String,
    stock: Number,
    discountPercentage: Number,
    position: Number,
    createdBy: {
      account_id: String,
      createAt: Date,
    },
    product_category_id: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      slug: "title",
      unique: true, // Slug là duy nhất
      slugPaddingSize: 4, // Nếu trùng, nó thêm -0001, -0002...
    },
    // Kiểu là boolean, nếu mà tạo mới thì để kiểu mặc định là false
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      account_id: String,
      deletedAt: Date
    },
    updatedBy: [
      {
      account_id: String,
      updatedAt: Date
    }
    ],
    status: String,
    featured: String,
    //   deletedAt: Date
  },
  {
    // Dùng để thêm thời gian tạo và cập nhật sản phẩm tự động
    timestamps: true,
  }
);

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;
