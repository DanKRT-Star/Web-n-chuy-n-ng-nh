
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Cấu hình Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBYZ3VzpzdWWshQVVWzBb4LFx8CiPjTW3s",
    authDomain: "login-register-firebase-d2cd3.firebaseapp.com",
    databaseURL: "https://login-register-firebase-d2cd3-default-rtdb.firebaseio.com/",
    projectId: "login-register-firebase-d2cd3",
    storageBucket: "login-register-firebase-d2cd3.appspot.com",
    messagingSenderId: "744521823113",
    appId: "1:744521823113:web:90e29139b22aa321a0e758"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Hàm xác thực thông tin đăng nhập
function validateAdminLogin(email, password) {
    const dbRef = ref(db);
    get(child(dbRef, 'Admin')).then((snapshot) => {
        if (snapshot.exists()) {
            const adminData = snapshot.val();
            const adminEmail = adminData['Admin email'];
            const adminPass = adminData['Admin password'];

            // Log dữ liệu để kiểm tra
            console.log('Admin Email:', adminEmail);
            console.log('Admin Password:', adminPass);
            console.log('User Input Email:', email);
            console.log('User Input Password:', password);

            // Kiểm tra thông tin đăng nhập
            if (email === adminEmail && password === adminPass) {
                console.log("Đăng nhập thành công!");
                window.location.href = "./homepage/homepage.html"; 
            } else {
                console.log("Thông tin đăng nhập không hợp lệ.");
            }
        } else {
            console.log("Không tìm thấy dữ liệu Admin.");
        }
    }).catch((error) => {
        console.error("Lỗi khi truy xuất dữ liệu:", error);
    });
}

// Xử lý sự kiện toggle password
const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("passwordInput");

if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        // Kiểm tra loại input và thay đổi icon
        const isPasswordVisible = passwordInput.type === "text";
        passwordInput.type = isPasswordVisible ? "password" : "text";

        // Thay đổi icon dựa trên trạng thái hiện tại
        togglePassword.src = isPasswordVisible ? "./images/eye-closed.png" : "./images/eye-open.png";
    });
}

// Gọi hàm xác thực khi người dùng nhấn nút đăng nhập
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Ngăn hành vi mặc định của form
    const email = document.getElementById("emailInput").value;
    const password = document.getElementById("passwordInput").value;
    validateAdminLogin(email, password);
});
