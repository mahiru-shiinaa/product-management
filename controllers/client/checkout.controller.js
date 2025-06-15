const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products");
const Order = require("../../models/order.model");

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

//[POST] /checkout/order
module.exports.order = async (req, res) => {
const cartId = req.cookies.cart_id;
const userInfo = req.body;
const cart = await Cart.findOne({ _id: cartId });
let products = []
for(const product of cart.products) {
    const objectProduct = {
        product_id: product.product_id,
        quantity: product.quantity,
        discountPercentage: 0,
        price: 0
    }
    const productInfo = await Product.findOne({ _id: product.product_id });
    productHelper.priceNewProduct(productInfo);
    objectProduct.price = productInfo.priceNew;
    objectProduct.discountPercentage = productInfo.discountPercentage;
    products.push(objectProduct);
    
}

const objectOder = {
    cart_id: cartId,
    userInfo: userInfo,
    products: products
}

const order = new Order(objectOder);
await order.save();
await Cart.updateOne({ _id: cartId }, { $set: { products: [] } });

res.redirect("/checkout/success/" + order._id);
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    const id = req.params.orderId;
    const order = await Order.findOne({ _id: id });
    for ( const product of order.products) {
      const productInfo = await Product.findOne({ _id: product.product_id }).select("title thumbnail priceNew discountPercentage");
      product.productInfo = productInfo;
      product.totalPrice = product.quantity*product.price;
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
    res.render("client/pages/checkout/success", { pageTitle: "Đặt hàng thành công", order: order });
};