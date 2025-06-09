const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
//[GET] /admin/my-account
module.exports.index = async (req, res) => {
  res.render(`admin/pages/my-account/index`, {
    pageTitle: "Thông tin cá nhân",
  });
};

//[GET] /admin/my-account/edit
module.exports.edit = async (req, res) => {
  res.render(`admin/pages/my-account/edit`, {
    pageTitle: "Chỉnh sửa tài khoản",
  }); 
};

//[PATCH] /admin/my-account/edit
module.exports.editPatch = async (req, res) => {
  try {
    const id = res.locals.account.id;
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
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/my-account/edit`);
  } catch (error) {
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/my-account`);
  }

  res.redirect(`${systemConfig.prefixAdmin}/my-account`);
};
