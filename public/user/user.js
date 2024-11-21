import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to display users in the table
function displayUsers() {
    const dbRef = ref(db, 'users');
    get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
            const userTable = document.getElementById("customerTable").getElementsByTagName("tbody")[0];
            let index = 1;
            
            snapshot.forEach((userSnapshot) => {
                const userData = userSnapshot.val();

                // Create a row for each user
                const row = userTable.insertRow();

                // Insert data into the cells
                row.insertCell(0).textContent = index++;
                row.insertCell(1).textContent = userData.name || "N/A";
                row.insertCell(2).textContent = userData.id || "N/A";
                row.insertCell(3).textContent = userData.email || "N/A";
                row.insertCell(4).textContent = userData.phone || "N/A";
                row.insertCell(5).textContent = userData.address || "N/A";
                row.style.animationDelay = `${index * 0.1}s`;

            });
        } else {
            console.log("No data available.");
        }
    }).catch((error) => {
        console.error("Error fetching data:", error);
    });
}

// Lấy thanh tìm kiếm 
const searchBar = document.querySelector('.search-bar');
// Hàm tìm kiếm 
function searchTable() {
    const table = document.getElementById('customerTable');
    const tableBody = table.getElementsByTagName('tbody')[0];
    const tableRows = tableBody.querySelectorAll('tr'); // Lấy lại tất cả các hàng
    const query = searchBar.value.toLowerCase(); // Lấy từ khóa tìm kiếm
    let hasResult = false; // Biến để kiểm tra có kết quả hay không
    let index = 1; // Khởi tạo lại số thứ tự

    tableRows.forEach(row => {
        const rowText = row.textContent.toLowerCase(); // Lấy nội dung hàng
        if (rowText.includes(query)) {
            row.style.display = ''; // Hiển thị hàng
            row.cells[0].textContent = index++; // Cập nhật lại số thứ tự
            hasResult = true; // Có ít nhất một hàng phù hợp
        } else {
            row.style.display = 'none'; // Ẩn hàng không phù hợp
        }
    });

    // Xóa dòng thông báo cũ nếu tồn tại
    const noResultRow = tableBody.querySelector('.no-result-row');
    if (noResultRow) {
        tableBody.removeChild(noResultRow);
    }

    // Nếu không có kết quả, thêm dòng thông báo
    if (!hasResult) {
        const row = tableBody.insertRow(0); // Thêm hàng mới ở vị trí đầu tiên
        row.classList.add('no-result-row'); // Thêm class để nhận diện dòng thông báo

        const cell = row.insertCell(0);
        cell.colSpan = table.rows[0].cells.length; // Mở rộng ô bao phủ toàn bộ cột
        cell.textContent = "Không tìm thấy kết quả phù hợp.";
        cell.style.textAlign = 'center'; // Canh giữa văn bản
        cell.style.color = 'orange'; // Đổi màu chữ nếu cần
    }
}

// Gắn sự kiện input vào thanh tìm kiếm
if (searchBar) {
    searchBar.addEventListener('input', searchTable);
}



// Call displayUsers to populate the table when the page loads
window.onload = displayUsers;
