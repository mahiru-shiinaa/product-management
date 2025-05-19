const multer = require("multer");
const path = require("path");
module.exports = () => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/uploads/"); // Thư mục lưu file (đảm bảo thư mục này tồn tại)
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const base = path.basename(file.originalname, ext); // lấy tên gốc không có đuôi
      const filename = `${base}-${Date.now()}${ext}`;
      cb(null, filename);
    },
  });
  return storage;
};
