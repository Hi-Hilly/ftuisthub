import {
    auth, db,
    signInWithEmailAndPassword, signOut, onAuthStateChanged,
    collection, addDoc, deleteDoc, updateDoc, doc, onSnapshot
} from "./firebase.js";

// ── DATA ─────────────────────────────────────────
let beasiswaList = [];
let eventList    = [];

// ── AUTH ─────────────────────────────────────────
onAuthStateChanged(auth, user => {
    if (user) {
        document.getElementById("loginPage").style.display  = "none";
        document.getElementById("adminPanel").style.display = "block";
        document.getElementById("adminEmail").innerText     = user.email;
        startListeners();
    } else {
        document.getElementById("loginPage").style.display  = "flex";
        document.getElementById("adminPanel").style.display = "none";
    }
});

window.login = async function() {
    const email    = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showToast("Harap isi email dan password.", "error");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        const map = {
            "auth/wrong-password":     "Password salah.",
            "auth/user-not-found":     "Email tidak ditemukan.",
            "auth/invalid-email":      "Format email tidak valid.",
            "auth/invalid-credential": "Email atau password salah.",
            "auth/too-many-requests":  "Terlalu banyak percobaan. Coba lagi nanti.",
        };
        showToast(map[err.code] || "Login gagal.", "error");
    }
};

window.logout = async function() {
    await signOut(auth);
};

// ── FIRESTORE LISTENERS ──────────────────────────
function startListeners() {
    onSnapshot(collection(db, "beasiswa"), snapshot => {
        beasiswaList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderAdminBeasiswa();
    });

    onSnapshot(collection(db, "events"), snapshot => {
        eventList = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        renderAdminEvent();
    });
}

// ── IMAGE: read as base64 ────────────────────────
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload  = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

// ── ADD ──────────────────────────────────────────
window.addBeasiswa = async function() {
    const nama     = document.getElementById("bNama").value.trim();
    const deadline = document.getElementById("bDeadline").value;
    const desc     = document.getElementById("bDesc").value.trim();
    const file     = document.getElementById("bImage").files[0];

    if (!nama || !deadline || !desc) {
        showToast("Harap lengkapi semua data beasiswa.", "error");
        return;
    }

    showToast("Menyimpan beasiswa...");

    try {
        const image = file
            ? await readFileAsDataURL(file)
            : "https://via.placeholder.com/300";

        await addDoc(collection(db, "beasiswa"), { nama, deadline, desc, image });
        showToast("Beasiswa berhasil ditambahkan!");

        document.getElementById("bNama").value     = "";
        document.getElementById("bDeadline").value = "";
        document.getElementById("bDesc").value     = "";
        document.getElementById("bImage").value    = "";
    } catch (e) {
        showToast("Gagal menyimpan: " + e.message, "error");
    }
};

window.addEvent = async function() {
    const nama    = document.getElementById("eNama").value.trim();
    const tanggal = document.getElementById("eTanggal").value;
    const desc    = document.getElementById("eDesc").value.trim();
    const file    = document.getElementById("eImage").files[0];

    if (!nama || !tanggal || !desc) {
        showToast("Harap lengkapi semua data event.", "error");
        return;
    }

    showToast("Menyimpan event...");

    try {
        const image = file
            ? await readFileAsDataURL(file)
            : "https://via.placeholder.com/300";

        await addDoc(collection(db, "events"), { nama, tanggal, desc, image });
        showToast("Event berhasil ditambahkan!");

        document.getElementById("eNama").value    = "";
        document.getElementById("eTanggal").value = "";
        document.getElementById("eDesc").value    = "";
        document.getElementById("eImage").value   = "";
    } catch (e) {
        showToast("Gagal menyimpan: " + e.message, "error");
    }
};

// ── REMOVE ───────────────────────────────────────
window.removeBeasiswa = async function(id) {
    if (!confirm("Hapus beasiswa ini?")) return;
    await deleteDoc(doc(db, "beasiswa", id));
    showToast("Beasiswa dihapus.");
};

window.removeEvent = async function(id) {
    if (!confirm("Hapus event ini?")) return;
    await deleteDoc(doc(db, "events", id));
    showToast("Event dihapus.");
};

// ── EDIT ─────────────────────────────────────────
window.editBeasiswa = function(index) {
    const b = beasiswaList[index];
    document.getElementById("bNama").value     = b.nama;
    document.getElementById("bDeadline").value = b.deadline;
    document.getElementById("bDesc").value     = b.desc;

    const btn = document.getElementById("bAddBtn");
    btn.innerText = "Update";
    btn.onclick   = async () => {
        const nama     = document.getElementById("bNama").value.trim();
        const deadline = document.getElementById("bDeadline").value;
        const desc     = document.getElementById("bDesc").value.trim();
        const file     = document.getElementById("bImage").files[0];
        if (!nama || !deadline || !desc) { showToast("Harap lengkapi semua data.", "error"); return; }
        try {
            const image = file ? await readFileAsDataURL(file) : b.image;
            await updateDoc(doc(db, "beasiswa", b.id), { nama, deadline, desc, image });
            showToast("Beasiswa diperbarui!");
        } catch (e) { showToast("Gagal memperbarui.", "error"); }
        resetBeasiswaForm();
    };
    document.getElementById("bNama").focus();
};

window.editEvent = function(index) {
    const e = eventList[index];
    document.getElementById("eNama").value    = e.nama;
    document.getElementById("eTanggal").value = e.tanggal;
    document.getElementById("eDesc").value    = e.desc;

    const btn = document.getElementById("eAddBtn");
    btn.innerText = "Update";
    btn.onclick   = async () => {
        const nama    = document.getElementById("eNama").value.trim();
        const tanggal = document.getElementById("eTanggal").value;
        const desc    = document.getElementById("eDesc").value.trim();
        const file    = document.getElementById("eImage").files[0];
        if (!nama || !tanggal || !desc) { showToast("Harap lengkapi semua data.", "error"); return; }
        try {
            const image = file ? await readFileAsDataURL(file) : e.image;
            await updateDoc(doc(db, "events", e.id), { nama, tanggal, desc, image });
            showToast("Event diperbarui!");
        } catch (err) { showToast("Gagal memperbarui.", "error"); }
        resetEventForm();
    };
    document.getElementById("eNama").focus();
};

function resetBeasiswaForm() {
    const btn = document.getElementById("bAddBtn");
    btn.innerText = "Add";
    btn.onclick   = window.addBeasiswa;
    document.getElementById("bNama").value     = "";
    document.getElementById("bDeadline").value = "";
    document.getElementById("bDesc").value     = "";
    document.getElementById("bImage").value    = "";
}

function resetEventForm() {
    const btn = document.getElementById("eAddBtn");
    btn.innerText = "Add";
    btn.onclick   = window.addEvent;
    document.getElementById("eNama").value    = "";
    document.getElementById("eTanggal").value = "";
    document.getElementById("eDesc").value    = "";
    document.getElementById("eImage").value   = "";
}

// ── RENDER ───────────────────────────────────────
function renderAdminBeasiswa() {
    const container = document.getElementById("adminBeasiswa");
    container.innerHTML = "";
    beasiswaList.forEach((b, index) => {
        container.innerHTML += `
        <div class="card">
            <img src="${b.image || 'https://via.placeholder.com/300'}" alt="">
            <h3>${b.nama}</h3>
            <button class="btn" onclick="openModal('beasiswa', ${index})">Open</button>
            <button class="btn" onclick="editBeasiswa(${index})">Edit</button>
            <button class="btn btn-danger" onclick="removeBeasiswa('${b.id}')">Remove</button>
        </div>`;
    });
}

function renderAdminEvent() {
    const container = document.getElementById("adminEvent");
    container.innerHTML = "";
    eventList.forEach((e, index) => {
        container.innerHTML += `
        <div class="card">
            <img src="${e.image || 'https://via.placeholder.com/300'}" alt="">
            <h3>${e.nama}</h3>
            <button class="btn" onclick="openModal('event', ${index})">Open</button>
            <button class="btn" onclick="editEvent(${index})">Edit</button>
            <button class="btn btn-danger" onclick="removeEvent('${e.id}')">Remove</button>
        </div>`;
    });
}

// ── MODAL ────────────────────────────────────────
function formatText(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\r\n|\r|\n/g, "<br>");
}

window.openModal = function(type, index) {
    const title = document.getElementById("modal-title");
    const body  = document.getElementById("modal-body");

    if (type === "beasiswa") {
        const b = beasiswaList[index];
        title.innerText = b.nama;
        body.innerHTML  = `
            <img src="${b.image || 'https://via.placeholder.com/300'}" alt="" style="width:100%;border-radius:6px;margin-bottom:15px;">
            <b>Deadline:</b><br>${b.deadline}<br><br>
            <b>Deskripsi:</b><br>${formatText(b.desc)}`;
    }

    if (type === "event") {
        const e = eventList[index];
        title.innerText = e.nama;
        body.innerHTML  = `
            <img src="${e.image || 'https://via.placeholder.com/300'}" alt="" style="width:100%;border-radius:6px;margin-bottom:15px;">
            <b>Tanggal:</b><br>${e.tanggal}<br><br>
            <b>Deskripsi:</b><br>${formatText(e.desc)}`;
    }

    document.getElementById("modal").style.display = "flex";
};

window.closeModal = function() {
    document.getElementById("modal").style.display = "none";
};

// ── TOAST ────────────────────────────────────────
function showToast(msg, type = "success") {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    toast.innerText = msg;
    toast.className = `toast show${type === "error" ? " error" : ""}`;
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => { toast.className = "toast"; }, 3000);
}
