// Khai báo model lấy dữ liệu
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productCategoryHelper = require("../../helpers/products-category");

// [GET] /products
module.exports.index = async (req, res) => {
  // Truy xuất dữ liệu từ data
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = products.map((item) => {
    item.priceNew = (
      (item.price * (100 - item.discountPercentage)) /
      100
    ).toFixed(0);
    return item;
  });
  res.render("client/pages/products/index", {
    pageTitle: "Trang Product",
    products: newProducts,
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  try {
    const slug = req.params.slug;
    const product = await Product.findOne({
      slug: slug,
      status: "active",
      deleted: false,
    });
    res.render("client/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/products");
  }
};

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  try {
    const slug = req.params.slugCategory;
    const category = await ProductCategory.findOne({
      slug: slug,
      status: "active",
      deleted: false,
    });
    

   const listSubCategory = await productCategoryHelper.getSubCategory(category.id);
   const listSubCategoryIds = listSubCategory.map((item) => item.id);
    const products = await Product.find({
      product_category_id: {
        $in: [category._id, ...listSubCategoryIds]
      },
      status: "active",
      deleted: false,
    }).sort({ position: "desc" });
    const newProducts = products.map((item) => {
      item.priceNew = (
        (item.price * (100 - item.discountPercentage)) /
        100
      ).toFixed(0);
      return item;
    });
    res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
  } catch (error) {
    res.redirect("/products");
  }
};
