module.exports.registerPost = (req, res, next) => {
    if(req.body.title === "") {
    req.flash("error", "Vui lòng nhập full name");
    res.redirect(req.get("referer"));
    return;
  }
    if(req.body.email === "") {
    req.flash("error", "Vui lòng nhập email");
    res.redirect(req.get("referer"));
    return;
  }
    if(req.body.password === "") {
    req.flash("error", "Vui lòng nhập mật khuẩu");
    res.redirect(req.get("referer"));
    return;
  }

  next();

}
module.exports.loginPost = (req, res, next) => {
    if(req.body.email === "") {
    req.flash("error", "Vui lòng nhập email");
    res.redirect(req.get("referer"));
    return;
  }
    if(req.body.password === "") {
    req.flash("error", "Vui lòng nhập mật khuẩu");
    res.redirect(req.get("referer"));
    return;
  }

  next();

}
module.exports.forgotPasswordPost = (req, res, next) => {
    if(req.body.email === "") {
    req.flash("error", "Vui lòng nhập email");
    res.redirect(req.get("referer"));
    return;
  }

  next();

}