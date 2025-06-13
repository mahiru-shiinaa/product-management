const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
  // res.locals.cartId = req.cookies.cart_id;
  if (!req.cookies.cart_id) {
    const cart = new Cart({});
    await cart.save();
    const expirseTime = 1000 * 60 * 60 * 24 * 365;
    res.cookie("cart_id", cart.id, {
      expirse: new Date(Date.now() + expirseTime),
      httpOnly: true,
    });
  } else {
    const cart = await Cart.findOne({ _id: req.cookies.cart_id });
    const products = cart.products || [];
    cart.totalQuantity = products.reduce((sum, item) => sum + item.quantity, 0);
    res.locals.miniCart = cart;
  }
  next();
};
