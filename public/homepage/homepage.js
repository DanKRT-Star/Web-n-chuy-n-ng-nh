// Xử lý điều hướng khi click vào các box
document.addEventListener("DOMContentLoaded", function () {
    const boxes = document.querySelectorAll(".box");
    boxes.forEach((box) => {
        box.addEventListener("click", function () {
            const functionName = box.getAttribute("data-function");
            window.location.href = `../${functionName}/${functionName}.html`;
        });
    });
});

// Hiển thị popup thông tin Admin
document.getElementById("adminIcon").addEventListener("click", function () {
    document.getElementById("adminPopup").classList.toggle("show");
});

// Đóng popup thông tin Admin
document.getElementById("closePopup").addEventListener("click", function () {
    document.getElementById("adminPopup").classList.remove("show");
});

// Điều hướng đến trang đăng nhập khi logout
function redirectToPage() {
    window.location.href = "./index.html";
}
