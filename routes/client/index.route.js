const productRoutes = require("./products.route");
const homeRoutes = require("./home.route");
const categoryMiddlewares = require("../../middlewares/client/category.middlewares");
const searchRoutes = require("./search.route");
const cartMiddlewares = require("../../middlewares/client/cart.middlewares");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
const usersRoutes = require("./users.route");
const chatRoutes = require("./chat.route");
const userMiddlewares = require("../../middlewares/client/user.middlewares");
const settingMiddlewares = require("../../middlewares/client/setting.middlewares");
const authMiddlewares = require("../../middlewares/client/auth.middlewares");
const roomsChatRoutes = require("./rooms-chat.route");
module.exports = (app) => {
  app.use(categoryMiddlewares.category)
  app.use(settingMiddlewares.settingGeneral)
  app.use(userMiddlewares.infoUser)
  app.use(cartMiddlewares.cartId)
  app.use("/",  homeRoutes);

  

  app.use("/products",  productRoutes);
  app.use("/search",  searchRoutes);
  app.use("/cart",  cartRoutes);
  app.use("/checkout",  checkoutRoutes);
  app.use("/user",  userRoutes);
  app.use("/chat", authMiddlewares.requireAuth,  chatRoutes);
  app.use("/users", authMiddlewares.requireAuth,    usersRoutes);
  app.use("/rooms-chat", authMiddlewares.requireAuth,    roomsChatRoutes);

};
