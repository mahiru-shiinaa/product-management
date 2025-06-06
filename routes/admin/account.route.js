const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");
const multer = require("multer");
const upload = multer();
const validate = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

  router.get("/", controller.index); 
  router.get("/create", controller.create); 
  router.post("/create", upload.single("avatar"), validate.createPost, controller.createPost); 

module.exports = router;