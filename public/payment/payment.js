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

function paymentDisplay() {
    const dbRef = ref(db, 'All Ride Requests');
    get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = [];
                snapshot.forEach((AllRideRequestSnapshot) => {
                    const AllRideRequestData = AllRideRequestSnapshot.val();
                    data.push(AllRideRequestData); // Đẩy dữ liệu vào mảng
                });

                const endedData = data.filter((rideRequest) => rideRequest.status);


                // Sắp xếp dữ liệu theo thời gian (sớm nhất trước)
                const SortData = endedData.sort((a,b) => {
                    const timeA = a.time ? new Date(a.time) : new Date(0); // Xử lý nếu không có thời gian
                    const timeB = b.time ? new Date(b.time) : new Date(0);
                    return timeB-timeA; // Sắp xếp tăng dần
                });

                // Hiển thị dữ liệu sau khi sắp xếp
                updateTable(SortData);
            } else {
                console.log("No data available.");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function updateTable(data) {
    const requestRideTable = document.getElementById("paymentTable").getElementsByTagName("tbody")[0];
    requestRideTable.innerHTML = ""; // Xóa dữ liệu cũ trong bảng
    
    let index = 1;

    data.forEach((AllRideRequestData) => {
        const row = requestRideTable.insertRow();
        row.insertCell(0).textContent = index++;
        row.insertCell(1).appendChild(createNestedDiv(AllRideRequestData.userName, AllRideRequestData.userPhone, 'UserInfomation'));
        row.insertCell(2).appendChild(createDiv(formatTime(AllRideRequestData.time), null, 'time'));
        row.insertCell(3).appendChild(createDiv(AllRideRequestData.fareAmount, null, 'Amount'));

        // Kiểm tra trạng thái thanh toán
        const payStatus = paid_status(AllRideRequestData['Pay Status']);
        row.insertCell(4).appendChild(createDiv(payStatus ? payStatus : "Chưa thanh toán", null, 'PayStatus'));

        const payInfo = AllRideRequestData['Pay Information'];

        // Nếu pay status là "Not Paid", để trống phương thức thanh toán
        if (AllRideRequestData['Pay Status'] === "Not Paid") {
            row.insertCell(5).appendChild(createDiv('', null, 'PayMethod'));
        } else if (payInfo['Pay Method'] === "Cash") {
            const cashDiv = document.createElement('div'); 
            cashDiv.textContent = "Tiền mặt"; 
            cashDiv.classList.add('cash-method'); 
            row.insertCell(5).appendChild(cashDiv);
        } else {
            const paymentInfoButton = payby(payInfo);
            row.insertCell(5).appendChild(paymentInfoButton); 
        }

        row.style.animationDelay = `${index * 0.1}s`;
    });
}


function payby(payInfo) {
    if (payInfo['Pay Method'] === "Cash") {
        return "tiền mặt";
    } else {
        const paymentInfoButton = document.createElement('button');
        paymentInfoButton.textContent = "Chuyển khoản";
        paymentInfoButton.onclick = () => BankInfomation(payInfo); // Truyền toàn bộ thông tin thanh toán
        return paymentInfoButton;
    }
}



function createDiv(content, childClass, parentClass) {
    const div = document.createElement('div');
    div.textContent = content; // Add text content
    if (parentClass) div.classList.add(parentClass); // Add parent class if provided
    if (childClass) div.classList.add(childClass); // Add child class if provided
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
function formatTime(timestamp) {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }
function paid_status(Paystatus) {
    if (Paystatus === "Paid") return "Đã thanh toán"
    
}

function BankInfomation(payInfo) {
    // Tạo container cho cửa sổ thông tin
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay'); // Lớp phủ tối bên ngoài modal

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content'); // Nội dung modal

    // Nút đóng
    const closeButton = document.createElement('button');
    closeButton.textContent = "Đóng";
    closeButton.classList.add('close-button');
    closeButton.onclick = () => document.body.removeChild(modalOverlay);

    // Nội dung thông tin thanh toán
    const title = document.createElement('h2');
    title.textContent = "Thông Tin Ngân Hàng";

    const payAmount = document.createElement('p');
    payAmount.textContent = `Số tiền đã chuyển: ${payInfo['amount'] || "N/A"}`;

    const bank = document.createElement('p');
    bank.textContent = `Ngân hàng: ${payInfo['bankType'] || "N/A"}`;

    const creditCard = document.createElement('p');
    creditCard.textContent = `Loại thẻ: ${payInfo['cardType'] || "N/A"}`;

    const payDay = document.createElement('p');
    payDay.textContent = `Thời gian thanh toán: ${formatPayDate(payInfo['payDate'])}`;

    const bankCode = document.createElement('p');
    bankCode.textContent = `Mã ngân hàng: ${payInfo['codeBank'] || "N/A"}`;

    const status = document.createElement('p');
    status.textContent = `Kết quả: ${payInfo['status'] || "N/A"}`;

    // Thêm các phần tử vào modal
    modalContent.appendChild(title);
    modalContent.appendChild(payAmount);
    modalContent.appendChild(bank);
    modalContent.appendChild(creditCard);
    modalContent.appendChild(payDay);
    modalContent.appendChild(bankCode);
    modalContent.appendChild(status);
    modalContent.appendChild(closeButton);
    modalOverlay.appendChild(modalContent);

    // Thêm modal vào trang
    document.body.appendChild(modalOverlay);
}

function formatPayDate(payDate) {
    if (!payDate) return "N/A";

    // Tách các thành phần từ chuỗi
    const year = payDate.slice(0, 4);
    const month = payDate.slice(4, 6);
    const day = payDate.slice(6, 8);
    const hours = payDate.slice(8, 10);
    const minutes = payDate.slice(10, 12);
    const seconds = payDate.slice(12, 14);

    // Tạo chuỗi định dạng ngày tháng
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

// Lấy thanh tìm kiếm 
const searchBar = document.querySelector('.search-bar');
// Hàm tìm kiếm 
function searchTable() {
    const table = document.getElementById('paymentTable');
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



window.onload = paymentDisplay