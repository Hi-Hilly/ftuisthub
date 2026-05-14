const ADMIN_PASSWORD =
"adminftuisthub";

function login(){

    let password =
    document.getElementById(
        "password"
    ).value;

    if(password === ADMIN_PASSWORD){

        document.getElementById(
            "loginPage"
        ).style.display = "none";

        document.getElementById(
            "adminPanel"
        ).style.display = "block";

        renderAdminBeasiswa();

        renderAdminEvent();

    }else{

        alert("Password salah");
    }
}

let beasiswaList =
JSON.parse(
localStorage.getItem("beasiswa")
) || [];

let eventList =
JSON.parse(
localStorage.getItem("event")
) || [];

function saveData(){

    localStorage.setItem(
        "beasiswa",
        JSON.stringify(beasiswaList)
    );

    localStorage.setItem(
        "event",
        JSON.stringify(eventList)
    );
}

function readFileAsDataURL(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function formatText(text){
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\r\n|\r|\n/g, "<br>");
}

/* ADD */
function addBeasiswa(){

    const file =
        document.getElementById(
            "bImage"
        ).files[0];

    const nama = document.getElementById("bNama").value.trim();
    const deadline = document.getElementById("bDeadline").value;
    const desc = document.getElementById("bDesc").value.trim();

    if(!nama || !deadline || !desc){
        alert("Harap lengkapi semua data beasiswa.");
        return;
    }

    const imagePromise = file
        ? readFileAsDataURL(file)
        : Promise.resolve("https://via.placeholder.com/300");

    imagePromise.then(image => {
        beasiswaList.push({
            nama: nama,
            deadline: deadline,
            desc: desc,
            image: image
        });

        saveData();

        renderAdminBeasiswa();

        document.getElementById("bNama").value = "";
        document.getElementById("bDeadline").value = "";
        document.getElementById("bDesc").value = "";
        document.getElementById("bImage").value = "";
    }).catch(() => {
        alert("Gagal memproses gambar beasiswa. Coba lagi.");
    });
}

function addEvent(){

    const file =
        document.getElementById(
            "eImage"
        ).files[0];

    const nama = document.getElementById("eNama").value.trim();
    const tanggal = document.getElementById("eTanggal").value;
    const desc = document.getElementById("eDesc").value.trim();

    if(!nama || !tanggal || !desc){
        alert("Harap lengkapi semua data event.");
        return;
    }

    const imagePromise = file
        ? readFileAsDataURL(file)
        : Promise.resolve("https://via.placeholder.com/300");

    imagePromise.then(image => {
        eventList.push({
            nama: nama,
            tanggal: tanggal,
            desc: desc,
            image: image
        });

        saveData();

        renderAdminEvent();

        document.getElementById("eNama").value = "";
        document.getElementById("eTanggal").value = "";
        document.getElementById("eDesc").value = "";
        document.getElementById("eImage").value = "";
    }).catch(() => {
        alert("Gagal memproses gambar event. Coba lagi.");
    });
}

/* RENDER */
function renderAdminBeasiswa(){

    const container =
    document.getElementById(
        "adminBeasiswa"
    );

    container.innerHTML = "";

    beasiswaList.forEach((b,index)=>{

        container.innerHTML += `

        <div class="card">

            <img src="${b.image}" alt="">

            <h3>${b.nama}</h3>

            <button class="btn"
            onclick="openModal('beasiswa',${index})">
            Open
            </button>

            <button class="btn"
            onclick="editBeasiswa(${index})">
            Edit
            </button>

            <button class="btn"
            onclick="removeBeasiswa(${index})">
            Remove
            </button>

        </div>
        `;
    });
}

function renderAdminEvent(){

    const container =
    document.getElementById(
        "adminEvent"
    );

    container.innerHTML = "";

    eventList.forEach((e,index)=>{

        container.innerHTML += `

        <div class="card">

            <img src="${e.image}" alt="">

            <h3>${e.nama}</h3>

            <button class="btn"
            onclick="openModal('event',${index})">
            Open
            </button>

            <button class="btn"
            onclick="editEvent(${index})">
            Edit
            </button>

            <button class="btn"
            onclick="removeEvent(${index})">
            Remove
            </button>

        </div>
        `;
    });
}

/* REMOVE */
function removeBeasiswa(index){

    beasiswaList.splice(index,1);

    saveData();

    renderAdminBeasiswa();
}

function removeEvent(index){

    eventList.splice(index,1);

    saveData();

    renderAdminEvent();
}

/* EDIT */
function editBeasiswa(index){

    let b = beasiswaList[index];

    document.getElementById("bNama").value = b.nama;
    document.getElementById("bDeadline").value = b.deadline;
    document.getElementById("bDesc").value = b.desc;

    document.getElementById("bNama").focus();
}

function editEvent(index){

    let e = eventList[index];

    document.getElementById("eNama").value = e.nama;
    document.getElementById("eTanggal").value = e.tanggal;
    document.getElementById("eDesc").value = e.desc;

    document.getElementById("eNama").focus();
}

/* MODAL */
function openModal(type, index){

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

        title.innerText = b.nama;

        body.innerHTML = `
        <img src="${b.image || 'https://via.placeholder.com/300'}" alt="" style="width:100%; border-radius:6px; margin-bottom:15px;">
        <b>Deadline:</b><br>
        ${b.deadline}<br><br>
        <b>Deskripsi:</b><br>
        ${formatText(b.desc)}
        `;
    }

    if(type === "event"){

        let e = eventList[index];

        title.innerText = e.nama;

        body.innerHTML = `
        <img src="${e.image || 'https://via.placeholder.com/300'}" alt="" style="width:100%; border-radius:6px; margin-bottom:15px;">
        <b>Tanggal:</b><br>
        ${e.tanggal}<br><br>
        <b>Deskripsi:</b><br>
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
