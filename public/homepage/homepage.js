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
