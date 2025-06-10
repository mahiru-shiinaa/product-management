const ProductCategory = require("../../models/product-category.model");
const createTree = require("../../helpers/createTree");
const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products");

// [GET] /

module.exports.index = async (req, res) => {

  const productsFeatured = await Product.find({
    status: "active",
    deleted: false,
    featured: "1"
  }).sort({ position: "desc" }).limit(4);
  const productsNew = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" }).limit(4);
  const newProducts = productsHelper.priceNewProducts(productsFeatured);
  const productsCategory = await ProductCategory.find({ deleted: false });

  const newProductsCategory = createTree.tree(productsCategory);
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    layoutProductsCategory: newProductsCategory,
    productsFeatured: newProducts,
    productsNew: productsNew
  });
};
