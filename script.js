//======================================================
// SECRETARÍA DE MOVILIDAD LA CEJA
// script.js (Versión Final Corregida)
//======================================================

// URL ÚNICA del Web App de Google Apps Script
const URL_BASE = "https://script.google.com/macros/s/AKfycbwzCz8e9glA1h6xJXm342Ux0-r6bBkCp30QZFS08xLIkBFsOp6UpS2SAc0u0_7clTwx/exec";

//======================================================
// 1. CONSULTAR VEHÍCULO (Hoja: DATOS)
//======================================================
async function consultarPlaca() {
    const txtPlaca = document.getElementById("placa");
    const resultado = document.getElementById("resultado");
    const loader = document.getElementById("loader");

    if (!txtPlaca || !resultado) return;

    let placa = txtPlaca.value.trim().toUpperCase();

    if (placa === "") {
        alert("Ingrese una placa.");
        txtPlaca.focus();
        return;
    }

    resultado.style.display = "none";
    if (loader) loader.style.display = "block";

    try {
        // Busca en la hoja "datos"
        const respuesta = await fetch(`${URL_BASE}?placa=${encodeURIComponent(placa)}&tipo=datos`);
        const datos = await respuesta.json();

        if (loader) loader.style.display = "none";

        if (datos.error) {
            resultado.innerHTML = `<div class="alert alert-danger text-center">❌ ${datos.error}</div>`;
            resultado.style.display = "block";
            return;
        }

        if (datos.encontrado) {
            resultado.innerHTML = `
                <div class="card shadow-lg border-success">
                    <div class="card-header bg-success text-white text-center py-3">
                        <h2 class="mb-0 fw-bold">🚗 INFORMACIÓN DEL VEHÍCULO</h2>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered table-hover align-middle mb-0">
                            <tr>
                                <th style="width:40%; font-size:1.5rem; background:#f8f9fa; text-align:center; vertical-align:middle;">PLACA</th>
                                <td style="font-size:2.3rem; font-weight:bold; color:#0d6efd; text-align:center; letter-spacing:2px;">${datos.placa}</td>
                            </tr>
                            <tr>
                                <th style="font-size:1.5rem; background:#f8f9fa; text-align:center; vertical-align:middle;">ESTADO</th>
                                <td class="text-center">
                                    <span class="badge bg-success" style="font-size:1.6rem; padding:14px 28px; border-radius:12px;">${datos.estado}</span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>`;
        } else {
            resultado.innerHTML = `
                <div class="alert alert-danger text-center fs-4">
                    <strong>No existe información para la placa ${placa}</strong>
                </div>`;
        }
        resultado.style.display = "block";

    } catch (error) {
        if (loader) loader.style.display = "none";
        resultado.innerHTML = `<div class="alert alert-warning">Error de conexión.<br><br>${error}</div>`;
        resultado.style.display = "block";
    }
}

//======================================================
// 2. CONSULTAR RADICADO (Hoja: RADICADOS)
//======================================================
async function consultarRadicado() {
    const txtPlacaRadicado = document.getElementById("placaRadicado");
    const resultado = document.getElementById("resultadoRadicado");

    if (!txtPlacaRadicado || !resultado) return;

    const placa = txtPlacaRadicado.value.trim().toUpperCase();

    if (placa === "") {
        resultado.innerHTML = `<div class="alert alert-warning text-center">⚠️ Ingrese una placa para consultar.</div>`;
        resultado.style.display = "block";
        txtPlacaRadicado.focus();
        return;
    }

    resultado.style.display = "block";
    resultado.innerHTML = `
        <div class="text-center py-3">
            <div class="spinner-border text-success" role="status"></div>
            <p class="mt-2 text-muted">Consultando radicado, por favor espere...</p>
        </div>`;

    try {
        // Busca en la hoja "radicados"
        const respuesta = await fetch(`${URL_BASE}?placa=${encodeURIComponent(placa)}&tipo=radicados`);
        const datos = await respuesta.json();

        if (datos.error) {
            resultado.innerHTML = `<div class="alert alert-danger text-center">❌ ${datos.error}</div>`;
            return;
        }

        if (!datos.encontrado) {
            resultado.innerHTML = `
                <div class="alert alert-warning text-center fs-5">
                    <i class="bi bi-exclamation-triangle-fill me-2"></i>
                    No existen radicados registrados para la placa <b>${placa}</b>.
                </div>`;
            return;
        }

        resultado.innerHTML = `
            <div class="card border-success shadow">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0"><i class="bi bi-folder-check me-2"></i>Resultado de la Consulta</h5>
                </div>
                <div class="card-body">
                    <table class="table table-bordered mb-0">
                        <tr>
                            <th width="180" class="bg-light">Placa</th>
                            <td class="fs-5 fw-bold text-primary">${datos.placa}</td>
                        </tr>
                        <tr>
                            <th class="bg-light">Estado del Radicado</th>
                            <td>
                                <span class="badge bg-success fs-6 px-3 py-2">${datos.estado}</span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>`;

    } catch (error) {
        console.error("Error en consulta de radicados:", error);
        resultado.innerHTML = `<div class="alert alert-danger text-center">❌ Error al conectar con el servidor. Intente nuevamente.</div>`;
    }
}

//======================================================
// 3. EVENTOS GLOBALES
//======================================================
document.addEventListener("DOMContentLoaded", () => {
    const txtVehiculo = document.getElementById("placa");
    if (txtVehiculo) {
        txtVehiculo.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                consultarPlaca();
            }
        });
    }

    const txtRadicado = document.getElementById("placaRadicado");
    if (txtRadicado) {
        txtRadicado.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                consultarRadicado();
            }
        });
    }

    const fecha = document.getElementById("fecha");
    if (fecha) {
        const hoy = new Date();
        fecha.textContent = hoy.toLocaleDateString("es-CO", {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });
    }
});

//======================================================
// 4. FUNCIONES DE LIMPIEZA
//======================================================
function limpiarConsultaVehiculo() {
    const txt = document.getElementById("placa");
    const res = document.getElementById("resultado");
    if (txt) { txt.value = ""; txt.focus(); }
    if (res) { res.style.display = "none"; res.innerHTML = ""; }
}

function limpiarConsultaRadicado() {
    const txt = document.getElementById("placaRadicado");
    const res = document.getElementById("resultadoRadicado");
    if (txt) { txt.value = ""; txt.focus(); }
    if (res) { res.style.display = "none"; res.innerHTML = ""; }
}

//======================================================
// 5. UTILIDADES
//======================================================
console.log("✅ Portal Secretaría de Movilidad La Ceja - Cargado correctamente");

window.onscroll = function () {
    const boton = document.getElementById("btnTop");
    if (!boton) return;
    boton.style.display = (document.documentElement.scrollTop > 300) ? "block" : "none";
};

function volverArriba() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}
