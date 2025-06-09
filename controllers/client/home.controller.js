const ProductCategory = require("../../models/product-category.model");
const createTree = require("../../helpers/createTree");

// [GET] /

module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const productsCategory = await ProductCategory.find(find);

  const newProductsCategory = createTree.tree(productsCategory);
  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    layoutProductsCategory: newProductsCategory,
  });
};
