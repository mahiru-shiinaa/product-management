const Product = require("../../models/product.model");
const ProductsHelper = require("../../helpers/products");

// [GET] /search/
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword || "";
  if (keyword) {
    const find = {
      title: new RegExp(keyword, "i"),
      status: "active",
      deleted: false,
    };
    const products = await Product.find(find);
    const newProduct = ProductsHelper.priceNewProducts(products);
    res.render("client/pages/search/index", {
      pageTitle: "Tìm kiếm",
      products: newProduct,
      keyword: keyword,
    });
  }
};
