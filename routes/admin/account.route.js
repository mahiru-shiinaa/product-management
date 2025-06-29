const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/account.controller");
const multer = require("multer");
const upload = multer();
const validate = require("../../validates/admin/account.validate");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");

  router.get("/", controller.index); 
  router.get("/create", controller.create); 
  router.post("/create", upload.single("avatar"), uploadCloud.upload, validate.createPost, controller.createPost); 
  router.get("/edit/:id", controller.edit); 
  router.patch("/edit/:id", upload.single("avatar"), uploadCloud.upload, validate.createPost, controller.editPatch);

module.exports = router;