const SettingGeneral = require("../../models/settings-general.model");

//[GET] /admin/setting/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.render(`admin/pages/settings/general`, {
    pageTitle: "Cấu hình chung",
    settingGeneral: settingGeneral,
  });
};

//[PATCH] /admin/setting/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if (settingGeneral) {
    await SettingGeneral.updateOne({ _id: settingGeneral._id }, req.body);
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }

  req.flash("success", "Update successfully!");
  res.redirect(req.get("referer") || "/admin/setting/general");
};
