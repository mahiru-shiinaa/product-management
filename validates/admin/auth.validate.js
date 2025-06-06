module.exports.loginPost = (req, res, next) => {
    if(req.body.email === "") {
    req.flash("error", "Vui lòng nhập tên tài khoản");
    res.redirect(req.get("referer") || "/admin/auth/login");
    return;
  }

  if(req.body.password === "") {
    req.flash("error", "Vui lòng nhập mật khẩu");
    res.redirect(req.get("referer") || "/admin/auth/login");
    return;
  }

  next();

}