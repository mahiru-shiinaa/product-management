const Product = require("../../models/product.model");
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const systemConfig = require("../../config/system");
const ProductCategory = require("../../models/product-category.model");
const createTree = require("../../helpers/createTree");
const Account = require("../../models/account.model");

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

  // SORT
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // END SORT

  // limit để set hiển thị bao nhiêu sản phẩm, skip để bỏ qua bao nhiêu sản phẩm rồi mới hiển thị
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitItem)
    .skip(objectPagination.skip);

  for (const product of products) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({ _id: product.createdBy.account_id });
    if (user) {
      product.accountFullName = user.fullName;
    }
    // Lấy ra người cập nhật gần nhất
    const updatedBy = product.updatedBy[product.updatedBy.length - 1];
    // Lấy ra thông tin người cập nhập gần nhất
    if (updatedBy) {
      const userUpdate = await Account.findOne({ _id: updatedBy.account_id });
      if (userUpdate) {
        product.accountFullNameUpdate = userUpdate.fullName;
        product.updatedAtUpdate = updatedBy.updatedAt;
      }
    }

  }

  


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

      const updatedBy = {
      account_id: res.locals.account.id,
      updatedAt: new Date(),
    }
  //
  // updateOne dùng để cập nhập dựa theo trường id, object phía sau là cập nhập những trường nào
  await Product.updateOne({ _id: id }, { status: status, $push: {updatedBy: updatedBy}});
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

      const updatedBy = {
      account_id: res.locals.account.id,
      updatedAt: new Date(),
    }
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push: {updatedBy: updatedBy}});
      req.flash(
        "success",
        `Cập nhập trạng thái thành công của ${ids.length} sản phẩm`
      );
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: {updatedBy: updatedBy}});
      req.flash(
        "success",
        `Cập nhập trạng thái thành công của ${ids.length} sản phẩm`
      );
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedBy: {
            account_id: res.locals.account.id,
            deletedAt: new Date(),
          },
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position, $push: {updatedBy: updatedBy}});
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
      //  deletedAt: new Date(),
      deletedBy: {
        account_id: res.locals.account.id,
        deletedAt: new Date(),
      },
    }
  );
  req.flash("success", "Xóa thành công sản phẩm!");
  res.redirect(req.get("referer") || "/admin/products");
};

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };

  const categories = await ProductCategory.find(find);

  const newCategories = createTree.tree(categories);
  // console.log('newRecords', newRecords);
  res.render("admin/pages/products/create", {
    pageTitle: "Tạo sản phẩm",
    categories: newCategories,
  });
};

// [POST] /admin/products/create-form
module.exports.createPost = async (req, res) => {
  const permissions = res.locals.role.permissions;
  
  // chuyển kiểu dữ liệu quan int
  req.body.price = parseFloat(req.body.price);
  req.body.stock = parseInt(req.body.stock);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);

  // Kiểm tra thử có nhập position không
  if (req.body.position === "") {
    const countProduct = await Product.countDocuments({});
    req.body.position = countProduct + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  //  if (req.file) {
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // } else {
  //   req.body.thumbnail = ""; // hoặc default ảnh
  // }
  // Tạo 1 proudct mới nhưng chưa lưu
  req.body.createdBy = {
    account_id: res.locals.account.id,
    createAt: new Date(),
  };

  const product = new Product(req.body);
  // // Lưu vào database
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
};

// [GET] /admin/prodcut/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const idProduct = req.params.id;
    const find = {
      deleted: false,
      _id: idProduct,
    };

    const categories = await ProductCategory.find({ deleted: false });

    const newCategories = createTree.tree(categories);

    const product = await Product.findOne(find);
    // const product = await Product.findOne({ _id: id });
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      categories: newCategories,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};

// [POST] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseFloat(req.body.price);
  req.body.stock = parseInt(req.body.stock);
  req.body.discountPercentage = parseFloat(req.body.discountPercentage);
  req.body.position = parseInt(req.body.position);
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  try {
    const updatedBy = {
      account_id: res.locals.account.id,
      updatedAt: new Date(),
    }
    // update req.body cũ xong push thêm updatedBy mới vào
    await Product.updateOne({ _id: id }, {...req.body, $push: {updatedBy: updatedBy}});
    req.flash("success", "Update successfully!");
  } catch (error) {}

  res.redirect(req.get("referer") || "/admin/products");
};

//[GET] admin/product/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const find = {
      deleted: false,
      _id: id,
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }
};
