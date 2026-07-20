//======================================================
// SECRETARÍA DE MOVILIDAD LA CEJA
// script.js
//======================================================

// URL de tu Apps Script
const URL_API =
"https://script.google.com/macros/s/AKfycbx4spIQssVnd5p3j5B5DGiB4EV86eIlfVLSX6xo5yq8MjdH0nhCWNoSRfA9uX-nvRta/exec";
const URL_RADICADOS = 
"https://script.google.com/macros/s/AKfycbzkh_WTPnfcNdTLKrAkomzf5LB2UOGcnPNJ8umje7MPwIaIjXLKWf2lyH5GB2gyl9L1dA/exec";
//======================================================
// CONSULTAR PLACA
//======================================================

async function consultarPlaca() {

    const txtPlaca = document.getElementById("placa");
    const resultado = document.getElementById("resultado");
    const loader = document.getElementById("loader");

    let placa = txtPlaca.value.trim().toUpperCase();

    if (placa === "") {
        alert("Ingrese una placa.");
        txtPlaca.focus();
        return;
    }

    resultado.style.display = "none";
    loader.style.display = "block";

    try {

        const respuesta = await fetch(
            URL_API + "?placa=" + encodeURIComponent(placa)
        );

        const datos = await respuesta.json();

        loader.style.display = "none";

        if (datos.encontrado) {

            resultado.innerHTML = `

            <div class="card shadow">

                <div class="card-header bg-success text-white">

                    <h4>Información del Vehículo</h4>

                </div>

                <div class="card-body">

                    <table class="table table-bordered">

                        <tr>
                            <th width="40%">Placa</th>
                            <td>${datos.placa}</td>
                        </tr>

                        <tr>
                            <th>Estado</th>
                            <td>
                                <span class="badge bg-success">
                                    ${datos.estado}
                                </span>
                            </td>
                        </tr>

                    </table>

                </div>

            </div>

            `;

        } else {

            resultado.innerHTML = `

            <div class="alert alert-danger">

                No existe información para la placa
                <strong>${placa}</strong>

            </div>

            `;

        }

        resultado.style.display = "block";

    }

    catch (error) {

        loader.style.display = "none";

        resultado.innerHTML = `

        <div class="alert alert-warning">

            Error de conexión.<br><br>

            ${error}

        </div>

        `;

        resultado.style.display = "block";

    }

}

//======================================================
// CONSULTAR AL PRESIONAR ENTER
//======================================================

document.addEventListener("DOMContentLoaded", () => {

    const txt = document.getElementById("placa");

    if (txt) {

        txt.addEventListener("keypress", function (e) {

            if (e.key === "Enter") {

                consultarPlaca();

            }

        });

    }

});

//======================================================
// LIMPIAR
//======================================================

function limpiarConsulta() {

    document.getElementById("placa").value = "";

    document.getElementById("resultado").style.display = "none";

    document.getElementById("placa").focus();

}

//======================================================
// MENSAJE DE BIENVENIDA
//======================================================

console.log("Portal Secretaría de Movilidad La Ceja");

//======================================================
// FECHA ACTUAL
//======================================================

window.onload = function () {

    const fecha = document.getElementById("fecha");

    if (fecha) {

        const hoy = new Date();

        fecha.innerHTML =
            hoy.toLocaleDateString("es-CO", {

                weekday: "long",

                year: "numeric",

                month: "long",

                day: "numeric"

            });

    }

};

//======================================================
// BOTÓN VOLVER ARRIBA
//======================================================

window.onscroll = function () {

    let boton = document.getElementById("btnTop");

    if (!boton) return;

    if (document.documentElement.scrollTop > 300) {

        boton.style.display = "block";

    } else {

        boton.style.display = "none";

    }

};

function volverArriba() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}
function consultarRadicado(){

    let placa = document
        .getElementById("placaRadicado")
        .value
        .toUpperCase()
        .trim();

    if(placa==""){
        alert("Ingrese una placa.");
        return;
    }

    document.getElementById("loader").style.display="block";

    fetch(URL_APPS_SCRIPT + "?placa=" + encodeURIComponent(placa))

    .then(r=>r.json())

    .then(data=>{

        document.getElementById("loader").style.display="none";

        let div=document.getElementById("resultadoRadicado");

        if(data.error){

            div.innerHTML=`
                <div class="alert alert-danger">
                    ${data.error}
                </div>
            `;

            return;
        }

        div.innerHTML=`

        <div class="card border-success shadow">

            <div class="card-header bg-success text-white">

                <h5 class="mb-0">
                    Estado del Radicado
                </h5>

            </div>

            <div class="card-body">

                <table class="table table-bordered">

                    <tr>

                        <th>Placa</th>

                        <td>${data.placa}</td>

                    </tr>

                    <tr>

                        <th>Estado</th>

                        <td><strong>${data.estado}</strong></td>

                    </tr>

                </table>

            </div>

        </div>

        `;

    });

}
async function consultarRadicado() {

    const placa = document
        .getElementById("placaRadicado")
        .value
        .trim()
        .toUpperCase();

    const resultado = document.getElementById("resultadoRadicado");

    if (placa === "") {

        resultado.innerHTML = `
        <div class="alert alert-warning">
            Ingrese una placa.
        </div>`;

        return;
    }

    resultado.innerHTML = `
    <div class="text-center">

        <div class="spinner-border text-success"></div>

        <p class="mt-2">
            Consultando...
        </p>

    </div>`;

    try {

        const respuesta = await fetch(
            URL_RADICADOS + "?placa=" + encodeURIComponent(placa)
        );

        const datos = await respuesta.json();

        if (datos.error) {

            resultado.innerHTML = `
            <div class="alert alert-danger">
                ${datos.error}
            </div>`;

            return;
        }

        if (!datos.encontrado) {

            resultado.innerHTML = `
            <div class="alert alert-danger">

                <i class="bi bi-x-circle-fill"></i>

                No existen radicados para la placa <b>${placa}</b>

            </div>`;

            return;
        }

        resultado.innerHTML = `

        <div class="card border-success shadow">

            <div class="card-header bg-success text-white">

                <h5 class="mb-0">

                    <i class="bi bi-folder-check"></i>

                    Resultado de la Consulta

                </h5>

            </div>

            <div class="card-body">

                <table class="table table-bordered">

                    <tr>
                        <th width="180">Placa</th>
                        <td>${datos.placa}</td>
                    </tr>

                    <tr>
                        <th>Estado</th>
                        <td>

                            <span class="badge bg-success fs-6">

                                ${datos.estado}

                            </span>

                        </td>
                    </tr>

                </table>

            </div>

        </div>`;

    } catch (error) {

        console.error(error);

        resultado.innerHTML = `
        <div class="alert alert-danger">

            Error al conectar con el servidor.

        </div>`;

    }

}
