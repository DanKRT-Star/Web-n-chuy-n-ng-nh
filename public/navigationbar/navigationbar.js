const adminIcon = document.getElementById("adminIcon");
const adminPopup = document.getElementById("adminPopup");
const closePopup = document.getElementById("closePopup");

adminIcon.addEventListener("click", () => {
    adminPopup.classList.toggle("show"); // Thêm hoặc xóa lớp "show"
});

closePopup.addEventListener("click", () => {
    adminPopup.classList.remove("show");
});

document.addEventListener("click", (event) => {
    if (!adminIcon.contains(event.target) && !adminPopup.contains(event.target)) {
        adminPopup.classList.remove("show");
    }
});

