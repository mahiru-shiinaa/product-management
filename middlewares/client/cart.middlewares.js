const  Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  // res.locals.cartId = req.cookies.cart_id;
  if (!req.cookies.cart_id) {
    const cart = new Cart({});
    await cart.save();
    const expirseTime = 1000 * 60 * 60 * 24 * 365;
    res.cookie("cart_id", cart.id, { expirse: new Date(Date.now() + expirseTime ), httpOnly: true });
  } else {
  }
  next();
};
