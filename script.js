let beasiswaList =
JSON.parse(
localStorage.getItem("beasiswa")
) || [];

let eventList =
JSON.parse(
localStorage.getItem("event")
) || [];

function renderBeasiswa(){

    const container =
    document.getElementById(
        "beasiswaContainer"
    );

    container.innerHTML = "";

    beasiswaList.forEach((b,index)=>{

        container.innerHTML += `

        <div class="card">

            <h3>${b.nama}</h3>

            <p>
            Deadline:
            ${b.deadline}
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

    container.innerHTML = "";

    eventList.forEach((e,index)=>{

        container.innerHTML += `

        <div class="card">

            <h3>${e.nama}</h3>

            <p>
            Tanggal:
            ${e.tanggal}
            </p>

            <button class="btn"
            onclick="openModal('event',${index})">
            Open
            </button>

        </div>
        `;
    });
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
        ${b.desc}
        `;
    }

    if(type === "event"){

        let e = eventList[index];

        title.innerText =
        e.nama;

        body.innerHTML = `
        ${e.desc}
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

renderBeasiswa();

renderEvent();