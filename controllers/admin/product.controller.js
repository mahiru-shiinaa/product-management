const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  // Lọc
  const filterStatus = filterStatusHelper(req.query);

  let find = {
    deleted: false,
  };
  //req.query sẽ lấy đoạn query trên đường dẫn, req.query.status sẽ lấy nội dung của query.status
  // req.query tương tự như param bên react
  // check nếu có query thì mới thêm key vào bộ lọc find để lấy dữ liệu
  if (req.query.status) {
    find.status = req.query.status;
  }

  // Tìm kiếm
  const objectSeach = searchHelper(req.query);

  if (objectSeach.regex) {
    find.title = objectSeach.regex;
  }

  // Phân trang

  countProduct = await Product.countDocuments(find);

  let objectPagination = paginationHelper(
    {
      limitItem: 4,
      currentPage: 1,
    },
    req.query,
    countProduct
  );
  // limit để set hiển thị bao nhiêu sản phẩm, skip để bỏ qua bao nhiêu sản phẩm rồi mới hiển thị
  const products = await Product.find(find)
    .sort({ position: "desc" })
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  res.render("admin/pages/products/index", {
    pageTitle: "Product",
    products: products,
    filterStatus: filterStatus,
    // Dùng để hiện thị keyword tìm kiếm sau khi tìm kiếm xong mà không bị mất
    keyword: objectSeach.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  // params sẽ lấy đoạn param trên đường dẫn, req.params.status sẽ lấy nội dung của param.status
  // param chứa route động
  const status = req.params.status;
  const id = req.params.id;
  //
  // updateOne dùng để cập nhập dựa theo trường id, object phía sau là cập nhập những trường nào
  await Product.updateOne({ _id: id }, { status: status });
  // redirect để khi cập nhập xong tự động chuyển hướng về trang mình nhập
  // res.redirect(req.get("referer") thì nó sẽ quay về trang trước đó

  req.flash("success", "Update status successfully!");
  res.redirect(req.get("referer") || "/admin/products");

  //res.redirect("/admin/products");
};

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeMulti = async (req, res) => {
  // Lấy key type của ô select bên form fornt-end
  const type = req.body.type;
  // lấy danh sách id bên input hidden bên form xong chuyển nó qua dạng string bằng split
  const ids = req.body.ids.split(", ");
  // dùng updateMany dùng để cập nhập dựa theo trường id, object phía sau là cập nhập những trường nào
  // await Product.updateMany({ _id: { $in: ids } }, { status: type });
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhập trạng thái thành công của ${ids.length} sản phẩm`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhập trạng thái thành công của ${ids.length} sản phẩm`);
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      req.flash("success", `Đã đổi vị trí ${ids.length} sản phẩm`);
      break;
    default:
      break;
  }
  res.redirect(req.get("referer") || "/admin/products");
};

// // [DELETE] /admin/products/delete/:id => Phương thức xóa cứng
// module.exports.deleteItem = async (req, res) => {
//   const id = req.params.id;
//   await Product.deleteOne({ _id: id });
//   res.redirect(req.get("referer") || "/admin/products");
// };
// [DELETE] /admin/products/delete/:id => Phương thức xóa cứng
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Product.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedAt: new Date(),
    }
  );
  req.flash("success", "Xóa thành công sản phẩm!");
  res.redirect(req.get("referer") || "/admin/products");
};

// [GET] /admin/products/create
module.exports.create = (req, res) => {
  res.render("admin/pages/products/create", { pageTitle: "Tạo sản phẩm" });
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  // chuyển kiểu dữ liệu quan int
  req.body.price = parseInt(req.body.price);
  req.body.stock = parseInt(req.body.stock);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  
  // Kiểm tra thử có nhập position không
  if(req.body.position === "")  {
    const countProduct = await Product.countDocuments({});
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
   if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  } else {
    req.body.thumbnail = ""; // hoặc default ảnh
  }
  // Tạo 1 proudct mới nhưng chưa lưu
   const product = new Product(req.body);
  // // Lưu vào database 
   await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};
