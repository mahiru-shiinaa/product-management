module.exports.createPost = (req, res, next) => {
    if(req.body.title === "") {
    req.flash("error", "Vui lòng nhập tiêu đề sản phẩm");
    res.redirect(req.get("referer") || "/admin/products/create");
    return;
  }

  next();

}