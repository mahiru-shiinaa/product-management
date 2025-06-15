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