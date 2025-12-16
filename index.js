// https://69411bf0686bc3ca8165a6ec.mockapi.io/users
// https://jsonplaceholder.typicode.com/users
const API = "https://69411bf0686bc3ca8165a6ec.mockapi.io/users";
let users = [];
let editingId = null;

const tableBody   = document.getElementById("tableBody");
const cardList    = document.getElementById("cardList");
const modal       = document.getElementById("modal");
const formTitle   = document.getElementById("formTitle");

const nameUser    = document.getElementById("nameUser");
const username    = document.getElementById("username");
const email       = document.getElementById("email");
const phone       = document.getElementById("phone");
const website     = document.getElementById("website");

const street      = document.getElementById("street");
const suite       = document.getElementById("suite");
const city        = document.getElementById("city");
const zipcode     = document.getElementById("zipcode");
const geoLat      = document.getElementById("geoLat");
const geoLng      = document.getElementById("geoLng");

const nameCompany = document.getElementById("nameCompany");
const catchPhrase = document.getElementById("catchPhrase");
const bs          = document.getElementById("bs");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
const urlRegex = /^https?:\/\/[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+[^\s]*$/;

function isEmpty(value) {
    return !value || !value.trim();
}

function isNumber(value) {
    return !isNaN(value) && value !== '';
}

function validateUserForm() {
    if (isEmpty(nameUser.value))
        return "Tên là bắt buộc";

    if (isEmpty(username.value))
        return "Username là bắt buộc";

    if (username.value.length < 3)
        return "Username phải từ 3 ký tự trở lên";

    if (email.value && !emailRegex.test(email.value))
        return "Email không đúng định dạng";

    if (phone.value && !phoneRegex.test(phone.value))
        return "Số điện thoại không đúng định dạng";

    if (website.value && !urlRegex.test(website.value))
        return "Website không đúng định dạng (http/https)";

    if (zipcode.value && zipcode.value.length < 4)
        return "Zipcode không hợp lệ";

    if (geoLat.value && !isNumber(geoLat.value))
        return "Latitude phải là số";

    if (geoLng.value && !isNumber(geoLng.value))
        return "Longitude phải là số";

    if (nameCompany.value && nameCompany.value.length < 2)
        return "Tên công ty quá ngắn";

    return "";
}

async function loadUsers() {
    try {
        const res = await fetch(API);
        users = await res.json();
        render();
    } catch (err) {
        alert(`Tải danh sách user thất bại! Lỗi: ${err.message}`);
    }
}

async function addUserAPI(user) {
    const res = await fetch(API, {
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    return await res.json();
}

async function updateUserAPI(user,id) {
    const res = await fetch(`${API}/${id}`, {
        method:"PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    });
    return await res.json();
}

async function deleteUserAPI(id) {
    const res = await fetch(`${API}/${id}`, {
        method:"DELETE",
    });
    return await res.json();
}

function render() {
    renderTable();
    renderCards();
}

function renderTable() {
    tableBody.innerHTML = users.map(u => `
        <tr>
        <td>${u.id}</td>
        <td>${u.name}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>${u.address?.city || ""}</td>
        <td>${u.phone}</td>
        <td>${u.company?.name || ""}</td>
        <td>
            <button onclick="editUser(${u.id})">✏</button>
            <button class="danger" onclick="deleteUser(${u.id})">🗑</button>
        </td>
        </tr>
    `).join("");
}

function renderCards() {
    cardList.innerHTML = users.map(u => `
        <div class="card">
        <h3>${u.name}</h3>
        <p>@${u.username}</p>
        <p>${u.email}</p>
        <p>${u.address?.city || ""}</p>
        <div class="actions">
            <button onclick="editUser(${u.id})">✏</button>
            <button class="danger" onclick="deleteUser(${u.id})">🗑</button>
        </div>
        </div>
    `).join("");
}

function openForm(user = null) {
    modal.style.display = "flex";
    if (user) {
        formTitle.innerText = "Cập nhật user";
        editingId = user.id;
        nameUser.value = user.name;
        username.value = user.username;
        email.value = user.email;
        website.value = user.website || "";
        street.value = user.address?.street || "";
        suite.value = user.address?.suite || "";
        city.value = user.address?.city || "";
        zipcode.value = user.address?.zipcode || "";
        geoLat.value = user.address?.geo?.lat || "";
        geoLng.value = user.address?.geo?.lng || "";
        phone.value = user.phone;
        nameCompany.value = user.company?.name || "";
        catchPhrase.value = user.company?.catchPhrase || "";
        bs.value = user.company?.bs || "";
    } else {
        formTitle.innerText = "Thêm user";
        editingId = null;
        document.querySelectorAll("input").forEach(i => i.value = "");
    }
}

function closeForm() {
    modal.style.display = "none";
    editingId = null;
}

async function saveUser() {
    const error = validateUserForm();
    if (error) {
        alert(error);
        return;
    }

    const existUsername = users.find(u => u.username === username.value && u.id != editingId);
    if (existUsername) {
        alert("Username đã tồn tại, vui lòng chọn username khác");
        return;
    }
    
    if (editingId) {
        const u = users.find(x => x.id == editingId);
        u.name = nameUser.value;
        u.username = username.value;
        u.email = email.value;
        u.phone = phone.value;
        u.website = website.value;
        u.address.street = street.value;
        u.address.suite = suite.value;
        u.address.city = city.value;
        u.address.zipcode = zipcode.value;
        u.address.geo.lat = geoLat.value;
        u.address.geo.lng = geoLng.value;
        u.company.name = nameCompany.value;
        u.company.catchPhrase = catchPhrase.value;
        u.company.bs = bs.value;
        try{
            const updated = await updateUserAPI(u, editingId);
            users = users.map(user =>
                user.id == editingId ? updated : user
            );
            alert("Cập nhật user thành công!");
        }catch (err){
            alert(`Cập nhật user thất bại! Lỗi: ${err.message}`);
        }
        
    } else {
        const newUser = {
            name: nameUser.value,
            username: username.value,
            email: email.value,
            phone: phone.value,
            website: website.value,
            address: { 
                street: street.value,
                suite: suite.value,
                city: city.value,
                zipcode: zipcode.value,
                geo: { 
                    lat: geoLat.value, 
                    lng: geoLng.value }
            },
            company: {
                name: nameCompany.value,
                catchPhrase: catchPhrase.value,
                bs: bs.value
            }  
        };
        try{
            const createdUser = await addUserAPI(newUser);
            users.push(createdUser);
            alert("Thêm user thành công!");
        }catch (err){
            alert(`Thêm user thất bại! Lỗi: ${err.message}`);
        }
    }
    closeForm();
    render();
}

function editUser(id) {
    const user = users.find(u => u.id == id);
    console.log(users);
    if (!user) return alert("User không tồn tại");
    openForm(user);
}

async function deleteUser(id) {
    if (confirm("Bạn có chắc chắn muốn xóa user này?")) {
        try{
            await deleteUserAPI(id);
            users = users.filter(u => u.id != id);
            render();
            alert("Xóa user thành công!");
        }catch (err){
            alert(`Xóa user thất bại! Lỗi: ${err.message}`);
        }
    }
}
loadUsers();