let beasiswaList =
JSON.parse(
localStorage.getItem("beasiswa")
) || [];

let eventList =
JSON.parse(
localStorage.getItem("event")
) || [];

function getSearchKeyword(){
    return document
        .getElementById("searchInput")
        .value
        .trim()
        .toLowerCase();
}

function getSortOrder(){
    return document
        .getElementById("sortSelect")
        .value;
}

function parseDateValue(value){
    const date = new Date(value);
    return isNaN(date) ? null : date;
}

function formatDateForDisplay(value){
    const date = parseDateValue(value);
    return date ? date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    }) : value;
}

function itemMatchesSearch(text){
    const keyword = getSearchKeyword();
    return keyword === "" || text.toLowerCase().includes(keyword);
}

function sortByDate(list, dateKey){
    const order = getSortOrder();
    if(order === "none"){
        return list;
    }

    return [...list].sort((a,b)=>{
        const dateA = parseDateValue(a[dateKey]);
        const dateB = parseDateValue(b[dateKey]);

        if(!dateA && !dateB) return 0;
        if(!dateA) return 1;
        if(!dateB) return -1;

        return order === "asc"
            ? dateA - dateB
            : dateB - dateA;
    });
}

function renderBeasiswa(){

    const container =
    document.getElementById(
        "beasiswaContainer"
    );

    const keyword = getSearchKeyword();
    const filtered = beasiswaList.filter(b=>{
        const text = `${b.nama} ${b.deadline}`;
        return itemMatchesSearch(text);
    });

    const sorted = sortByDate(filtered, "deadline");

    container.innerHTML = "";

    if(sorted.length === 0){
        container.innerHTML = `
            <div class="card">
                <p>Tidak ada beasiswa yang sesuai.</p>
            </div>
        `;
        return;
    }

    sorted.forEach((b,index)=>{

        container.innerHTML += `

        <div class="card">

            <img src="${b.image || 'https://via.placeholder.com/300'}" alt="">

            <h3>${b.nama}</h3>

            <p>
            Deadline:
            ${formatDateForDisplay(b.deadline)}
            </p>

            <button class="btn"
            onclick="openModal('beasiswa',${index})">
            Open
            </button>

        </div>
        `;
    });
}

function renderEvent(){

    const container =
    document.getElementById(
        "eventContainer"
    );

    const filtered = eventList.filter(e=>{
        const text = `${e.nama} ${e.tanggal}`;
        return itemMatchesSearch(text);
    });

    const sorted = sortByDate(filtered, "tanggal");

    container.innerHTML = "";

    if(sorted.length === 0){
        container.innerHTML = `
            <div class="card">
                <p>Tidak ada event yang sesuai.</p>
            </div>
        `;
        return;
    }

    sorted.forEach((e,index)=>{

        container.innerHTML += `

        <div class="card">

            <img src="${e.image || 'https://via.placeholder.com/300'}" alt="">

            <h3>${e.nama}</h3>

            <p>
            Tanggal:
            ${formatDateForDisplay(e.tanggal)}
            </p>

            <button class="btn"
            onclick="openModal('event',${index})">
            Open
            </button>

        </div>
        `;
    });
}

function formatText(text){
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\r\n|\r|\n/g, "<br>");
}

function openModal(type,index){

    const title =
    document.getElementById(
        "modal-title"
    );

    const body =
    document.getElementById(
        "modal-body"
    );

    if(type === "beasiswa"){

        let b = beasiswaList[index];

        title.innerText =
        b.nama;

        body.innerHTML = `
        <img src="${b.image || 'https://via.placeholder.com/300'}" alt="" style="width:100%; border-radius:6px; margin-bottom:15px;">
        <b>Deadline:</b><br>
        ${formatDateForDisplay(b.deadline)}<br><br>
        ${formatText(b.desc)}
        `;
    }

    if(type === "event"){

        let e = eventList[index];

        title.innerText =
        e.nama;

        body.innerHTML = `
        <img src="${e.image || 'https://via.placeholder.com/300'}" alt="" style="width:100%; border-radius:6px; margin-bottom:15px;">
        <b>Tanggal:</b><br>
        ${formatDateForDisplay(e.tanggal)}<br><br>
        ${formatText(e.desc)}
        `;
    }

    document.getElementById(
        "modal"
    ).style.display = "flex";
}

function closeModal(){

    document.getElementById(
        "modal"
    ).style.display = "none";
}

function openLink(url){

    window.open(url,"_blank");
}

function renderAll(){
    renderBeasiswa();
    renderEvent();
}

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

searchInput?.addEventListener("input", renderAll);
sortSelect?.addEventListener("change", renderAll);

renderAll();