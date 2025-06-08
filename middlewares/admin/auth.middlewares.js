const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

module.exports.requireAuth = async (req, res, next) => {
  console.log(req.cookies.token);
  if (!req.cookies.token) {
    return res.redirect("/admin/auth/login");
  } else {
    const account = await Account.findOne({ token: req.cookies.token });

    if (!account) {
      return res.redirect("/admin/auth/login");
    } else {
      next();
    }
  }
};
