const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");

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

// [GET] /admin/products/change-status/:status/:id
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
  res.redirect(req.get("referer") || "/admin/products");
  
  //res.redirect("/admin/products");
};