const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/chat.controller");
const authMiddlewares = require("../../middlewares/client/auth.middlewares");


  router.get("/", authMiddlewares.requireAuth, controller.index);


module.exports = router;