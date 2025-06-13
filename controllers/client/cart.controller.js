const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");

//[GET] /cart
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
  console.log('cart', cart);
  res.render("client/pages/cart/index", { pageTitle: "Giỏ hàng", cartDetail: cart });
}


// [POST] /cart/add/:id
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cart_id;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cart = await Cart.findOne({ _id: cartId });
  if(cart) {
    const product = cart.products.find(item => item.product_id === productId);
    if(product) {
      const newQuantity = product.quantity + quantity;
     await Cart.updateOne(
       { _id: cartId, "products.product_id": productId },
       { $set: { "products.$.quantity": newQuantity } }
     );
     return res.redirect(req.get("referer") || "/");
    }
    
  }
  await Cart.updateOne(
    { _id: cartId },
    { $push: { products: { product_id: productId, quantity: quantity } } }
  );
  req.flash("success", "Add to cart successfully!");
  res.redirect(req.get("referer") || "/");
};

//[GET] /cart/delete/:id
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cart_id;
  const productId = req.params.productId;
  await Cart.updateOne({ _id: cartId }, { $pull: { products: { product_id: productId } } });
  
  req.flash("success", "Delete from cart successfully!");
  res.redirect(req.get("referer") || "/cart");
};

//[GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cart_id;
  const productId = req.params.productId;
  const quantity = parseInt(req.params.quantity);
  await Cart.updateOne(
    { _id: cartId, "products.product_id": productId },
    { $set: { "products.$.quantity": quantity } }
  );
  res.redirect(req.get("referer") || "/cart");
};
