const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chat.controller");
const authMiddlewares = require("../../middlewares/client/auth.middlewares");

  const chatMiddlewares = require("../../middlewares/client/chat.middlewares");

  router.get("/:roomChatId", authMiddlewares.requireAuth, chatMiddlewares.isAccess, controller.index);


module.exports = router;