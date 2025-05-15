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
