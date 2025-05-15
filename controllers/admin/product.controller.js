const Product = require("../../models/product.model");

// [GET] /admin/products
module.exports.index = async (req, res) => {
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Ngừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];
  
  if(req.query.status) {
    // Tìm vị trí bảng ghi có status bằng req.query.status trên đường linl
   const index = filterStatus.findIndex(item => item.status == req.query.status);
   filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex(item => item.status == "");
   filterStatus[index].class = "active";
  }
  let find = {
    deleted: false,
  };
  //req.query sẽ lấy đoạn query trên đường dẫn, req.query.status sẽ lấy nội dung của query.status
  // req.query tương tự như param bên react
  // check nếu có query thì mới thêm key vào bộ lọc find để lấy dữ liệu
  if (req.query.status) {
    find.status = req.query.status;
  }

  const products = await Product.find(find);
  res.render("admin/pages/products/index", {
    pageTitle: "Product",
    products: products,
    filterStatus: filterStatus,
  });
};
