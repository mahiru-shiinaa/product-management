const User = require("../../models/user.model");

module.exports.requireAuth = async (req, res, next) => {
  if (!req.cookies.tokenUser) {
    return res.redirect("/user/login");
  } else {
    // .select("-password"); không trả về password
    const user = await User.findOne({ tokenUser: req.cookies.tokenUser }).select(
      "-password"
    );

    if (!user) {
      return res.redirect("/user/login");
    }
    next();
  }
};
