const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector("#form-change-status");
  const path = formChangeStatus.getAttribute("data-path");
  buttonChangeStatus.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const statusCurrent = btn.getAttribute("data-status");
      const id = btn.getAttribute("data-id");
      let statusChange = statusCurrent == "active" ? "inactive" : "active";
      const action = `${path}/${statusChange}/${id}?_method=PATCH`;
      formChangeStatus.action = action;

      formChangeStatus.submit();
    });
  });
}

// Checkbox Multi
const checkBoxMulti = document.querySelector("[checkbox-multi]");
if (checkBoxMulti) {
  // Lấy input check all trong table
  const inputCheckAll = checkBoxMulti.querySelector("input[name='checkAll']");
  // lấy input id trên từng hàng
  const inputsId = checkBoxMulti.querySelectorAll("input[name='id']");
  // Hàm sữ lý input check all
  // Nếu checked thì foreach qua từng input id xong cho nó bằng true và ngược lại
  inputCheckAll.addEventListener("click", () => {
    if (inputCheckAll.checked) {
      inputsId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputsId.forEach((input) => {
        input.checked = false;
      });
    }
  });
  // Hàm sữ lí input id khi chọn full thì input check all bằng true ngược lại không đủ thì false
  inputsId.forEach((input) => {
    input.addEventListener("click", () => {
      // countChecked  sẽ check lấy số lượng của những input id có trạng thái là checked
      const countChecked = checkBoxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;
      // So sánh số lượng check với tổng
      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

// Form change Multi

const formChangeMulti = document.querySelector("[form-change-multi]");

formChangeMulti.addEventListener("submit", (e) => {
  e.preventDefault();
  const checkBoxMulti = document.querySelector("[checkbox-multi]");
  const inputChecked = checkBoxMulti.querySelectorAll(
    "input[name='id']:checked"
  );

  const typeChange = e.target.elements.type.value;

  if (typeChange === "delete-all") {
    const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này");
    if (!isConfirm) return;
  }
  if (inputChecked.length > 0) {
    let ids = [];
    const inputIds = formChangeMulti.querySelector("input[name='ids']");
    inputChecked.forEach((input) => {
      ids.push(input.value);
    });
    inputIds.value = ids.join(", ");
    formChangeMulti.submit();
  } else {
    alert("Vui lớn chọn ít nhất 1 bảng ghi");
  }
});

// Xóa sản phẩm
const buttonDelete = document.querySelectorAll("[button-delete]");
if (buttonDelete.length > 0) {
  const formDeleteItem = document.querySelector("#form-delete-item");
  const path = formDeleteItem.getAttribute("data-path");
  buttonDelete.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const isConfirm = confirm("Bạn có chắc xóa sản phẩm này");
      if (isConfirm) {
        const id = btn.getAttribute("data-id");
        const action = `${path}/${id}?_method=DELETE`;
        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    });
  });
}
