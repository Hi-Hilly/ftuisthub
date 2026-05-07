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

/* ADD */
function addBeasiswa(){

    beasiswaList.push({

        nama:
        document.getElementById(
            "bNama"
        ).value,

        deadline:
        document.getElementById(
            "bDeadline"
        ).value,

        desc:
        document.getElementById(
            "bDesc"
        ).value
    });

    saveData();

    renderAdminBeasiswa();
}

function addEvent(){

    eventList.push({

        nama:
        document.getElementById(
            "eNama"
        ).value,

        tanggal:
        document.getElementById(
            "eTanggal"
        ).value,

        desc:
        document.getElementById(
            "eDesc"
        ).value
    });

    saveData();

    renderAdminEvent();
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

            <h3>${b.nama}</h3>

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

            <h3>${e.nama}</h3>

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