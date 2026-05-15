const SUPABASE_URL = 'https://pwdiqckmrpvjwtbstiqx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3ZGlxY2ttcnB2and0YnN0aXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MjIwMzMsImV4cCI6MjA5NDM5ODAzM30.fB03S2qdvpwc9qPuwTgydXbUvRPb_QsnCdOic7ioizE';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

let beasiswaList = [];
let eventList = [];

async function fetchAllData() {
    const { data: beasiswa } = await db
        .from('beasiswa')
        .select('*');

    const { data: events } = await db
        .from('events')
        .select('*');

    beasiswaList = beasiswa || [];
    eventList = events || [];

    renderAll();
}

function formatDateForDisplay(value) {
    const date = new Date(value);

    return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });
}

function renderBeasiswa() {
    const container = document.getElementById("beasiswaContainer");
    container.innerHTML = "";

    beasiswaList.forEach((b, index) => {
        container.innerHTML += `
        <div class="card">
            <img src="${b.image_url || 'https://via.placeholder.com/300'}" alt="">
            <h3>${b.nama}</h3>
            <p>Deadline: ${formatDateForDisplay(b.deadline)}</p>
            <button class="btn" onclick="openModal('beasiswa', ${index})">Open</button>
        </div>
        `;
    });
}

function renderEvent() {
    const container = document.getElementById("eventContainer");
    container.innerHTML = "";

    eventList.forEach((e, index) => {
        container.innerHTML += `
        <div class="card">
            <img src="${e.image_url || 'https://via.placeholder.com/300'}" alt="">
            <h3>${e.nama}</h3>
            <p>Tanggal: ${formatDateForDisplay(e.tanggal)}</p>
            <button class="btn" onclick="openModal('event', ${index})">Open</button>
        </div>
        `;
    });
}

function formatText(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\r\n|\r|\n/g, "<br>");
}

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
        ${formatDateForDisplay(b.deadline)}<br><br>

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
        ${formatDateForDisplay(e.tanggal)}<br><br>

        ${formatText(e.deskripsi || '')}
        `;
    }

    document.getElementById("modal").style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

function openLink(url) {
    window.open(url, "_blank");
}

function renderAll() {
    renderBeasiswa();
    renderEvent();
}

fetchAllData();