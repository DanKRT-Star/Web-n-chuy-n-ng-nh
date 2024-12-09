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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



function displayRideRequest() {
    const dbRef = ref(db, 'All Ride Requests');
    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = [];
                snapshot.forEach((AllRideRequestSnapshot) => {
                    const AllRideRequestData = AllRideRequestSnapshot.val();
                    data.push(AllRideRequestData); // Đẩy dữ liệu vào mảng
                });

                // Sắp xếp dữ liệu theo thời gian (sớm nhất trước)
                data.sort((a, b) => {
                    const timeA = a.time ? new Date(a.time) : new Date(0); // Xử lý nếu không có thời gian
                    const timeB = b.time ? new Date(b.time) : new Date(0);
                    return timeB-timeA; // Sắp xếp tăng dần
                });

                // Hiển thị dữ liệu sau khi sắp xếp
                updateTable(data);
            } else {
                console.log("No data available.");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function updateTable(data) {
    const requestRideTable = document.getElementById("requestRideTable").getElementsByTagName("tbody")[0];
    requestRideTable.innerHTML = ""; // Xóa dữ liệu cũ trong bảng
    let index = 1;

    data.forEach((AllRideRequestData) => {
        const row = requestRideTable.insertRow();
        row.insertCell(0).textContent = index++;
        row.insertCell(1).appendChild(createNestedDiv(AllRideRequestData.userName, AllRideRequestData.userPhone, 'UserInfomation'));
        row.insertCell(2).appendChild(createNestedDiv(AllRideRequestData.drivername || "Đang chờ...", AllRideRequestData.driverphone || " ", 'DriverInfomation'));
        row.insertCell(3).textContent = AllRideRequestData.originAddress;
        row.insertCell(4).appendChild(createDiv(AllRideRequestData.status || "waiting", null, 'statusform'));
        row.insertCell(5).appendChild(createDiv(formatTime(AllRideRequestData.time), null, 'time'));
        const ratingCell = row.insertCell(6); 
        const ratingDiv = document.createElement('div');
        ratingDiv.classList.add('rating'); // Thêm class rating vào div
        ratingCell.appendChild(ratingDiv);

        // Cập nhật đánh giá sao cho mỗi hàng
        renderRating(ratingDiv, AllRideRequestData.ratings); // Truyền ratingDiv để render vào đúng vị trí

        row.style.animationDelay = `${index * 0.1}s`;
    });
}

function formatTime(timestamp) {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

function createDiv(content, childClass, parentClass) {
    const div = document.createElement('div');
    div.textContent = content; // Add text content
    if (parentClass) div.classList.add(parentClass); // Add parent class if provided
    if (childClass) div.classList.add(childClass); // Add child class if provided
    if (parentClass === "statusform") {
        switch (content.toLowerCase()) {
            case 'ended':
                div.classList.add('ended');
                break;
            case 'arrived':
                div.classList.add('arrived');
                break;
            case 'accepted':
                div.classList.add('accepted');
                break;
            case 'nonAccepted':
                div.classList.add('failed');
                break;
            default:
                div.classList.add('waiting');
        }
    }
    return div;
  }

function createNestedDiv(content1, content2, parentClass) {
    const parentDiv = document.createElement('div');
    parentDiv.classList.add(parentClass); // Add class to parent div
  
    // Create two child divs
    const childDiv1 = document.createElement('div');
    childDiv1.textContent = content1;
    childDiv1.classList.add('Name'); // Class for the name div
  
    const childDiv2 = document.createElement('div');
    childDiv2.textContent = content2;
    childDiv2.classList.add('Phone'); // Class for the phone div
  
    // Append child divs to the parent div
    parentDiv.appendChild(childDiv1);
    parentDiv.appendChild(childDiv2);
  
    return parentDiv;
  }


  function renderRating(ratingContainer, rating) {
    ratingContainer.innerHTML = ''; // Xóa các ngôi sao hiện tại

    // Kiểm tra nếu không có rating
    if (rating === 0 || rating === undefined || rating === null) {
        // Nếu không có rating, hiển thị 5 ngôi sao rỗng
        for (let i = 0; i < 5; i++) {
            ratingContainer.innerHTML += '<i class="bx bx-star star"></i>'; // Ngôi sao rỗng
        }
    } else {
        // Nếu có rating, tính toán và hiển thị ngôi sao đầy, nửa đầy, và rỗng
        const fullStars = Math.floor(rating); // Số sao đầy
        const halfStars = rating % 1 >= 0.5 ? 1 : 0; // Nếu có nửa sao
        const emptyStars = 5 - fullStars - halfStars; // Số sao rỗng

        // Thêm sao đầy
        for (let i = 0; i < fullStars; i++) {
            ratingContainer.innerHTML += '<i class="bx bxs-star star"></i>'; // Ngôi sao đầy
        }

        // Thêm sao nửa đầy
        if (halfStars) {
            ratingContainer.innerHTML += '<i class="bx bxs-star-half star"></i>'; // Ngôi sao nửa đầy
        }

        // Thêm sao rỗng
        for (let i = 0; i < emptyStars; i++) {
            ratingContainer.innerHTML += '<i class="bx bx-star star"></i>'; // Ngôi sao rỗng
        }
    }
}

// Lấy thanh tìm kiếm và kiểm tra xem có tồn tại không
const searchBar = document.querySelector('.search-bar');
if (!searchBar) {
    console.error("Search bar not found!");
}

function searchTable() {
    const table = document.getElementById('requestRideTable');
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



  window.onload = displayRideRequest;
