const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");
var md5 = require("md5");

const sendMailHelper = require("../../helpers/sendMail");

//[GET] /user/register
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

//[GET] /user/logout
module.exports.logout = (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
};

//[GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
    res.render("client/pages/user/forgot-password", { pageTitle: "Quên mật khẩu" });
};

//[POST] /user/password/forgot
module.exports.forgotPasswordPost = async  (req, res) => {
    const email = req.body.email;
    const user = User.findOne({ email: email, deleted: false });
    if(!user) {
        req.flash("error", "Email không tồn tại");
        res.redirect("/user/password/forgot");
        return;
    }
    // Việc 1: Tạo mã Otp và lưu thông tin OTP và Email yêu cầu vào collection
    const otp = generateHelper.generateRandomNumber()
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expiresAt: Date.now()
    }
    const forgotPassword = new ForgotPassword(objectForgotPassword);
    await forgotPassword.save();
    console.log('objectForgotPassword', objectForgotPassword);

    // Việc 2: Gửi mã OPT qua email của user
    const subject = "Mã OTP xác minh lấy lại mật khẩu";
    sendMailHelper.sendMail(email, subject, otp);

    // Việc 3: Hành động khi người dùng nháp mật khuẩu mới
    res.redirect(`/user/password/otp?email=${email}`);
};

//[GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", { pageTitle: "Nhập mã OTP xác thực", email: email });
};

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({email: email, otp: otp });
    if(!result) {
        req.flash("error", "Sai mã OTP");
        res.redirect(`/user/password/otp?email=${email}`);
        return;
    } 
    const user = await User.findOne({ email: email, deleted: false });
    res.cookie("tokenUser", user.tokenUser, { httpOnly: true });
    res.redirect("/user/password/reset");
}

//[GET] /user/password/reset
module.exports.resetPassword = (req, res) => {
    res.render("client/pages/user/reset-password", { pageTitle: "Đổi mật khẩu" });
};

//[POST] /user/password/reset
module.exports.resetPasswordPost =  async (req, res) => {
    const password = md5(req.body.password);
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({ tokenUser: tokenUser }, { $set: { password: password } });
    res.redirect("/");
};

//[GET] /user/info
module.exports.info = (req, res) => {
    res.render("client/pages/user/info", { pageTitle: "Thống tin tài khoản" });
};