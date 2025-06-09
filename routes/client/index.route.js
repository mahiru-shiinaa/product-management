const productRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const categoryMiddlewares = require("../../middlewares/client/category.middlewares");

module.exports = (app) => {
  app.use(categoryMiddlewares.category)
  app.use("/",  homeRoutes);

  app.use("/products",  productRoutes);

};
