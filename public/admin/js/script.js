// Button status
const buttonStatus = document.querySelectorAll("[button-status]");
if (buttonStatus.length > 0) {
  // dùng để cập nhập đường dẫn href,, hàm URL đã chứa những hàm sử lý với href
  let url = new URL(window.location.href);

  buttonStatus.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const status = btn.getAttribute("button-status");
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }
      
      window.location.href = url.href;
    });
  });
}

// form-search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    // Khỏi load trang
    e.preventDefault();
    const keyword = formSearch.keyword.value;;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }

    window.location.href = url.href;
  });
}

// Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination.length > 0) {
  let url = new URL(window.location.href);
  buttonPagination.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const page = btn.getAttribute("button-pagination");
      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}

// Thông báo flass

const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = document.querySelector(".close-alert");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
  uploadImage.addEventListener("change", () => {
    const img = document.querySelector("[upload-image-preview]");
    img.src = URL.createObjectURL(uploadImage.files[0]);
  });
}

// SORT
const sort = document.querySelector("[sort]");
if (sort) {
  const url = new URL(window.location.href);
  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = document.querySelector("[sort-clear]");
  sortSelect.addEventListener("change", (e) => {
    e.preventDefault();
    const value = e.target.value;
    const [sortKey, sortValue] = value.split("-");
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href;
  });
  sortClear.addEventListener("click", () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");
    window.location.href = url.href;
    console.log(url);
    
  });
  //Thêm selected cho option
  const sortKey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");
  if (sortKey && sortValue) {
    const stringSort = `${sortKey}-${sortValue}`;
    console.log('stringSort', stringSort);
    const optionSelected = sortSelect.querySelector(`option[value="${stringSort}"]`);
    optionSelected.selected = true;
  }
}
// END SORT