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
