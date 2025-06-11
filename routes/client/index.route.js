const productRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const categoryMiddlewares = require("../../middlewares/client/category.middlewares");
const searchRoutes = require("./search.route");
const cartMiddlewares = require("../../middlewares/client/cart.middlewares");
const cartRoutes = require("./cart.route");

module.exports = (app) => {
  app.use(categoryMiddlewares.category)
  app.use(cartMiddlewares.cartId)
  app.use("/",  homeRoutes);

  app.use("/products",  productRoutes);
  app.use("/search",  searchRoutes);
  app.use("/cart",  cartRoutes);

};
