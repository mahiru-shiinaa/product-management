// [GET] /admin/dashboard
const md5 = require("md5");
const Account = require("../../models/account.model");

module.exports.login = (req, res) => {
    if(req.cookies.token) return res.redirect("/admin/dashboard");
    else {
        res.render("admin/pages/auth/login", { pageTitle: "Đăng nhập" });
    }
};

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const account = await Account.findOne({ email: email });

    if (!account) {
        req.flash("error", "Tài khoản không tồn tại!");
        res.redirect("/admin/auth/login");
        return;
    }

    if (account.password !== password) {
        req.flash("error", "Sai mật khẩu!");
        res.redirect("/admin/auth/login");
        return;
    }
    if (account.status === "inactive") {
        req.flash("error", "Tài khoản bi khoá!");
        res.redirect("/admin/auth/login");
        return;
    }
    res.cookie("token", account.token, { httpOnly: true });
    req.flash("success", "Login thành công!");
    res.redirect("/admin/dashboard");
};

module.exports.logout = (req, res) => {
    res.clearCookie("token");
    res.redirect("/admin/auth/login");
};