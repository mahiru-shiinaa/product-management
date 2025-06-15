const User = require("../../models/user.model");
//[GET] /user/register
const md5 = require("md5");
module.exports.register = (req, res) => {
    res.render("client/pages/user/register",  { pageTitle: "Đăng ký tài khoản" });
};

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
    const exitsEmail = await User.findOne({ email: req.body.email, deleted: false });
    if(exitsEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("/user/register");
        return;
    } else {
        req.body.password = md5(req.body.password);
        const user = new User(req.body);
        await user.save();
        console.log('user', user);
        res.cookie("tokenUser", user.tokenUser, { httpOnly: true });
        req.flash("success", "Đăng ký tài khoản thành công");

    }

    res.redirect("/");
};

//[GET] /user/login
module.exports.login = (req, res) => {
    res.render("client/pages/user/login", { pageTitle: "Đăng nhập tài khoản" });
};
//[POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);
    const user = await User.findOne({ email:email, deleted: false });
    if(!user) {
      req.flash("error", "Sai email");
      res.redirect("/user/login");
      return;
    }
    if(user.password != password) {
        req.flash("error", "Sai mật khẩu");
        res.redirect("/user/login");
        return;
    } 
    res.cookie("tokenUser", user.tokenUser, { httpOnly: true });
    req.flash("success", "Đăng nhập tài khoản thành công");
    res.redirect("/");
};