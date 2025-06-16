const mongoose = require("mongoose");

// Tạo khung dữ liệu
const settingGeneralSchema = new mongoose.Schema(
  {
    websiteName: String,
    logo: String,
    phone: String,
    email: String,
    address: String,
    copyright: String,
  },
  {
    // Dùng để thêm thời gian tạo và cập nhật sản phẩm tự động
    timestamps: true,
  }
);

// Tạo model                  Tên model   Tên khung dữ liệu   Tên collection
const SettingGeneral = mongoose.model(
  "SettingGeneral",
  settingGeneralSchema,
  "settings-general"
);

module.exports = SettingGeneral;
