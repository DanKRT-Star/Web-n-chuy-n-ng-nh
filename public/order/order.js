import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc,  updateDoc, setDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBYZ3VzpzdWWshQVVWzBb4LFx8CiPjTW3s",
    authDomain: "login-register-firebase-d2cd3.firebaseapp.com",
    projectId: "login-register-firebase-d2cd3", 
    storageBucket: "login-register-firebase-d2cd3.appspot.com",
    messagingSenderId: "744521823113",
    appId: "1:744521823113:web:90e29139b22aa321a0e758"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Kết nối Firestore
const db = getFirestore(app);

//kết nối với Storage
const storage = getStorage(app);

const addProductButton = document.querySelector(".addProductButton");
addProductButton.addEventListener('click', () => {
    openProductModal(false, {}); // Tham số false là để mở modal thêm mới, và {} là đối tượng trống (chưa có sản phẩm)
});

async function fetchAllDocuments() {
    const querySnapshot = await getDocs(collection(db, "products"));
    const data = [];
    querySnapshot.forEach((doc) => {
        const productData = doc.data();
        data.push(productData)
    });

    updateTable(data);
}

async function updateTable(data) {
    try {
        const productTable = document.getElementById("productTable").getElementsByTagName("tbody")[0];
        productTable.innerHTML = ""; // Xóa dữ liệu cũ trong bảng
        let index = 1;

        data.forEach((productData) => {
        const row = productTable.insertRow();
        row.insertCell(0).textContent = index++;
        row.insertCell(1).appendChild(createImgDiv(productData.image, "ProductImage", "Image"));
        row.insertCell(2).appendChild(createNestedDiv(productData.name,"ID: " + productData.id, productData.description, "giá: " + productData.price));
        row.insertCell(3).appendChild(create2ButtonDiv("Button", productData))

        row.style.animationDelay = `${index * 0.1}s`;
    });
    addDeleteEventListeners(data);
    }catch (error) {
        console.error("Error fetching products:", error);
    }
    

}

function createImgDiv(content, className, label) {
    const div = document.createElement("div");
    div.className = className;
    if (label === "Image" && content) {
        // Nếu nội dung là hình ảnh, tạo thẻ <img>
        const img = document.createElement("img");
        img.src = content; // Gán URL vào src
        img.alt = "Product Image"; // Văn bản thay thế
        img.style.width = "100px"; // Tùy chỉnh kích thước (có thể thay đổi)
        img.style.height = "auto";
        div.appendChild(img); // Thêm hình ảnh vào div
    } else {
        // Hiển thị nội dung dạng văn bản
        div.textContent = `${label}: ${content || "N/A"}`;
    }

    return div;
}

// Sửa lại phần tạo button trong hàm updateTable
function create2ButtonDiv(parentClass, productData) {
    const div = document.createElement('div');
    div.classList = parentClass;
    div.style.display = "flex";

    const settingButton = document.createElement('button');
    settingButton.classList.add("settingButton");
    const iconsetting = document.createElement('i');
    iconsetting.classList.add("bx", "bxs-cog", "icon");
    settingButton.appendChild(iconsetting);

    const deleteButton = document.createElement('button');
    deleteButton.classList.add("deleteButton");
    const icondelete = document.createElement('i');
    icondelete.classList.add("bx", "bxs-trash", "icon");
    deleteButton.appendChild(icondelete);

    // Thêm sự kiện cho nút settingButton để mở modal chỉnh sửa
    settingButton.addEventListener('click', () => {
        openProductModal(true, productData); // Mở modal chỉnh sửa sản phẩm
    });

    // Thêm các button vào div
    div.appendChild(settingButton);
    div.appendChild(deleteButton);

    return div;
}


function openProductModal(isEdit, productData) {
    // Tạo container cho modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
   

    // Tiêu đề modal
    const title = document.createElement('h2');
    title.textContent = isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới';

    // Trường hình ảnh
    const imagecontent = document.createElement('div');
    imagecontent.classList.add("imagecontent");
    const inputimgside = document.createElement('div');
    inputimgside.classList.add("inputimgside");
    const imageLabel = document.createElement('label');
    imageLabel.textContent = 'Hình ảnh:';
    imageLabel.style.color = '#ff9900'
    imageLabel.style.fontWeight = 'bold'
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';

    const imagePreview = document.createElement('img');
    imagePreview.style.maxWidth = '200px';
    imagePreview.style.maxHeight = '200px';

    // Nếu là chế độ chỉnh sửa, hiển thị ảnh hiện tại
    if (isEdit && productData.image) {
        imagePreview.src = productData.image;
    }

    imageInput.onchange = function() {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result || '';
            };
            reader.readAsDataURL(file);
        }
    };

    // Các trường thông tin sản phẩm
    const namefield = document.createElement('div');
    namefield.classList.add("namefield");
    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Tên sản phẩm:';
    nameLabel.classList.add("nameLabel")
    const nameInput = document.createElement('input');
    nameInput.classList.add("nameInput")
    nameInput.type = 'text';
    nameInput.placeholder = 'Nhập tên sản phẩm';
    if (isEdit) nameInput.value = productData.name;

    const idfield = document.createElement('div');
    idfield.classList.add("idfield");
    const idLabel = document.createElement('label');
    idLabel.classList.add("idLabel");
    idLabel.textContent = 'ID sản phẩm:';
    const idInput = document.createElement('input');
    idInput.classList.add("idInput")
    idInput.type = 'text';
    idInput.placeholder = 'Nhập ID sản phẩm';
    if (isEdit) idInput.value = productData.id;

    const descriptionfield = document.createElement('div');
    descriptionfield.classList.add("descriptionfield");
    const descriptionLabel = document.createElement('label');
    descriptionLabel.classList.add("descriptionLabel");
    descriptionLabel.textContent = 'Mô tả:';
    const descriptionInput = document.createElement('textarea');
    descriptionInput.classList.add("descriptionInput");
    descriptionInput.placeholder = 'Nhập mô tả sản phẩm';
    if (isEdit) descriptionInput.value = productData.description;

    const pricefield = document.createElement('div');
    pricefield.classList.add("pricefield");
    const priceLabel = document.createElement('label');
    priceLabel.classList.add("priceLabel");
    priceLabel.textContent = 'Giá:';
    const priceInput = document.createElement('input');
    priceInput.classList.add("priceInput")
    priceInput.type = 'number';
    priceInput.placeholder = 'Nhập giá sản phẩm';
    if (isEdit) priceInput.value = productData.price;

    const Button2 = document.createElement('div');
    Button2.classList.add("buttonfield")
    // Nút đóng
    const closeButton = document.createElement('button');
    closeButton.classList.add("closeButton");
    closeButton.textContent = 'Đóng';
    closeButton.onclick = () => {
        document.body.removeChild(modalOverlay);
    };
    // Nút lưu
    const saveButton = document.createElement('button');
    saveButton.classList.add("saveButton");
    saveButton.textContent = 'Lưu';
    saveButton.onclick = async () => {
        const newProductData = {
            image: imagePreview.src || '',
            name: nameInput.value,
            id: idInput.value,
            description: descriptionInput.value,
            price: priceInput.value
        };

        if (isEdit) {
            // Cập nhật thông tin sản phẩm nếu đang chỉnh sửa
            await updateProductInFirestore(productData.id, newProductData);
        } else {
            // Thêm sản phẩm mới nếu là trạng thái thêm
            await addProductToFirestore(newProductData);
        }
        document.body.removeChild(modalOverlay); // Đóng modal
    };

    // Thêm các phần tử vào modal content
    modalContent.appendChild(title);

    modalContent.appendChild(imagecontent);
    imagecontent.appendChild(imagePreview);
    imagecontent.appendChild(inputimgside);
    inputimgside.appendChild(imageLabel);
    inputimgside.appendChild(imageInput);

    modalContent.appendChild(namefield);
    namefield.appendChild(nameLabel);
    namefield.appendChild(nameInput);

    modalContent.appendChild(idfield)
    idfield.appendChild(idLabel);
    idfield.appendChild(idInput);

    modalContent.appendChild(descriptionfield)
    descriptionfield.appendChild(descriptionLabel);
    descriptionfield.appendChild(descriptionInput);
    
    modalContent.appendChild(pricefield);
    pricefield.appendChild(priceLabel);
    pricefield.appendChild(priceInput);

    modalContent.appendChild(Button2);
    Button2.appendChild(closeButton);
    Button2.appendChild(saveButton);

    // Thêm modal content vào modal overlay
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
}

// Hàm tải hình ảnh lên Storage
async function uploadImageToStorage(file, productId) {
    try {
        const imagePath = `image/${productId}/${file.name}`;
        const imageRef = ref(storage, imagePath);

        // Tải file lên Firebase Storage
        await uploadBytes(imageRef, file);

        // Lấy URL tải xuống
        const url = await getDownloadURL(imageRef);
        return url; // Trả về URL của ảnh
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
}

// Hàm xóa thư mục chứa hình ảnh
async function deleteProductImages(productId) {
    try {
        const folderRef = ref(storage, `image/${productId}`);
        const list = await listAll(folderRef);

        // Xóa từng tệp trong thư mục
        for (const itemRef of list.items) {
            await deleteObject(itemRef);
        }
        console.log(`Deleted all images for product: ${productId}`);
    } catch (error) {
        console.error(`Error deleting images for product ${productId}:`, error);
    }
}

// Thêm sản phẩm mới vào Firestore

async function addProductToFirestore(productData) {
    try {
        if (!productData.id) {
            alert("ID sản phẩm không được để trống!");
            return;
        }

        // Kiểm tra file hình ảnh
        const file = document.querySelector('input[type="file"]').files[0];
        if (file) {
            const imageUrl = await uploadImageToStorage(file, productData.id);
            productData.image = imageUrl; // Gán URL ảnh vào productData
        }

        // Lưu dữ liệu sản phẩm vào Firestore
        const docRef = doc(db, "products", productData.id);
        await setDoc(docRef, productData);
        console.log("Product added with ID:", productData.id);
    } catch (error) {
        console.error("Error adding product:", error);
    }
}


// Cập nhật sản phẩm trong Firestore
async function updateProductInFirestore(productId, productData) {
    try {
        const file = document.querySelector('input[type="file"]').files[0];
        if (file) {
            // Xóa hình ảnh cũ nếu tồn tại
            if (productData.image) {
                const oldImageRef = ref(storage, productData.image.replace("https://firebasestorage.googleapis.com/v0/b/", ""));
                await deleteObject(oldImageRef).catch((error) => {
                    console.warn("Error deleting old image (if exists):", error);
                });
            }

            const newImageUrl = await uploadImageToStorage(file, productId);
            productData.image = newImageUrl; // Cập nhật URL ảnh mới
        }

        const docRef = doc(db, "products", productId);
        await updateDoc(docRef, productData);
        console.log("Product updated with ID:", productId);
    } catch (error) {
        console.error("Error updating product:", error);
    }
}

function openDeleteConfirmationModal(productId) {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modalconfirm-content');


    // Nội dung modal
    const message = document.createElement('p');
    message.textContent = 'Bạn có chắc chắn muốn xoá sản phẩm này?';

    const confirmButton = document.createElement('button');
    confirmButton.classList.add("confirmButton");
    confirmButton.textContent = 'Xác nhận';
    confirmButton.style.marginRight = '10px';
    confirmButton.onclick = async () => {
        await deleteProductFromFirestore(productId);
        document.body.removeChild(modalOverlay); // Đóng modal
    };

    const cancelButton = document.createElement('button');
    cancelButton.classList.add("cancelButton");
    cancelButton.textContent = 'Hủy bỏ';
    cancelButton.onclick = () => {
        document.body.removeChild(modalOverlay); // Đóng modal
    };

    modalContent.appendChild(message);
    modalContent.appendChild(confirmButton);
    modalContent.appendChild(cancelButton);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
}


function createNestedDiv(content1, content2, content3, content4, parentClass) {
    const parentDiv = document.createElement('div');
    parentDiv.classList.add(parentClass); // Add class to parent div
  
    // Create two child divs
    const childDiv1 = document.createElement('div');
    childDiv1.textContent = content1;
    childDiv1.classList.add('Name'); // Class for the name div
  
    const childDiv2 = document.createElement('div');
    childDiv2.textContent = content2;
    childDiv2.classList.add('ID'); // Class for the phone div
  
    const childDiv3 = document.createElement('div');
    childDiv3.textContent = content3;
    childDiv3.classList.add('Description');

    const childDiv4 = document.createElement('div');
    childDiv4.textContent = content4;
    childDiv4.classList.add('Price')

    // Append child divs to the parent div
    parentDiv.appendChild(childDiv1);
    parentDiv.appendChild(childDiv2);
    parentDiv.appendChild(childDiv3);
    parentDiv.appendChild(childDiv4);
    return parentDiv;
  }

 // Hàm xóa sản phẩm
async function deleteProductFromFirestore(productId) {
    try {
        // Xóa document trong Firestore
        const docRef = doc(db, "products", productId);
        await deleteDoc(docRef);

        // Xóa thư mục hình ảnh trong Storage
        await deleteProductImages(productId);

        console.log("Product deleted with ID:", productId);
        fetchAllDocuments(); // Cập nhật lại bảng
    } catch (e) {
        console.error("Error deleting document:", e);
    }
}

function addDeleteEventListeners(data) {
    const deleteButtons = document.querySelectorAll(".deleteButton");
    deleteButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            const productId = data[index].id; // Lấy ID của sản phẩm tương ứng
            openDeleteConfirmationModal(productId);
        });
    });
}

// Lấy thanh tìm kiếm 
const searchBar = document.querySelector('.search-bar');
// Hàm tìm kiếm 
function searchTable() {
    const table = document.getElementById('productTable');
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




window.onload = fetchAllDocuments