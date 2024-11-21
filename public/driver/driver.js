import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const driverContainer = document.getElementById("driverContainer");
const modal = document.getElementById("driverDetailModal");
const closeModal = document.querySelector(".close");
const carDetailsToggle = document.getElementById("carDetailsToggle");
const tripHistoryToggle = document.getElementById("tripHistoryToggle");

const carDetails = document.getElementById("carDetails");
const tripHistory = document.getElementById("tripHistory");


closeModal.onclick = () => {
    modal.style.display = "none";
};

window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};

function truncateText(text, limit = 20) {
    if (text.length > limit) {
        // Lấy chuỗi rút gọn
        const truncatedText = text.slice(0, limit);
        
        // Tạo phần tử span để hiển thị nội dung
        const span = document.createElement("span");
        span.textContent = truncatedText;

        // Tạo dấu ba chấm
        const ellipsis = document.createElement("span");
        ellipsis.textContent = "...";
        ellipsis.classList.add("ellipsis");

        // Trạng thái đang hiển thị toàn bộ hay rút gọn
        let isExpanded = false;

        // Xử lý sự kiện nhấp vào dấu ba chấm
        ellipsis.addEventListener("click", () => {
            if (isExpanded) {
                ellipsis.textContent = "...";
                // Nếu đang mở rộng, rút gọn lại
                span.textContent = truncatedText;
                span.appendChild(ellipsis);
                isExpanded = false;
            } else {
                ellipsis.textContent = "<<<";
                // Nếu đang rút gọn, mở rộng ra
                span.textContent = text;
                span.appendChild(ellipsis);
                isExpanded = true;
            }
        });

        // Gắn dấu ba chấm vào span và trả về
        span.appendChild(ellipsis);
        return span;
    } else {
        return document.createTextNode(text);
    }
}

const driverRef = ref(database, 'drivers');
onValue(driverRef, (snapshot) => {
    driverContainer.innerHTML = "";
    snapshot.forEach((childSnapshot) => {
        const driverData = childSnapshot.val();
        const driverBox = document.createElement("div");
        driverBox.classList.add("box");
        driverBox.innerHTML = `
            <h2>${driverData.name || "Tên Tài Xế"}</h2>
            <p>ID: ${driverData.id || "N/A"}</p>
            <p>Email: ${driverData.email || "N/A"}</p>
            <p>Số điện thoại: ${driverData.phone || "N/A"}</p>
        `;

        driverBox.addEventListener("click", () => {
            document.getElementById("driverName").textContent = `Tên: ${driverData.name}`;
            document.getElementById("driverID").textContent = `ID: ${driverData.id}`;
            document.getElementById("driverEmail").textContent = `Email: ${driverData.email}`;
            document.getElementById("driverPhone").textContent = `Số điện thoại: ${driverData.phone}`;
            document.getElementById("driverAddress").textContent = `Địa chỉ: ${driverData.address}`;
            document.getElementById("driverRating").textContent = `Đánh giá: ${driverData.ratings || "Chưa có"}`;
            document.getElementById("driverEarning").textContent = `Thu nhập: ${driverData.earnings || "Chưa có"}`;
            document.getElementById("driverToken").textContent = "";
            document.getElementById("driverToken").appendChild(truncateText(`Mã Token: ${driverData.token || "Chưa có"}`, 20));

            // Cập nhật thông tin xe
            document.getElementById("carType").textContent = `${driverData.car_details?.type || "N/A"}`;
            document.getElementById("carModel").textContent = `${driverData.car_details?.car_model || "N/A"}`;
            document.getElementById("carColor").textContent = `${driverData.car_details?.car_color || "N/A"}`;
            document.getElementById("carNumber").textContent = `${driverData.car_details?.car_number || "N/A"}`;

            // Toggle trip history
            tripHistoryToggle.addEventListener("click", () => {
                // Kiểm tra xem phần tử tripHistory có đang mở hay không
                const isOpen = tripHistory.classList.contains("open");

                // Nếu đang mở, đóng lại và xóa nội dung cũ
                if (isOpen) {
                    modal.classList.remove("open")
                    tripHistory.classList.remove("open");
                    tripHistory.innerHTML = '';  // Xóa nội dung cũ khi đóng lại
                } else {
                    // Nếu đang đóng, mở ra và hiển thị grid list
                    modal.classList.add("open")
                    tripHistory.classList.add("open");
                    displayTripsAsGrid(driverData.tripsHistory);  // Hiển thị lại danh sách chuyến đi
                }
                // Xử lý icon mũi tên bên cạnh
                tripHistoryToggle.querySelector(".arrow").classList.toggle("open");
            });
            
            // Hiển thị các chuyến đi trong dạng flex (hàng)
            function displayTripsAsGrid(tripsHistory) {
                tripHistory.innerHTML = '';  // Xóa nội dung cũ
            
                // Hiển thị các chuyến đi với trạng thái Thành công/Thất bại
                for (const trip in tripsHistory) {
                    const isSuccess = tripsHistory[trip];  // Lấy giá trị boolean của từng chuyến đi
                    const status = isSuccess ? "Thành công" : "Thất bại";  // Xác định trạng thái
                    const statusClass = isSuccess ? "success" : "failure";  // Class để áp dụng màu
            
                    // Tạo phần tử div cho mỗi chuyến đi với trạng thái
                    const tripElement = document.createElement("div");
                    tripElement.classList.add("trip-item");
                    tripElement.innerHTML = `
                        <span>Chuyến: ${trip}</span>
                        <span class="${statusClass}">${status}</span>
                    `;
            
                    tripHistory.appendChild(tripElement);  // Thêm phần tử vào grid list
                }
            }
            



            modal.style.display = "block";
        });

        driverContainer.appendChild(driverBox);
    });
});



// Toggle car details
carDetailsToggle.addEventListener("click", () => {
    carDetails.classList.toggle("open");
    carDetailsToggle.querySelector(".arrow").classList.toggle("open");
});

const searchBar = document.querySelector(".search-bar");

// Lắng nghe sự kiện nhập từ khóa
searchBar.addEventListener("input", (event) => {
    const keyword = event.target.value.toLowerCase().trim();
    filterDrivers(keyword);
});

function filterDrivers(keyword) {
    const driverBoxes = document.querySelectorAll("#driverContainer .box");
    let hasResult = false;

    driverBoxes.forEach((box) => {
        const name = box.querySelector("h2").textContent.toLowerCase();
        const id = box.querySelector("p:nth-child(2)").textContent.toLowerCase();
        const email = box.querySelector("p:nth-child(3)").textContent.toLowerCase();

        if (name.includes(keyword) || id.includes(keyword) || email.includes(keyword)) {
            box.style.display = "block";
            hasResult = true;
        } else {
            box.style.display = "none";
        }
    });

    const noResultMessage = document.getElementById("noResultMessage");
    if (!hasResult) {
        if (!noResultMessage) {
            const message = document.createElement("p");
            message.id = "noResultMessage";
            message.textContent = "Không tìm thấy kết quả phù hợp.";
            message.style.textAlign = "center";
            message.style.color = "orange";
            driverContainer.appendChild(message);
        }
    } else {
        if (noResultMessage) noResultMessage.remove();
    }
}

