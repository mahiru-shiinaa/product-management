const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.redirect("/admin/auth/login");
  } else {
    // .select("-password"); không trả về password
    const account = await Account.findOne({ token: req.cookies.token }).select("-password");

    if (!account) {
      return res.redirect("/admin/auth/login");
    } else {
        const role = await Role.findOne({ _id: account.role_id, deleted: false }).select("title permissions");
        // Tạo account thành biến toàn cục
      res.locals.account = account;  
      res.locals.role = role;
      next();
    }
  }
};
