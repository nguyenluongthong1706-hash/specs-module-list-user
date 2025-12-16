const API = "https://jsonplaceholder.typicode.com/users";
let users = [];
let editingId = null;

async function loadUsers() {
    const res = await fetch(API);
    users = await res.json();
    render();
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
        name.value = user.name;
        username.value = user.username;
        email.value = user.email;
        city.value = user.address?.city || "";
        phone.value = user.phone;
        company.value = user.company?.name || "";
    } else {
        formTitle.innerText = "Thêm user";
        editingId = null;
        document.querySelectorAll("input").forEach(i => i.value = "");
    }
}

function closeForm() {
    modal.style.display = "none";
}

function saveUser() {
    if (editingId) {
        const u = users.find(x => x.id === editingId);
        u.name = name.value;
        u.username = username.value;
        u.email = email.value;
        u.phone = phone.value;
        u.address.city = city.value;
        u.company.name = company.value;
    } else {
        users.unshift({
        id: Date.now(),
        name: name.value,
        username: username.value,
        email: email.value,
        phone: phone.value,
        address: { city: city.value },
        company: { name: company.value }
        });
    }
    closeForm();
    render();
}

function editUser(id) {
    openForm(users.find(u => u.id === id));
}

function deleteUser(id) {
    if (confirm("Xoá user?")) {
        users = users.filter(u => u.id !== id);
        render();
    }
}

loadUsers();