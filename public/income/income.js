// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, query, orderByChild, get, equalTo } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Firebase configuration
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

const ctx = document.getElementById('myChart').getContext('2d');
const ctx1 = document.getElementById('myChart1').getContext('2d');
const ctx2 = document.getElementById('myChart2').getContext('2d');
const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(255, 243, 68, 0.7)');
gradient.addColorStop(1, 'rgba(255, 153, 0, 0.7)');

const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [{
            label: 'Doanh số',
            data: [],
            backgroundColor: gradient,
            borderColor: '#ff9900',
            borderWidth: 1
        }]
    }
});

const myChart1 = new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
        datasets: [
            {
                label: 'Số lượng khách hàng',
                data: [],
                backgroundColor: 'rgba(173, 216, 230, 0.7)',
                borderColor: '#0000FF',
                borderWidth: 1
            },
            {
                label: 'Số lượng tài xế',
                data: [],
                backgroundColor: 'rgba(255, 153, 153, 0.7)',
                borderColor: '#FF0000',
                borderWidth: 1
            }
        ]
    }
});

const myChart2 = new Chart(ctx2, {
    type: 'pie',
    data: {
        labels: ['Chưa có tài xế','Đã đến điểm hẹn','Đã có tài xế','Thành công', 'Thất bại'], // Sắp xếp lại đúng thứ tự
        datasets: [{
            label: 'Kết quả vận chuyển',
            data: [], // Cập nhật lại số liệu cho đúng thứ tự nhãn
            backgroundColor: [
                 // Thành công
                'rgba(169, 169, 169, 0.7)',
                'rgba(175, 238, 238, 0.7)', 
                'rgba(255, 255, 153, 0.7)',
                'rgba(127, 255, 127, 0.7)',
                'rgba(255, 127, 127, 0.7)'
            ],
            borderColor: ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false  // Tắt phần chú thích
            },
            datalabels: {
                display: false // Tắt hoàn toàn Data Labels
            }
        }
    },
    plugins: [ChartDataLabels]
});

const divs = document.querySelectorAll('.box');
const income = document.querySelector('.income');
const amount = document.querySelector('.amount');
const result = document.querySelector('.result');

divs.forEach(div => {
    div.addEventListener('click', () => {
        const currentClass = div.classList[2];
        const currentChart = div.classList[1];

        if (currentClass === 'active_menu') {
            const openCurrentClass = div.classList[3]
            if (openCurrentClass === 'mainChart' ) {
                return;
            }
    
            divs.forEach(d => d.classList.remove('mainChart', 'sideChart1', 'sideChart2'));
    
            if (openCurrentClass === 'sideChart1' && currentChart === 'amount') {
                income.classList.add('sideChart2');
                result.classList.add('sideChart1');
                amount.classList.add('mainChart');
            } else if (openCurrentClass === 'sideChart2' && currentChart === 'result') {
                income.classList.add('sideChart1');
                result.classList.add('mainChart');
                amount.classList.add('sideChart2');
            } else if (openCurrentClass === 'sideChart1' && currentChart === 'result') {
                income.classList.add('sideChart1');
                result.classList.add('mainChart');
                amount.classList.add('sideChart2');
            } else if (openCurrentClass === 'sideChart2' && currentChart === 'income') {
                income.classList.add('mainChart');
                result.classList.add('sideChart2');
                amount.classList.add('sideChart1');
            } else if (openCurrentClass === 'sideChart1' && currentChart === 'income') {
                income.classList.add('mainChart');
                result.classList.add('sideChart2');
                amount.classList.add('sideChart1');
            } else if (openCurrentClass === 'sideChart2' && currentChart === 'amount') {
                income.classList.add('sideChart2');
                result.classList.add('sideChart1');
                amount.classList.add('mainChart');
            }
            
        } else {
            if (currentClass === 'mainChart' ) {
                return;
            }
    
            divs.forEach(d => d.classList.remove('mainChart', 'sideChart1', 'sideChart2'));
    
            if (currentClass === 'sideChart1' && currentChart === 'amount') {
                income.classList.add('sideChart2');
                result.classList.add('sideChart1');
                amount.classList.add('mainChart');
            } else if (currentClass === 'sideChart2' && currentChart === 'result') {
                income.classList.add('sideChart1');
                result.classList.add('mainChart');
                amount.classList.add('sideChart2');
            } else if (currentClass === 'sideChart1' && currentChart === 'result') {
                income.classList.add('sideChart1');
                result.classList.add('mainChart');
                amount.classList.add('sideChart2');
            } else if (currentClass === 'sideChart2' && currentChart === 'income') {
                income.classList.add('mainChart');
                result.classList.add('sideChart2');
                amount.classList.add('sideChart1');
            } else if (currentClass === 'sideChart1' && currentChart === 'income') {
                income.classList.add('mainChart');
                result.classList.add('sideChart2');
                amount.classList.add('sideChart1');
            } else if (currentClass === 'sideChart2' && currentChart === 'amount') {
                income.classList.add('sideChart2');
                result.classList.add('sideChart1');
                amount.classList.add('mainChart');
            }
        }
    });
});

const toggleButton = document.getElementById('selectedOption');
const dropdownMenu = document.getElementById('dropdownMenu');
const title = document.querySelector('.titleh1');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const yearSelectionInput = document.getElementById('yearSelection');
const startYearInput = document.getElementById('startYear');
const endYearInput = document.getElementById('endYear');

// Hiển thị menu chọn ngày/tháng/năm khi nhấp vào toggle
toggleButton.addEventListener('click', () => {
    if (dropdownMenu.style.display === 'none' || dropdownMenu.style.display === '') {
        dropdownMenu.style.display = 'flex';
    } else {dropdownMenu.style.display = 'none'}
});

// Hàm xử lý khi nhấn vào tiêu đề để mở lại menu chọn ngày/tháng/năm
title.addEventListener('click', () => {
    showDropdownMenu()
    // Xóa dữ liệu trong các ô nhập liệu
    startDateInput.value = '';
    endDateInput.value = '';
    yearSelectionInput.value = '';
    startYearInput.value = '';
    endYearInput.value = '';

});

// Hàm hiển thị menu chọn và ẩn các ô chọn thời gian
function showDropdownMenu() {
    dropdownMenu.style.display = 'none';
    toggleButton.style.display = 'inline';
    startDateInput.style.display = 'none';
    endDateInput.style.display = 'none';
    yearSelectionInput.style.display = 'none';
    startYearInput.style.display = 'none';
    endYearInput.style.display = 'none';
    title.textContent = "Bảng thống kê";
}

document.querySelectorAll('.dropdown-menu div').forEach(option => {
    option.addEventListener('click', () => {
        const value = option.textContent.trim(); // Lấy giá trị "ngày", "tháng", hoặc "năm"
        selectOption(value);
    });
});

function selectOption(option) {
    toggleButton.textContent = option; // Cập nhật nút toggle
    dropdownMenu.style.display = 'none'; // Đóng menu dropdown

    // Ẩn tất cả các ô thời gian
    startDateInput.style.display = 'none';
    endDateInput.style.display = 'none';
    yearSelectionInput.style.display = 'none';
    startYearInput.style.display = 'none';
    endYearInput.style.display = 'none';

    // Hiển thị ô thời gian tương ứng
    if (option === 'ngày') {
        startDateInput.style.display = 'inline';
        endDateInput.style.display = 'inline';
    } else if (option === 'tháng') {
        yearSelectionInput.style.display = 'inline';
    } else if (option === 'năm') {
        startYearInput.style.display = 'inline';
        endYearInput.style.display = 'inline';
    }

    updateTitle();
}

// Cập nhật tiêu đề và ẩn các ô chọn thời gian khi hoàn tất nhập
function updateTitle() {
    const option = toggleButton.textContent;
    let titleText = "Bảng thống kê";
    if (option === 'ngày' && startDateInput.value && endDateInput.value) {
        const startTimestamp = new Date(startDateInput.value).getTime();
        const endTimestamp = new Date(endDateInput.value).getTime();
        fetchChart1Data('ngày', startTimestamp, endTimestamp);
        fetchData(startDateInput.value, endDateInput.value, option);
        fetchRequestData(startDateInput.value, endDateInput.value, option);
        if (startDate.value === endDate.value){
            const startDate = new Date(startDateInput.value);
            const startDateFormatted = startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
            titleText +=  ` trong ngày ${startDateFormatted}`;
            startDateInput.style.display = 'none';
            endDateInput.style.display = 'none';
        }
       else {
        if (startDateInput.value > endDateInput.value && endDateInput.value !== "") {
            const a = startDateInput.value;
            startDateInput.value = endDateInput.value;
            endDateInput.value = a;
        }

        // Khởi tạo đối tượng Date từ các giá trị input
        const startDate = new Date(startDateInput.value);
        const endDate = new Date(endDateInput.value);

        // Kiểm tra nếu startDate và endDate hợp lệ
        if (!isNaN(startDate) && !isNaN(endDate)) {
            // Định dạng ngày thành "ngày/tháng/năm"
            const startDateFormatted = startDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
            const endDateFormatted = endDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

            titleText +=  ` từ ${startDateFormatted} tới ${endDateFormatted}`;
        } else {
            titleText += " - Ngày không hợp lệ";
        }

        startDateInput.style.display = 'none';
        endDateInput.style.display = 'none';
       }
        
    } else if (option === 'tháng' && yearSelectionInput.value) {
        const year = parseInt(yearSelectionInput.value);
        fetchChart1Data('tháng', year);
        fetchRequestData(null, null, option);
        fetchData(null, null, option);
        titleText +=  ` năm ${yearSelectionInput.value}`;
        yearSelectionInput.style.display = 'none';
    } else if (option === 'năm' && startYearInput.value && endYearInput.value) {
        const startYear = parseInt(startYearInput.value);
        const endYear = parseInt(endYearInput.value);
        fetchChart1Data('năm', startYear, endYear);
        fetchData(null, null, option); 
        fetchRequestData(null, null, option);
        if (startYearInput.value === endYearInput.value) {
            titleText +=  ` năm ${startYearInput.value}`;
            startYearInput.style.display = 'none';
            endYearInput.style.display = 'none';
        } else {
            if (startYearInput.value > endYearInput.value && endYearInput.value !== "") {
                const b = startYearInput.value;
                startYearInput.value = endYearInput.value;
                endYearInput.value = b;
            }
            titleText +=  ` từ ${startYearInput.value} tới ${endYearInput.value}`;
            startYearInput.style.display = 'none';
            endYearInput.style.display = 'none';
        }
    }

    title.textContent = titleText;
    toggleButton.style.display = 'none';  // Ẩn toggle button sau khi cập nhật tiêu đề
}

// Sự kiện để cập nhật tiêu đề khi người dùng điền thời gian
[startDateInput, endDateInput, yearSelectionInput, startYearInput, endYearInput].forEach(input => {
    input.addEventListener('change', updateTitle);
});


async function fetchData(startDate, endDate, option) {
    try {
        // Kiểm tra tính hợp lệ của dữ liệu nhập
        if ((option === 'ngày' && (!startDate || !endDate)) || 
            (option === 'tháng' && !yearSelectionInput.value) ||
            (option === 'năm' && (!startYearInput.value || !endYearInput.value))) {
            console.error("Invalid input for date/time selection.");
            return;
        }

        let queryRef = query(
            ref(db, 'All Ride Requests'),
            orderByChild('status'),
            equalTo('ended')
        );

        // Lấy dữ liệu từ Firebase
        const snapshot = await get(queryRef);
        if (snapshot.exists()) {
            const data = snapshot.val();
            const totalFare = {};
            const startTimestamp = startDate ? new Date(startDate).getTime() : null;
            const endTimestamp = endDate ? new Date(endDate).getTime() : null;

            // Lọc dữ liệu theo thời gian và xử lý
            for (const id in data) {
                const ride = data[id];
                const rideTime = new Date(ride.time).getTime();
                const fareAmount = parseFloat(ride.fareAmount || 0);

                // Lọc theo thời gian
                if (
                    (option === 'ngày' && rideTime >= startTimestamp && rideTime <= endTimestamp) ||
                    (option === 'tháng' && new Date(ride.time).getFullYear() === parseInt(yearSelectionInput.value)) ||
                    (option === 'năm' && rideTime >= new Date(startYearInput.value, 0, 1).getTime() && 
                        rideTime <= new Date(endYearInput.value, 11, 31).getTime())
                ) {
                    let key;
                    if (option === 'ngày') {
                        key = new Date(ride.time).toLocaleDateString('vi-VN');
                    } else if (option === 'tháng') {
                        key = new Date(ride.time).getMonth() + 1; // Tháng từ 1-12
                    } else if (option === 'năm') {
                        key = new Date(ride.time).getFullYear();
                    }

                    if (!totalFare[key]) totalFare[key] = 0;
                    totalFare[key] += fareAmount;
                }
            }

            // Tạo labels và amounts
            const labels = [];
            const amounts = [];

            if (option === 'ngày') {
                let currentDate = new Date(startDate);
                while (currentDate <= new Date(endDate)) {
                    const formattedDate = currentDate.toLocaleDateString('vi-VN');
                    labels.push(formattedDate);
                    amounts.push(totalFare[formattedDate] || 0);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
            } else if (option === 'tháng') {
                for (let month = 1; month <= 12; month++) {
                    labels.push(`tháng ${month}`);
                    amounts.push(totalFare[month] || 0);
                }
            } else if (option === 'năm') {
                for (let year = parseInt(startYearInput.value); year <= parseInt(endYearInput.value); year++) {
                    labels.push(`${year}`);
                    amounts.push(totalFare[year] || 0);
                }
            }

            // Cập nhật biểu đồ
            updateChart('myChart', labels, amounts);
        } else {
            console.log("No data available");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

async function fetchRequestData(startDate, endDate, option) {
    try {
        let queryRef = ref(db, 'All Ride Requests');
        const snapshot = await get(queryRef);

        if (snapshot.exists()) {
            const data = snapshot.val();
            const startTimestamp = startDate ? new Date(startDate).getTime() : null;
            const endTimestamp = endDate ? new Date(endDate).getTime() : null;

            // Khởi tạo bộ đếm
            const statusCounts = {
                waiting: 0,
                accepted: 0,
                arrived: 0,
                ended: 0,
                Failed: 0,
            };
            let totalRides = 0;

            // Lọc và đếm dữ liệu
            for (const id in data) {
                const ride = data[id];
                const rideTime = new Date(ride.time).getTime();

                if (
                    (option === 'ngày' && rideTime >= startTimestamp && rideTime <= endTimestamp) ||
                    (option === 'tháng' && new Date(ride.time).getFullYear() === parseInt(yearSelectionInput.value)) ||
                    (option === 'năm' && rideTime >= new Date(startYearInput.value, 0, 1).getTime() && 
                        rideTime <= new Date(endYearInput.value, 11, 31).getTime())
                ) {
                    totalRides++;
                    if (ride.status === "ended") statusCounts.ended++;
                    if (ride.status === "arrived") statusCounts.arrived++;
                    if (ride.status === "accepted") statusCounts.accepted++;
                    if (ride.driverId === "waiting") statusCounts.waiting++;
                    if (ride.status === "Failed") statusCounts.Failed++;
                }
            }

            // Tính phần trăm
            const percentages = Object.keys(statusCounts).map(key =>
                ((statusCounts[key] / totalRides) * 100).toFixed(1)
            );

            // Cập nhật biểu đồ
            updateChart('myChart2', null, percentages);

            // Cập nhật bảng HTML
            updateRequestTable(statusCounts, totalRides);
        }
    } catch (error) {
        console.error("Error fetching request data:", error);
    }
}



function updateChart(chartType, labels, data) {
    if (chartType === 'myChart') {
        myChart.data.labels = labels;
        myChart.data.datasets[0].data = data;
        myChart.update();
    } else if (chartType === 'myChart2') {
        myChart2.data.datasets[0].data = data;
        myChart2.update();
    }
}
function updateRequestTable(statusCounts, totalRides) {
    const tbody = document.querySelector('.requestTable tbody');
    const rows = tbody.querySelectorAll('tr');

    // Xóa chỉ các giá trị trong cột dữ liệu (cột thứ hai)
    rows.forEach(row => {
        const valueCell = row.querySelector('td:nth-child(2)');
        if (valueCell) {
            valueCell.remove();
        }
    });

    // Thêm giá trị mới vào cột dữ liệu
    rows[0].insertAdjacentHTML('beforeend', `<td class="SuccessNumber">${statusCounts.ended}</td>`); // Thành công
    rows[1].insertAdjacentHTML('beforeend', `<td class="ArrivedNumber">${statusCounts.arrived}</td>`); // Đã đến điểm hẹn
    rows[2].insertAdjacentHTML('beforeend', `<td class="AcceptedNumber">${statusCounts.accepted}</td>`); // Đã có tài xế
    rows[3].insertAdjacentHTML('beforeend', `<td class="WaitingNumber">${statusCounts.waiting}</td>`); // Chưa có tài xế
    rows[4].insertAdjacentHTML('beforeend', `<td class="FailedNumber">${statusCounts.Failed}</td>`); // Thất bại

    // Cập nhật dòng tổng số chuyến
    const totalRow = document.querySelector('.requestTable thead tr');
    const totalCell = totalRow.querySelector('td:nth-child(2)');
    if (totalCell) {
        totalCell.remove(); // Xóa giá trị cũ nếu tồn tại
    }
    totalRow.insertAdjacentHTML('beforeend', `<td><div class="TotalNumber"><h2>${totalRides}</h2></div></td>`);

    // Cập nhật chiều rộng của các tiêu đề
    const divs = tbody.querySelectorAll('div');
    const percentages = Object.keys(statusCounts).map(key =>
        ((statusCounts[key] / totalRides) * 100).toFixed(1)
    );

    divs[0].style.width = `calc(100% + 25px)`; // Thành công
    divs[1].style.width = `calc(100% + 25px)`; // Đã đến điểm hẹn
    divs[2].style.width = `calc(100% + 25px)`; // Đã có tài xế
    divs[3].style.width = `calc(100% + 25px)`; // Chưa có tài xế
    divs[4].style.width = `calc(100% + 25px)`; // Thất bại
}




async function fetchChart1Data(option, startDate, endDate) {
    try {
        const driverRef = ref(db, 'drivers');
        const userRef = ref(db, 'users');

        // Lấy dữ liệu từ "drivers" và "users"
        const [driverSnapshot, userSnapshot] = await Promise.all([
            get(driverRef),
            get(userRef)
        ]);

        const drivers = driverSnapshot.exists() ? driverSnapshot.val() : {};
        const users = userSnapshot.exists() ? userSnapshot.val() : {};

        // Biến lưu trữ kết quả
        const driverCounts = {};
        const userCounts = {};

        // Hàm lọc dữ liệu theo khoảng thời gian
        function countIdsByTime(data, option, startDate, endDate) {
            const counts = {};
            for (const id in data) {
                const timestamp = data[id]?.timestamp;
        
                // Bỏ qua nếu timestamp không tồn tại
                if (!timestamp) continue;
        
                const time = new Date(timestamp).getTime();
        
                // Kiểm tra điều kiện theo thời gian
                if (
                    (option === 'ngày' && time >= startDate && time <= endDate) ||
                    (option === 'tháng' && new Date(time).getFullYear() === startDate) ||
                    (option === 'năm' && time >= new Date(startDate, 0, 1).getTime() &&
                        time <= new Date(endDate, 11, 31).getTime())
                ) {
                    // Xác định key theo lựa chọn
                    const key = option === 'ngày' ? 
                        new Date(time).toLocaleDateString('vi-VN') :
                        option === 'tháng' ? 
                        new Date(time).getMonth() + 1 : 
                        new Date(time).getFullYear();
        
                    // Tính tổng số lượng
                    counts[key] = (counts[key] || 0) + 1;
                }
            }
            return counts;
        }

        // Lọc số lượng "id" trong mỗi thư mục
        Object.assign(driverCounts, countIdsByTime(drivers, option, startDate, endDate));
        Object.assign(userCounts, countIdsByTime(users, option, startDate, endDate));

        // Chuẩn bị labels và amounts cho biểu đồ
        const labels = [];
        let driverAmounts = [];
        let userAmounts = [];

        if (option === 'ngày') {
            let currentDate = new Date(startDate);
            while (currentDate <= new Date(endDate)) {
                const label = currentDate.toLocaleDateString('vi-VN');
                labels.push(label);
                driverAmounts.push(countActiveIdsByDate(drivers, currentDate));
                userAmounts.push(countActiveIdsByDate(users, currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        } else if (option === 'tháng') {
            for (let month = 1; month <= 12; month++) {
                labels.push(`tháng ${month}`);
                driverAmounts.push(countActiveIdsByMonth(drivers, month, startDate));
                userAmounts.push(countActiveIdsByMonth(users, month, startDate));
            }
        } else if (option === 'năm') {
            for (let year = parseInt(startDate); year <= parseInt(endDate); year++) {
                labels.push(`${year}`);
                driverAmounts.push(countActiveIdsByYear(drivers, year));
                userAmounts.push(countActiveIdsByYear(users, year));

            }
        }
        // Cập nhật biểu đồ
        updateChart1(labels, driverAmounts, userAmounts);
    } catch (error) {
        console.error("Error fetching Chart1 data:", error);
    }
}

function countActiveIdsByDate(data, currentDate) {
    let count = 0;
    const currentTimestamp = currentDate.getTime();
    for (const id in data) {
        const timestamp = data[id]?.timestamp;

        // Bỏ qua nếu không có timestamp
        if (!timestamp) continue;

        const itemDate = new Date(timestamp);
        if (itemDate.getTime() <= currentTimestamp) {
            count++; // Đếm nếu timestamp <= ngày hiện tại
        }
    }
    return count;
}

function countActiveIdsByMonth(data, month, year) {
    let count = 0;

    for (const id in data) {
        const timestamp = data[id]?.timestamp;

        // Bỏ qua nếu không có timestamp
        if (!timestamp) continue;

        const itemDate = new Date(timestamp);
        const itemYear = itemDate.getFullYear();
        const itemMonth = itemDate.getMonth() + 1; // getMonth() trả về giá trị từ 0 đến 11, cần cộng thêm 1

        // Kiểm tra nếu năm và tháng thoả mãn điều kiện
        if (itemYear === year && itemMonth <= month) {
            count++; // Đếm nếu năm <= năm hiện tại và tháng <= tháng hiện tại
        }
    }
    return count;
}

function countActiveIdsByYear(data, year) {
    let count = 0;
    for (const id in data) {
        const timestamp = data[id]?.timestamp;

        // Bỏ qua nếu không có timestamp
        if (!timestamp) continue;

        const itemDate = new Date(timestamp);
        if (itemDate.getFullYear() <= year) {
            count++; // Đếm nếu timestamp <= năm hiện tại
        }
    }
    return count;
}


function updateChart1(labels, driverAmounts, userAmounts) {
        myChart1.data.labels = labels;
        myChart1.data.datasets[0].data = userAmounts; // Dữ liệu cho người dùng
        myChart1.data.datasets[1].data = driverAmounts; // Dữ liệu cho tài xế
        myChart1.update();
    
}
