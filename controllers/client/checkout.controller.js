const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");

//[GET] /checkout
module.exports.index = async (req, res) => {
      const cartId = req.cookies.cart_id;
  const cart = await Cart.findOne({ _id: cartId });
  if(cart.products.length > 0) {
    for(const item of cart.products) {
      const product = await Product.findOne({ _id: item.product_id });
      productHelper.priceNewProduct(product);
      item.totalPrice = item.quantity*product.priceNew;
      item.productInfo = product;
    }
  }
  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);
    res.render("client/pages/checkout/index", { pageTitle: "Đặt hàng", cartDetail: cart }); 
};