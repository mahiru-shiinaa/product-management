const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
//[GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
    deleted: false,
  };

  // limit để set hiển thị bao nhiêu sản phẩm, skip để bỏ qua bao nhiêu sản phẩm rồi mới hiển thị
    const records = await ProductCategory.find(find);

    res.render(`admin/pages/products-category/index`, { pageTitle: "Danh sách danh mục", records: records });
}

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products-category/create", { pageTitle: "Tạo danh mục" });
}

//[POST] /admin/products-category/create-post
module.exports.createPost = async (req, res) => {
      // Kiểm tra thử có nhập position không
  if(req.body.position === "")  {
    const countProduct = await ProductCategory.countDocuments({});
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
    const record = new ProductCategory(req.body);
  // // Lưu vào database 
   await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

