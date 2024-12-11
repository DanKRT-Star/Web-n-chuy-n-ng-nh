import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onChildChanged, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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


function listenToUpdates() {
    const dbRef = ref(db, 'All Ride Requests');

    // Lắng nghe khi dữ liệu con bị thay đổi
    onChildChanged(dbRef, (snapshot) => {
        const updatedData = snapshot.val();
        updateRow(snapshot.key, updatedData); // Cập nhật hàng bị thay đổi
    });

    // Lắng nghe khi có dữ liệu con mới
    onChildAdded(dbRef, (snapshot) => {
        const newData = snapshot.val();
        addRow(snapshot.key, newData); // Thêm hàng mới
    });

    // Lắng nghe khi có dữ liệu con bị xóa
    onChildRemoved(dbRef, (snapshot) => {
        removeRow(snapshot.key); // Xóa hàng tương ứng
    });
}

function updateRow(key, data) {
    const row = document.querySelector(`[data-key="${key}"]`);
    if (!row) return; // Nếu không tìm thấy hàng, bỏ qua

    // Cập nhật từng cột của hàng
    const cells = row.cells;
    cells[1].innerHTML = createNestedDiv(data.userName, data.userPhone, 'UserInfomation').outerHTML;
    cells[2].innerHTML = createNestedDiv(
        data.drivername || "Đang chờ...",
        data.drivername ? data.driverphone : calculateWaitTime(data.time),
        'DriverInfomation'
    ).outerHTML;
    cells[3].textContent = data.originAddress;
    const statusCell = row.cells[4];
    const statusDiv = statusCell.querySelector('.statusform');
    const newStatus = data.status || "waiting";

    // Nếu trạng thái thay đổi
    if (!statusDiv.classList.contains(newStatus)) {
        // Loại bỏ tất cả các class trạng thái cũ
        statusDiv.classList.remove('ended', 'arrived', 'accepted', 'failed', 'waiting');
        
        // Thêm hiệu ứng phóng to khi trạng thái thay đổi
        statusDiv.classList.add('status-transition');

        // Đặt trạng thái mới
        statusDiv.classList.add(newStatus);
        statusDiv.textContent = newStatus; // Cập nhật nội dung nếu cần

        // Gỡ hiệu ứng sau 300ms (tương ứng với thời gian trong CSS)
        setTimeout(() => {
            statusDiv.classList.remove('status-transition');
        }, 300);
    }

    cells[5].innerHTML = createDiv(formatTime(data.time), null, 'time').outerHTML;

    const ratingDiv = cells[6].querySelector('.rating');
    renderRating(ratingDiv, data.ratings);
}

function addRow(key, data) {
    const requestRideTable = document.getElementById("requestRideTable").getElementsByTagName("tbody")[0];
    const row = requestRideTable.insertRow();
    row.setAttribute("data-key", key); // Gán key để xác định hàng

    row.insertCell(0).textContent = requestRideTable.rows.length; // Số thứ tự
    row.insertCell(1).appendChild(createNestedDiv(data.userName, data.userPhone, 'UserInfomation'));
    row.insertCell(2).appendChild(createNestedDiv(
        data.drivername || "Đang chờ...",
        data.drivername ? data.driverphone : calculateWaitTime(data.time),
        'DriverInfomation'
    ));
    row.insertCell(3).textContent = data.originAddress;
    row.insertCell(4).appendChild(createDiv(data.status || "waiting", null, 'statusform'));
    row.insertCell(5).appendChild(createDiv(formatTime(data.time), null, 'time'));

    const ratingCell = row.insertCell(6); 
    const ratingDiv = document.createElement('div');
    ratingDiv.classList.add('rating');
    ratingCell.appendChild(ratingDiv);
    renderRating(ratingDiv, data.ratings);

    // Thêm hiệu ứng cho hàng mới
    row.classList.add('row-added');
    setTimeout(() => {
        row.classList.remove('row-added');
    }, 1000);
}

function removeRow(key) {
    const row = document.querySelector(`[data-key="${key}"]`);
    if (row) row.remove(); // Xóa hàng nếu tồn tại
}

function formatTime(timestamp) {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  function calculateWaitTime(startTime) {
    const startTimestamp = new Date(startTime).getTime();
    const now = new Date().getTime();
    const diffInSeconds = Math.floor((now - startTimestamp) / 1000);

    const hours = Math.floor(diffInSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((diffInSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (diffInSeconds % 60).toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
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
            case 'nonaccepted':
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

setInterval(() => {
    const driverInfoElements = document.querySelectorAll('.DriverInfomation');

    driverInfoElements.forEach((element) => {
        const driverName = element.querySelector('.Name').textContent;
        const phoneElement = element.querySelector('.Phone');

        // Cập nhật thời gian chờ nếu tài xế đang chờ
        if (driverName === "Đang chờ...") {
            const row = element.closest('tr');
            const timeCell = row.cells[5].querySelector('.time');
            const requestTime = timeCell.textContent;

            // Chuyển đổi định dạng thời gian từ dd/mm/yyyy hh:mm thành timestamp
            const [datePart, timePart] = requestTime.split(' ');
            const [day, month, year] = datePart.split('/');
            const [hours, minutes] = timePart.split(':');
            const formattedTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);

            phoneElement.textContent = calculateWaitTime(formattedTime);
        }
    });
}, 1000);

listenToUpdates();
