const icons = document.querySelectorAll('.sidebar ul li i:not(.exclude)')
const sign_out_icon = document.querySelector('.sidebar ul li i.exclude');
const sidebar = document.querySelector('.sidebar')
const span = document.querySelectorAll('.sidebar ul li span:not(.exclude)')
const sign_out_span = document.querySelector('.sidebar ul li span.exclude');
const active = document.getElementById('active')


// sidebar.js

document.querySelector(".sidebar-header i").addEventListener("click", function() {
    document.querySelector(".sidebar-container").classList.toggle("active_menu");
    document.querySelector(".navigationbar").classList.toggle("active_menu")
    document.querySelector(".titlepage").classList.toggle("active_menu");
    document.querySelector(".mainChart").classList.toggle("active_menu");
    document.querySelector(".title").classList.toggle("active_menu");
    document.querySelector(".sideChart1").classList.toggle("active_menu");
    document.querySelector(".sideChart2").classList.toggle("active_menu");
    document.querySelector(".titleh1").classList.toggle(".active_menu");
});




 // Thêm sự kiện click cho từng box
 icons.forEach(box => {
    box.addEventListener("click", function() {
        // Lấy tên chức năng từ thuộc tính data-function
        const functionName = box.getAttribute("data-function");

        // Chuyển hướng đến trang tương ứng theo thư mục
        window.location.href = `../${functionName}/${functionName}.html`;
    });
});

span.forEach(box => {
    box.addEventListener("click", function() {
        // Lấy tên chức năng từ thuộc tính data-function
        const functionName = box.getAttribute("data-function");

        // Chuyển hướng đến trang tương ứng theo thư mục
        window.location.href = `../${functionName}/${functionName}.html`;
    });
});

sign_out_icon.addEventListener("click", function() {
    window.location.href = `../index.html`;
    }
)
sign_out_span.addEventListener("click", function() {
    window.location.href = `../index.html`;
    }
)

