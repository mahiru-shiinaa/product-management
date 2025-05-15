// Khai báo model lấy dữ liệu
const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
  // Truy xuất dữ liệu từ data
  const products = await Product.find({
    status: "active",
    deleted: false,
  });

  const newProducts = products.map((item) => {
    item.priceNew = (item.price * (100 - item.discountPercentage) / 100).toFixed(0);
    return item;
  })
  res.render("client/pages/products/index", {
    pageTitle: "Trang Product",
    products: newProducts,
  });
};
