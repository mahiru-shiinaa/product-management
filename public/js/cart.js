// Cập nhật số lượng sản phẩm trong giỏ hàng
const inputQUantity = document.querySelectorAll("input[name='quantity']");
if (inputQUantity.length > 0) {
  inputQUantity.forEach((input) => {
    input.addEventListener("change", () => {
      const id = input.getAttribute("product-id");
      const quantity = parseInt(input.value);
      if (quantity > 0) {
        window.location.href = `/cart/update/${id}/${quantity}`;
      }

      // updateQuantity(id, quantity);
    });
  });
}
