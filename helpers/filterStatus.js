module.exports = (query) => {
    let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Ngừng hoạt động",
      status: "inactive",
      class: "",
    },
  ];
  
  if(query.status) {
    // Tìm vị trí bảng ghi có status bằng req.query.status trên đường linl
   const index = filterStatus.findIndex(item => item.status == query.status);
   filterStatus[index].class = "active";
  } else {
    const index = filterStatus.findIndex(item => item.status == "");
   filterStatus[index].class = "active";
  }
  
  return filterStatus;
}