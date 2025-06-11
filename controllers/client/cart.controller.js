const Cart = require("../../models/cart.model");

// [POST] /cart/add/:id
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cart_id;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cart = await Cart.findOne({ _id: cartId });
  if(cart) {
    const product = cart.product.find(item => item.product_id === productId);
    if(product) {
      const newQuantity = product.quantity + quantity;
     await Cart.updateOne(
       { _id: cartId, "product.product_id": productId },
       { $set: { "product.$.quantity": newQuantity } }
     );
     return res.redirect(req.get("referer") || "/");
    }
    
  }
  await Cart.updateOne(
    { _id: cartId },
    { $push: { product: { product_id: productId, quantity: quantity } } }
  );
  req.flash("success", "Add to cart successfully!");
  res.redirect(req.get("referer") || "/");
};
