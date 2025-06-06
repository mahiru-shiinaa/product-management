const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/product.controller");
const multer = require("multer");
//const storage = require("../../helpers/storageMulter");
const validate = require("../../validates/admin/product.validate");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middlewares");




router.get("/", controller.index);
router.patch("/change-status/:status/:id", controller.changeStatus);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  validate.createPost,
  controller.editPatch
);
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);
router.get("/detail/:id", controller.detail);

module.exports = router;
