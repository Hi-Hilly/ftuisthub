const SUPABASE_URL = 'https://pwdiqckmrpvjwtbstiqx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZGlxY2ttcnB2and0YnN0aXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MjIwMzMsImV4cCI6MjA5NDM5ODAzM30.fB03S2qdvpwc9qPuwTgydXbUvRPb_QsnCdOic7ioizE';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// Password admin
const ADMIN_PASSWORD = "adminftuisthub";

// Data
let beasiswaList = [];
let eventList = [];

// LOGIN
function login() {
    let password = document.getElementById("password").value;

    if (password === ADMIN_PASSWORD) {
        document.getElementById("loginPage").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";

        fetchAdminData();
    } else {
        alert("Password salah");
    }
}

// FETCH DATA
async function fetchAdminData() {
    const { data: beasiswa } = await db
        .from('beasiswa')
        .select('*')
        .order('deadline');

    const { data: events } = await db
        .from('events')
        .select('*')
        .order('tanggal');

    beasiswaList = beasiswa || [];
    eventList = events || [];

    renderAdminBeasiswa();
    renderAdminEvent();
}

// UPLOAD GAMBAR
async function uploadGambar(file, prefix) {
    if (!file) return null;

    const fileName = `${prefix}_${Date.now()}_${file.name}`;

    const { error } = await db.storage
        .from('images')
        .upload(fileName, file);

    if (error) {
        console.warn('Gagal upload gambar:', error.message);
        return null;
    }

    const { data } = db.storage
        .from('images')
        .getPublicUrl(fileName);

    return data.publicUrl;
}

function formatText(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\r\n|\r|\n/g, "<br>");
}

// ADD BEASISWA
async function addBeasiswa() {
    const file = document.getElementById("bImage").files[0];
    const nama = document.getElementById("bNama").value.trim();
    const deadline = document.getElementById("bDeadline").value;
    const deskripsi = document.getElementById("bDesc").value.trim();

    if (!nama || !deadline || !deskripsi) {
        alert("Harap lengkapi semua data beasiswa.");
        return;
    }

    let image_url = await uploadGambar(file, 'beasiswa');

    if (!image_url) {
        image_url = 'https://via.placeholder.com/300';
    }

    const { error } = await db
        .from('beasiswa')
        .insert({
            nama,
            deadline,
            deskripsi,
            image_url
        });

    if (error) {
        alert("Gagal menyimpan beasiswa: " + error.message);
        return;
    }

    document.getElementById("bNama").value = "";
    document.getElementById("bDeadline").value = "";
    document.getElementById("bDesc").value = "";
    document.getElementById("bImage").value = "";

    fetchAdminData();
}

// ADD EVENT
async function addEvent() {
    const file = document.getElementById("eImage").files[0];
    const nama = document.getElementById("eNama").value.trim();
    const tanggal = document.getElementById("eTanggal").value;
    const deskripsi = document.getElementById("eDesc").value.trim();

    if (!nama || !tanggal || !deskripsi) {
        alert("Harap lengkapi semua data event.");
        return;
    }

    let image_url = await uploadGambar(file, 'event');

    if (!image_url) {
        image_url = 'https://via.placeholder.com/300';
    }

    const { error } = await db
        .from('events')
        .insert({
            nama,
            tanggal,
            deskripsi,
            image_url
        });

    if (error) {
        alert("Gagal menyimpan event: " + error.message);
        return;
    }

    document.getElementById("eNama").value = "";
    document.getElementById("eTanggal").value = "";
    document.getElementById("eDesc").value = "";
    document.getElementById("eImage").value = "";

    fetchAdminData();
}

// RENDER ADMIN
function renderAdminBeasiswa() {
    const container = document.getElementById("adminBeasiswa");
    container.innerHTML = "";

    beasiswaList.forEach((b, index) => {
        container.innerHTML += `
        <div class="card">
            <img src="${b.image_url}" alt="">
            <h3>${b.nama}</h3>
            <button class="btn" onclick="openModal('beasiswa', ${index})">Open</button>
            <button class="btn" onclick="editBeasiswa(${index})">Edit</button>
            <button class="btn" onclick="removeBeasiswa(${index})">Remove</button>
        </div>
        `;
    });
}

function renderAdminEvent() {
    const container = document.getElementById("adminEvent");
    container.innerHTML = "";

    eventList.forEach((e, index) => {
        container.innerHTML += `
        <div class="card">
            <img src="${e.image_url}" alt="">
            <h3>${e.nama}</h3>
            <button class="btn" onclick="openModal('event', ${index})">Open</button>
            <button class="btn" onclick="editEvent(${index})">Edit</button>
            <button class="btn" onclick="removeEvent(${index})">Remove</button>
        </div>
        `;
    });
}

// REMOVE
async function removeBeasiswa(index) {
    const id = beasiswaList[index].id;

    await db
        .from('beasiswa')
        .delete()
        .eq('id', id);

    fetchAdminData();
}

async function removeEvent(index) {
    const id = eventList[index].id;

    await db
        .from('events')
        .delete()
        .eq('id', id);

    fetchAdminData();
}

// EDIT
async function editBeasiswa(index) {
    let b = beasiswaList[index];

    document.getElementById("bNama").value = b.nama;
    document.getElementById("bDeadline").value = b.deadline;
    document.getElementById("bDesc").value = b.deskripsi;

    document.getElementById("bNama").focus();

    await db
        .from('beasiswa')
        .delete()
        .eq('id', b.id);

    fetchAdminData();
}

async function editEvent(index) {
    let e = eventList[index];

    document.getElementById("eNama").value = e.nama;
    document.getElementById("eTanggal").value = e.tanggal;
    document.getElementById("eDesc").value = e.deskripsi;

    document.getElementById("eNama").focus();

    await db
        .from('events')
        .delete()
        .eq('id', e.id);

    fetchAdminData();
}

// MODAL
function openModal(type, index) {
    const title = document.getElementById("modal-title");
    const body = document.getElementById("modal-body");

    if (type === "beasiswa") {
        let b = beasiswaList[index];

        title.innerText = b.nama;

        body.innerHTML = `
        <img src="${b.image_url || 'https://via.placeholder.com/300'}"
        alt=""
        style="width:100%; border-radius:6px; margin-bottom:15px;">

        <b>Deadline:</b><br>
        ${b.deadline}<br><br>

        <b>Deskripsi:</b><br>
        ${formatText(b.deskripsi || '')}
        `;
    }

    if (type === "event") {
        let e = eventList[index];

        title.innerText = e.nama;

        body.innerHTML = `
        <img src="${e.image_url || 'https://via.placeholder.com/300'}"
        alt=""
        style="width:100%; border-radius:6px; margin-bottom:15px;">

        <b>Tanggal:</b><br>
        ${e.tanggal}<br><br>

        <b>Deskripsi:</b><br>
        ${formatText(e.deskripsi || '')}
        `;
    }

    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}