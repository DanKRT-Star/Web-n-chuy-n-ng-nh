import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onChildChanged, onChildAdded, onChildRemoved, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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
    cells[2].innerHTML = createDiv(formatTime(data.time), null, 'time').outerHTML;
    cells[3].innerHTML = createDiv(data.fareAmount, null, "Amount").outerHTML;
    const payInfo = data['Pay Information'] || {};
    const PaidstatusCell = row.cells[4];
    const PaidstatusDiv = PaidstatusCell.querySelector('.PayStatus');
    const newPaidStatus = data['Pay Status'];

    // Nếu trạng thái thay đổi
    if (!PaidstatusDiv.classList.contains(newPaidStatus)) {
        // Loại bỏ tất cả các class trạng thái cũ
        PaidstatusDiv.classList.remove('Paid', 'NotPaid');
        
        // Thêm hiệu ứng phóng to khi trạng thái thay đổi
        PaidstatusDiv.classList.add('status-transition');

        // Đặt trạng thái mới
        if (newPaidStatus === 'Paid') {
            PaidstatusDiv.classList.add(newPaidStatus);
        } else {
            PaidstatusDiv.classList.add('NotPaid');
        };
        PaidstatusDiv.textContent = (newPaidStatus === 'Paid') ? "Đã thanh toán" : "Chưa thanh toán"; // Cập nhật nội dung nếu cần

        // Gỡ hiệu ứng sau 300ms (tương ứng với thời gian trong CSS)
        setTimeout(() => {
            PaidstatusDiv.classList.remove('status-transition');
        }, 300);
    }
    const PayMethodCell = row.cells[5];
    const PayMethodDiv = PayMethodCell.querySelector('.PayMethod');
    const newPayMethod = payInfo['Pay Method'] || null;

     // Nếu trạng thái thay đổi
     if (!PayMethodDiv.classList.contains(newPayMethod)) {
        // Loại bỏ tất cả các class trạng thái cũ
        PayMethodDiv.classList.remove('Cash', 'Banking', 'ZALOPAY');
        
        // Thêm hiệu ứng phóng to khi trạng thái thay đổi
        PayMethodDiv.classList.add('status-transition');

        // Đặt trạng thái mới
        PayMethodDiv.classList.add(newPayMethod);
        PayMethodDiv.textContent = (newPayMethod === null)? null : (newPayMethod === "Cash")? "Tiền mặt" :  (newPayMethod === "ZALOPAY")? "ZALOPAY" : "Chuyển khoản"; // Cập nhật nội dung nếu cần

        // Gỡ hiệu ứng sau 300ms (tương ứng với thời gian trong CSS)
        setTimeout(() => {
            PayMethodDiv.classList.remove('status-transition');
        }, 300);

    }
}

function addRow(key, data) {
    const requestRideTable = document.getElementById("paymentTable").getElementsByTagName("tbody")[0];
    const row = requestRideTable.insertRow();
    const payInfo = data['Pay Information'] || {};

    row.setAttribute("data-key", key); // Gán key để xác định hàng
    row.insertCell(0).textContent = requestRideTable.rows.length; // Số thứ tự
    row.insertCell(1).appendChild(createNestedDiv(data.userName, data.userPhone, 'UserInfomation'));
    row.insertCell(2).appendChild(createDiv(formatTime(data.time), null, 'time'));
    row.insertCell(3).appendChild(createDiv(data.fareAmount, null, 'Amount'));
    const PaidStatus = data['Pay Status'];
    row.insertCell(4).appendChild(createDiv((PaidStatus === "Paid")? 'Đã thanh toán':'Chưa thanh toán', (PaidStatus === "Paid")? 'Paid':'NotPaid', 'PayStatus'));
    const PayMethod = payInfo['Pay Method']|| null;
    row.insertCell(5).appendChild(createDiv((PayMethod === null)? null:(PayMethod === "Cash")? 'Tiền mặt' : (PayMethod === "ZALOPAY")? 'ZaloPay' : 'Chuyển khoản',(PayMethod === null)? null : (PayMethod === "Cash")? 'Cash': (PayMethod === "ZALOPAY")? 'ZALOPAY' : 'Banking','PayMethod'));
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

  document.addEventListener('click', (event) => {
    // Kiểm tra nếu click vào phần tử trong cột Pay Method
    const clickedElement = event.target;

    // Xác định lớp PayMethod và nội dung "Chuyển khoản"
    if (clickedElement.classList.contains('PayMethod') && clickedElement.textContent.trim() === 'Chuyển khoản') {
        // Lấy thông tin thanh toán từ hàng tương ứng
        const row = clickedElement.closest('tr');
        const key = row.getAttribute('data-key'); // Lấy key từ hàng
        const dbRef = ref(db, `All Ride Requests/${key}/Pay Information`);

        // Truy vấn thông tin từ Firebase
        onValue(dbRef, (snapshot) => {
            const payInfo = snapshot.val();
            if (payInfo) {
                BankInfomation(payInfo); // Gọi hàm hiển thị thông tin ngân hàng
            } else {
                alert("Không có thông tin ngân hàng.");
            }
        });
    }
});

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


document.getElementById('payStatusHeader').addEventListener('click', () => {
    showFilterOptions('payStatus');
});

document.getElementById('timeHeader').addEventListener('click', () => {
    showFilterOptions('time');
});

document.getElementById('payMethodHeader').addEventListener('click', () => {
    showFilterOptions('payMethod');
});

document.addEventListener('click', (e) => {
    const filterOptions = document.querySelector('.filter-options');
    if (filterOptions && !filterOptions.contains(e.target) && !e.target.closest('th')) {
        filterOptions.remove(); // Đóng danh sách lọc
    }
});

let currentFilters = {
    payStatus: 'All',
    time: null,
    payMethod: 'All'
};

function applyFilter(type, option) {
    if (type === 'payStatus') {
        currentFilters.payStatus = option;
    } else if (type === 'time') {
        currentFilters.time = option;
    } else if (type === 'payMethod') {
        currentFilters.payMethod = option;
    }

    filterTable(currentFilters); // Lọc bảng với các tuỳ chọn đã chọn
}

function showFilterOptions(type) { 
    let options = [];
    if (type === 'payStatus') {
        options = ['All', 'Chưa thanh toán', 'Đã thanh toán'];
    } else if (type === 'time') {
        options = ['Mới nhất', 'Cũ nhất'];
    } else if (type === 'payMethod') {
        options = ['All', 'Tiền mặt', 'Chuyển khoản', 'ZaloPay'];
    }

    // Tạo và hiển thị danh sách lọc
    const filterContainer = document.createElement('ul');
    filterContainer.classList.add('filter-options');

    options.forEach(option => {
        const li = document.createElement('li');
        li.textContent = option;
        li.addEventListener('click', () => {
            applyFilter(type, option); // Gọi hàm áp dụng lọc
            filterContainer.remove(); // Ẩn danh sách sau khi chọn
        });
        filterContainer.appendChild(li);
    });

    // Xóa danh sách cũ nếu có
    const existingFilter = document.querySelector('.filter-options');
    if (existingFilter) existingFilter.remove();

    // Thêm danh sách mới vào DOM
    document.body.appendChild(filterContainer);

    // Đặt vị trí cho danh sách lọc
    const header = document.getElementById(`${type}Header`);
    const rect = header.getBoundingClientRect();
    filterContainer.style.left = `${rect.left}px`;
    filterContainer.style.top = `${rect.bottom + window.scrollY}px`;
}

function filterTable(filters) {
    const tableBody = document.querySelector("#paymentTable tbody");
    const rows = Array.from(tableBody.querySelectorAll('tr'));

    rows.forEach(row => {
        let isValid = true;

        // Lọc theo tình trạng trả
        if (filters.payStatus && filters.payStatus !== 'All') {
            const statusCell = row.cells[4]; // Cột tình trạng trả
            const statusDiv = statusCell.querySelector('.PayStatus');
            const statusText = statusDiv.textContent.trim();
            isValid = isValid && statusText === filters.payStatus;
        }

        // Lọc theo phương thức thanh toán
        if (filters.payMethod && filters.payMethod !== 'All') {
            const methodCell = row.cells[5]; // Cột phương thức thanh toán
            const methodDiv = methodCell.querySelector('.PayMethod');
            const methodText = methodDiv.textContent.trim();
            isValid = isValid && methodText === filters.payMethod;
        }

        row.style.display = isValid ? '' : 'none'; // Hiển thị hoặc ẩn hàng
    });

    // Lọc và sắp xếp thời gian nếu cần
    const visibleRows = Array.from(tableBody.querySelectorAll('tr')).filter(row => row.style.display !== 'none');
    if (filters.time) {
        visibleRows.sort((rowA, rowB) => {
            const timeA = new Date(rowA.cells[2].textContent.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1'));
            const timeB = new Date(rowB.cells[2].textContent.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1'));
            return filters.time === 'Mới nhất' ? timeB - timeA : timeA - timeB;
        });
    }

    // Cập nhật lại thứ tự hàng
    visibleRows.forEach((row, index) => {
        row.cells[0].textContent = index + 1; // Cập nhật lại số thứ tự
        tableBody.appendChild(row); // Đảm bảo hàng ở đúng vị trí
    });
}

listenToUpdates();