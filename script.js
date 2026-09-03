// ======================================================
// SECRETARÍA DE MOVILIDAD LA CEJA
// script.js
// Versión corregida
// ======================================================

// ======================================================
// URL ÚNICA DEL WEB APP
// ======================================================

const URL_BASE =
    "https://script.google.com/macros/s/AKfycbwzCz8e9glA1h6xJXm342Ux0-r6bBkCp30QZFS08xLIkBFsOp6UpS2SAc0u0_7clTwx/exec";


// ======================================================
// FUNCIÓN PARA ESCAPAR HTML
// ======================================================

function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// CONSULTAR VEHÍCULO
// HOJA: datos
// ======================================================

async function consultarPlaca() {

    const txtPlaca =
        document.getElementById("placa");

    const resultado =
        document.getElementById("resultado");

    const loader =
        document.getElementById("loader");


    if (!txtPlaca || !resultado) {
        return;
    }


    let placa =
        txtPlaca.value
            .trim()
            .toUpperCase();


    if (placa === "") {

        resultado.innerHTML = `
            <div class="alert alert-warning text-center">
                ⚠️ Ingrese una placa para consultar.
            </div>
        `;

        resultado.style.display = "block";

        txtPlaca.focus();

        return;
    }


    resultado.style.display = "none";


    if (loader) {
        loader.style.display = "block";
    }


    try {

        const url =
            `${URL_BASE}?placa=${encodeURIComponent(placa)}&tipo=datos`;


        const respuesta =
            await fetch(url, {
                method: "GET",
                cache: "no-store"
            });


        if (!respuesta.ok) {
            throw new Error(
                `Error HTTP ${respuesta.status}`
            );
        }


        const datos =
            await respuesta.json();


        if (loader) {
            loader.style.display = "none";
        }


        if (datos.error) {

            resultado.innerHTML = `
                <div class="alert alert-danger text-center">
                    ❌ ${escaparHTML(datos.error)}
                </div>
            `;

            resultado.style.display = "block";

            return;
        }


        if (datos.encontrado) {

            const placaMostrar =
                escaparHTML(datos.placa);

            const estadoMostrar =
                escaparHTML(datos.estado);


            resultado.innerHTML = `

                <div class="card shadow-lg border-success">

                    <div class="card-header bg-success text-white text-center py-3">

                        <h2 class="mb-0 fw-bold">

                            🚗 INFORMACIÓN DEL VEHÍCULO

                        </h2>

                    </div>


                    <div class="card-body">

                        <table class="table table-bordered table-hover align-middle mb-0">

                            <tr>

                                <th
                                    style="
                                    width:40%;
                                    font-size:1.5rem;
                                    background:#f8f9fa;
                                    text-align:center;
                                    vertical-align:middle;
                                    "
                                >

                                    PLACA

                                </th>


                                <td
                                    style="
                                    font-size:2.3rem;
                                    font-weight:bold;
                                    color:#0d6efd;
                                    text-align:center;
                                    letter-spacing:2px;
                                    "
                                >

                                    ${placaMostrar}

                                </td>

                            </tr>


                            <tr>

                                <th
                                    style="
                                    font-size:1.5rem;
                                    background:#f8f9fa;
                                    text-align:center;
                                    vertical-align:middle;
                                    "
                                >

                                    ESTADO

                                </th>


                                <td class="text-center">

                                    <span
                                        class="badge bg-success"
                                        style="
                                        font-size:1.6rem;
                                        padding:14px 28px;
                                        border-radius:12px;
                                        "
                                    >

                                        ${estadoMostrar}

                                    </span>

                                </td>

                            </tr>

                        </table>

                    </div>

                </div>

            `;

        } else {

            resultado.innerHTML = `

                <div class="alert alert-danger text-center fs-4">

                    <strong>

                        No existe información para la placa
                        ${escaparHTML(placa)}

                    </strong>

                </div>

            `;

        }


        resultado.style.display = "block";


    } catch (error) {

        console.error(
            "Error en consulta de vehículo:",
            error
        );


        if (loader) {
            loader.style.display = "none";
        }


        resultado.innerHTML = `

            <div class="alert alert-danger text-center">

                ❌ <strong>Error de conexión</strong>

                <br><br>

                No fue posible consultar la información.

                <br>

                Verifique la conexión e intente nuevamente.

            </div>

        `;


        resultado.style.display = "block";

    }

}


// ======================================================
// CONSULTAR RADICADO
// HOJA: radicados
// ======================================================

async function consultarRadicado() {

    const txtPlacaRadicado =
        document.getElementById("placaRadicado");

    const resultado =
        document.getElementById("resultadoRadicado");


    if (!txtPlacaRadicado || !resultado) {
        return;
    }


    const placa =
        txtPlacaRadicado.value
            .trim()
            .toUpperCase();


    if (placa === "") {

        resultado.innerHTML = `

            <div class="alert alert-warning text-center">

                ⚠️ Ingrese una placa para consultar.

            </div>

        `;

        resultado.style.display = "block";

        txtPlacaRadicado.focus();

        return;
    }


    resultado.style.display = "block";


    resultado.innerHTML = `

        <div class="text-center py-4">

            <div
                class="spinner-border text-success"
                role="status"
                aria-label="Consultando"
            ></div>

            <p class="mt-3 text-muted">

                Consultando radicado,
                por favor espere...

            </p>

        </div>

    `;


    try {

        const url =
            `${URL_BASE}?placa=${encodeURIComponent(placa)}&tipo=radicados`;


        const respuesta =
            await fetch(url, {
                method: "GET",
                cache: "no-store"
            });


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP ${respuesta.status}`
            );

        }


        const datos =
            await respuesta.json();


        if (datos.error) {

            resultado.innerHTML = `

                <div class="alert alert-danger text-center">

                    ❌ ${escaparHTML(datos.error)}

                </div>

            `;

            return;

        }


        if (!datos.encontrado) {

            resultado.innerHTML = `

                <div class="alert alert-warning text-center fs-5">

                    <i class="bi bi-exclamation-triangle-fill me-2"></i>

                    No existen radicados registrados para la placa

                    <b>${escaparHTML(placa)}</b>.

                </div>

            `;

            return;

        }


        const placaMostrar =
            escaparHTML(datos.placa);

        const estadoMostrar =
            escaparHTML(datos.estado);


        resultado.innerHTML = `

            <div class="card border-success shadow">

                <div class="card-header bg-success text-white">

                    <h5 class="mb-0">

                        <i class="bi bi-folder-check me-2"></i>

                        Resultado de la Consulta

                    </h5>

                </div>


                <div class="card-body">

                    <table class="table table-bordered mb-0">

                        <tr>

                            <th
                                width="180"
                                class="bg-light"
                            >

                                Placa

                            </th>


                            <td
                                class="fs-5 fw-bold text-primary"
                            >

                                ${placaMostrar}

                            </td>

                        </tr>


                        <tr>

                            <th class="bg-light">

                                Estado del Radicado

                            </th>


                            <td>

                                <span
                                    class="badge bg-success fs-6 px-3 py-2"
                                >

                                    ${estadoMostrar}

                                </span>

                            </td>

                        </tr>

                    </table>

                </div>

            </div>

        `;


    } catch (error) {

        console.error(
            "Error en consulta de radicados:",
            error
        );


        resultado.innerHTML = `

            <div class="alert alert-danger text-center">

                ❌ <strong>Error al conectar con el servidor.</strong>

                <br><br>

                Intente nuevamente.

            </div>

        `;

    }

}


// ======================================================
// LIMPIAR CONSULTA VEHÍCULO
// ======================================================

function limpiarConsultaVehiculo() {

    const txt =
        document.getElementById("placa");

    const res =
        document.getElementById("resultado");

    const loader =
        document.getElementById("loader");


    if (txt) {

        txt.value = "";

        txt.focus();

    }


    if (res) {

        res.style.display = "none";

        res.innerHTML = "";

    }


    if (loader) {

        loader.style.display = "none";

    }

}


// ======================================================
// LIMPIAR CONSULTA RADICADO
// ======================================================

function limpiarConsultaRadicado() {

    const txt =
        document.getElementById("placaRadicado");

    const res =
        document.getElementById("resultadoRadicado");


    if (txt) {

        txt.value = "";

        txt.focus();

    }


    if (res) {

        res.style.display = "none";

        res.innerHTML = "";

    }

}


// ======================================================
// EVENTOS DOM
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        // ----------------------------------------------
        // PLACA VEHÍCULO
        // ----------------------------------------------

        const txtVehiculo =
            document.getElementById("placa");


        if (txtVehiculo) {

            txtVehiculo.addEventListener(
                "keydown",
                function (e) {

                    if (e.key === "Enter") {

                        e.preventDefault();

                        consultarPlaca();

                    }

                }
            );

        }


        // ----------------------------------------------
        // PLACA RADICADO
        // ----------------------------------------------

        const txtRadicado =
            document.getElementById("placaRadicado");


        if (txtRadicado) {

            txtRadicado.addEventListener(
                "keydown",
                function (e) {

                    if (e.key === "Enter") {

                        e.preventDefault();

                        consultarRadicado();

                    }

                }
            );

        }


        // ----------------------------------------------
        // FECHA
        // ----------------------------------------------

        const fecha =
            document.getElementById("fecha");


        if (fecha) {

            const hoy =
                new Date();


            fecha.textContent =
                hoy.toLocaleDateString(
                    "es-CO",
                    {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                );

        }

    }
);


// ======================================================
// BOTÓN VOLVER ARRIBA
// ======================================================

window.addEventListener(
    "scroll",
    function () {

        const boton =
            document.getElementById("btnTop");


        if (!boton) {
            return;
        }


        boton.style.display =
            window.scrollY > 300
                ? "block"
                : "none";

    }
);


// ======================================================
// VOLVER ARRIBA
// ======================================================

function volverArriba() {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


// ======================================================
// MENSAJE DE CARGA
// ======================================================

console.log(
    "✅ Portal Secretaría de Movilidad La Ceja - script.js cargado correctamente"
);
