const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
//[GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render(`admin/pages/roles/index`, {
    pageTitle: "Trang nhóm quyền",
    records: records,
  });
};
//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render(`admin/pages/roles/create`, {
    pageTitle: "Tạo nhóm quyền",
  });
};
//[POST] /admin/roles
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

//[GET] /admin/roles
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    let records = await Role.findOne({ _id: id });

    res.render(`admin/pages/roles/edit`, {
      pageTitle: "Trang nhóm quyền",
      records: records,
    });
  } catch (error) {
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/roles`);
  }
};
//[PATCH] /admin/roles/rdit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, req.body);
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

//[GET] /admin/roles
module.exports.permissions = async (req, res) => {
  try {
    let find = {
      deleted: false,
    };  
    const records = await Role.find(find);
    res.render(`admin/pages/roles/permissions`, {
      pageTitle: "Phân quyền quyền",
      records: records,
    });
    
  } catch (error) {
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/roles/permissions`);
  }
};


module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Cập nhật phân quyền thành công!");
    // Phải có không nó load trang liên tục vì nó ko biết sau khi submit sẽ đi về đâu
    res.redirect(req.get("referer") || `${systemConfig.prefixAdmin}/roles/permissions`);

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
  }
};