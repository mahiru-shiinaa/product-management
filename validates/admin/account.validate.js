module.exports.createPost = (req, res, next) => {
    if(req.body.fullName === "") {
    req.flash("error", "Vui lòng nhập tên tài khoản");
    res.redirect(req.get("referer") || "/admin/accounts/create");
    return;
  }

  next();

}