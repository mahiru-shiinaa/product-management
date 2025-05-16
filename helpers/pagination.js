module.exports = (objectPagination, query, countProduct) => {
      if(query.page) {
    objectPagination.currentPage = parseInt(query.page);
  }
  // Dùng để tính số sản phẩm skip qua khi nhấn phân trang
  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;

  // Tính tổng số trang và tìm ra bao nhiêu pagination cùng với làm tròn số trang

  objectPagination.totalPage = Math.ceil(countProduct / objectPagination.limitItem);

  return objectPagination;
}