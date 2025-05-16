const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");

// [GET] /admin/products
module.exports.index = async (req, res) => {

  
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

  // Tìm kiểm
  let keyword = "";
  if(req.query.keyword) {
    keyword = req.query.keyword;
    // RegExp dùng để tìm kiếm không chính xác, không phân biệt chữ hoa chữ thường
    // Không cần gõ đúng title vẫn tìm đc thì dùng lệnh RegExp ở dưới
    find.title = new RegExp(keyword, "i");
  }

  const products = await Product.find(find);
  res.render("admin/pages/products/index", {
    pageTitle: "Product",
    products: products,
    filterStatus: filterStatus,
    keyword: keyword
  });
};
