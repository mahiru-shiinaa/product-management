const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTree = require("../../helpers/createTree");


//[GET] /admin/products-category
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };


  const records = await ProductCategory.find(find);

  const newRecords = createTree.tree(records);

  res.render(`admin/pages/products-category/index`, {
    pageTitle: "Danh sách danh mục",
    records: newRecords,
  });
};

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
 

  const records = await ProductCategory.find(find);

  const newRecords = createTree.tree(records);
  // console.log('newRecords', newRecords);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục",
    records: newRecords,
  });
};

//[POST] /admin/products-category/create-post
module.exports.createPost = async (req, res) => {
  // Kiểm tra thử có nhập position không
  if (req.body.position === "") {
    const countProduct = await ProductCategory.countDocuments({});
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const record = new ProductCategory(req.body);
  // // Lưu vào database
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

//[GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
  let find = {
    deleted: false,
  };
 

  const categories = await ProductCategory.find(find);

  const newCategories = createTree.tree(categories);

  const record = await ProductCategory.findOne({ _id: id, deleted: false });
 

  res.render("admin/pages/products-category/edit", {
    pageTitle: "Chỉnh sửa danh mục",
    record: record,
    categories: newCategories,
  });
  } catch (error) {
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/products-category`);
  }
  
};

//[PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    // Kiểm tra thử có nhập position không
  req.body.position = parseInt(req.body.position);

  await ProductCategory.updateOne({ _id: req.params.id }, req.body);

  res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/products-category`);
  } catch (error) {
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/products-category`);
  }
};
