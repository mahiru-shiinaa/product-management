const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");

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
  let objectPagination = {
    limitItem: 4,
    currentPage: 1,
  }

  if(req.query.page) {
    objectPagination.currentPage = parseInt(req.query.page);
  }
  // Dùng để tính số sản phẩm skip qua khi nhấn phân trang
  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

  // Tính tổng số trang và tìm ra bao nhiêu pagination cùng với làm tròn số trang
  countProduct = await Product.countDocuments(find);
  objectPagination.totalPage = Math.ceil(countProduct / objectPagination.limitItem);



// limit để set hiển thị bao nhiêu sản phẩm, skip để bỏ qua bao nhiêu sản phẩm rồi mới hiển thị
  const products = await Product.find(find).limit(objectPagination.limitItem).skip(objectPagination.skip)
  res.render("admin/pages/products/index", {
    pageTitle: "Product",
    products: products,
    filterStatus: filterStatus,
    // Dùng để hiện thị keyword tìm kiếm sau khi tìm kiếm xong mà không bị mất
    keyword: objectSeach.keyword,
    pagination: objectPagination
  });
};
