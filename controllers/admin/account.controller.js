const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
var md5 = require("md5");

//[GET] /admin/accounts
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Account.find(find).select(
    "-password -token -createdAt -updatedAt -deleted"
  );
  for (const record of records) {
    record.role = await Role.findOne({ _id: record.role_id, deleted: false });
  }

  res.render(`admin/pages/accounts/index`, {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({ deleted: false });
  res.render(`admin/pages/accounts/create`, {
    pageTitle: "Tạo tài khoản",
    roles: roles,
  });
};

//[POST] /admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExits = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExits) {
    req.flash("error", "Email đã tồn tại");
    res.redirect(req.get("referer") || "/admin/accounts/create");
    return;
  }
  req.body.password = md5(req.body.password);
  const record = new Account(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/accounts`);
};
//[GET] /admin/accounts/edit
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const record = await Account.findOne({ _id: id, deleted: false });
    const roles = await Role.find({ deleted: false });
    res.render(`admin/pages/accounts/edit`, {
      pageTitle: "Chỉnh sửa tài khoản",
      record: record,
      roles: roles,
    });
  } catch (error) {
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/accounts`);
  }
};

//[PATCH] /admin/accounts/edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    const emailExits = await Account.findOne({
        // Tìm những bảng ghi có id không bằng những id này
        // Mục đích để nó không so sánh email của chính nó so với chính nó
        _id: { $ne: id },
      email: req.body.email,
      deleted: false,
    });
    if (emailExits) {
      req.flash("error", "Email đã tồn tại");
      res.redirect(req.get("referer") || "/admin/accounts/edit");
      return;
    }
    // Check xem có nhập password hay không
    // Nếu có thì mã hóa nó nếu không có thì xóa nó để khỏi bị cập nhập password rỗng
    if (req.body.password !== "") {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }

    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Update successfully!");
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/accounts`);
  } catch (error) {
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/accounts`);
  }
};
