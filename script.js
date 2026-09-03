// ======================================================
// SECRETARÍA DE MOVILIDAD LA CEJA
// script.js
// Versión completa, optimizada y corregida
// ======================================================

// ======================================================
// URL DEL WEB APP (Google Apps Script)
// ⚠️ IMPORTANTE: Actualizar esta URL cada vez que se 
// implemente una "Nueva versión" en Google Apps Script.
// ======================================================
const URL_BASE = "https://script.google.com/macros/s/AKfycbxaCf-OHBhoUzPWdCpe3KOpqL8Pxibgthd2WFHbyghe4RhtAZp4dRBGl-211PT82NYH/exec";


// ======================================================
// FUNCIÓN PARA ESCAPAR HTML (Seguridad contra XSS)
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
// CONSULTAR VEHÍCULO (Hoja: datos)
// ======================================================
async function consultarPlaca() {
    const txtPlaca = document.getElementById("placa");
    const resultado = document.getElementById("resultado");
    const loader = document.getElementById("loader");

    if (!txtPlaca || !resultado) return;

    let placa = txtPlaca.value.trim().toUpperCase();

    // Validación de campo vacío
    if (placa === "") {
        resultado.innerHTML = `
            <div class="alert alert-warning text-center">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ⚠️ Ingrese una placa para consultar.
            </div>`;
        resultado.style.display = "block";
        txtPlaca.focus();
        return;
    }

    // Mostrar loader y ocultar resultado previo
    resultado.style.display = "none";
    if (loader) loader.style.display = "block";

    try {
        // Se añade un timestamp para evitar caché del navegador
        const url = `${URL_BASE}?placa=${encodeURIComponent(placa)}&tipo=datos&t=${Date.now()}`;

        const respuesta = await fetch(url, {
            method: "GET",
            cache: "no-store"
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (loader) loader.style.display = "none";

        // Manejo de errores devueltos por el backend
        if (datos.error) {
            resultado.innerHTML = `
                <div class="alert alert-danger text-center">
                    <i class="bi bi-x-circle-fill me-2"></i>
                    ❌ ${escaparHTML(datos.error)}
                </div>`;
            resultado.style.display = "block";
            return;
        }

        // Caso: Placa encontrada
        if (datos.encontrado) {
            const placaMostrar = escaparHTML(datos.placa);
            const estadoMostrar = escaparHTML(datos.estado);

            resultado.innerHTML = `
                <div class="card shadow-lg border-success">
                    <div class="card-header bg-success text-white text-center py-3">
                        <h2 class="mb-0 fw-bold">
                            <i class="bi bi-car-front-fill me-2"></i>INFORMACIÓN DEL VEHÍCULO
                        </h2>
                    </div>
                    <div class="card-body">
                        <table class="table table-bordered table-hover align-middle mb-0">
                            <tr>
                                <th style="width:40%; font-size:1.2rem; background:#f8f9fa; text-align:center; vertical-align:middle;">
                                    PLACA
                                </th>
                                <td style="font-size:2rem; font-weight:bold; color:#0d6efd; text-align:center; letter-spacing:2px;">
                                    ${placaMostrar}
                                </td>
                            </tr>
                            <tr>
                                <th style="font-size:1.2rem; background:#f8f9fa; text-align:center; vertical-align:middle;">
                                    ESTADO
                                </th>
                                <td class="text-center">
                                    <span class="badge bg-success" style="font-size:1.3rem; padding:10px 20px; border-radius:8px;">
                                        ${estadoMostrar}
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>`;
        } 
        // Caso: Placa NO encontrada
        else {
            resultado.innerHTML = `
                <div class="alert alert-danger text-center fs-5">
                    <i class="bi bi-search me-2"></i>
                    <strong>No existe información para la placa ${escaparHTML(placa)}</strong>
                </div>`;
        }

        resultado.style.display = "block";

    } catch (error) {
        console.error("Error en consulta de vehículo:", error);
        if (loader) loader.style.display = "none";
        
        resultado.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="bi bi-wifi-off me-2"></i>
                ❌ <strong>Error de conexión</strong><br><br>
                No fue posible consultar la información.<br>
                Verifique su conexión a internet e intente nuevamente.
            </div>`;
        resultado.style.display = "block";
    }
}


// ======================================================
// CONSULTAR RADICADO (Hoja: radicados)
// ======================================================
async function consultarRadicado() {
    const txtPlacaRadicado = document.getElementById("placaRadicado");
    const resultado = document.getElementById("resultadoRadicado");

    if (!txtPlacaRadicado || !resultado) return;

    const placa = txtPlacaRadicado.value.trim().toUpperCase();

    // Validación de campo vacío
    if (placa === "") {
        resultado.innerHTML = `
            <div class="alert alert-warning text-center">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                ⚠️ Ingrese una placa para consultar.
            </div>`;
        resultado.style.display = "block";
        txtPlacaRadicado.focus();
        return;
    }

    // Mostrar loader
    resultado.style.display = "block";
    resultado.innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-success" role="status" aria-label="Consultando"></div>
            <p class="mt-3 text-muted fw-semibold">Consultando radicado, por favor espere...</p>
        </div>`;

    try {
        const url = `${URL_BASE}?placa=${encodeURIComponent(placa)}&tipo=radicados&t=${Date.now()}`;

        const respuesta = await fetch(url, {
            method: "GET",
            cache: "no-store"
        });

        if (!respuesta.ok) {
            throw new Error(`Error HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();

        if (datos.error) {
            resultado.innerHTML = `
                <div class="alert alert-danger text-center">
                    <i class="bi bi-x-circle-fill me-2"></i>
                    ❌ ${escaparHTML(datos.error)}
                </div>`;
            return;
        }

        if (!datos.encontrado) {
            resultado.innerHTML = `
                <div class="alert alert-warning text-center fs-5">
                    <i class="bi bi-folder-x me-2"></i>
                    No existen radicados registrados para la placa <b>${escaparHTML(placa)}</b>.
                </div>`;
            return;
        }

        // Caso: Radicado encontrado
        const placaMostrar = escaparHTML(datos.placa);
        const estadoMostrar = escaparHTML(datos.estado);

        resultado.innerHTML = `
            <div class="card border-success shadow">
                <div class="card-header bg-success text-white">
                    <h5 class="mb-0">
                        <i class="bi bi-folder-check me-2"></i>Resultado de la Consulta
                    </h5>
                </div>
                <div class="card-body">
                    <table class="table table-bordered mb-0">
                        <tr>
                            <th width="180" class="bg-light text-center">Placa</th>
                            <td class="fs-5 fw-bold text-primary text-center">${placaMostrar}</td>
                        </tr>
                        <tr>
                            <th class="bg-light text-center">Estado del Radicado</th>
                            <td class="text-center">
                                <span class="badge bg-success fs-6 px-3 py-2">
                                    ${estadoMostrar}
                                </span>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>`;

    } catch (error) {
        console.error("Error en consulta de radicados:", error);
        resultado.innerHTML = `
            <div class="alert alert-danger text-center">
                <i class="bi bi-wifi-off me-2"></i>
                ❌ <strong>Error al conectar con el servidor.</strong><br><br>
                Intente nuevamente más tarde.
            </div>`;
    }
}


// ======================================================
// LIMPIAR CONSULTA VEHÍCULO
// ======================================================
function limpiarConsultaVehiculo() {
    const txt = document.getElementById("placa");
    const res = document.getElementById("resultado");
    const loader = document.getElementById("loader");

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
    const txt = document.getElementById("placaRadicado");
    const res = document.getElementById("resultadoRadicado");

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
// EVENTOS DOM (Carga inicial de la página)
// ======================================================
document.addEventListener("DOMContentLoaded", function () {

    // 1. Permitir consulta con tecla "Enter" en Vehículos
    const txtVehiculo = document.getElementById("placa");
    if (txtVehiculo) {
        txtVehiculo.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                consultarPlaca();
            }
        });
    }

    // 2. Permitir consulta con tecla "Enter" en Radicados
    const txtRadicado = document.getElementById("placaRadicado");
    if (txtRadicado) {
        txtRadicado.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                consultarRadicado();
            }
        });
    }

    // 3. Mostrar fecha actual formateada en el footer
    const fecha = document.getElementById("fecha");
    if (fecha) {
        const hoy = new Date();
        fecha.textContent = hoy.toLocaleDateString("es-CO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }
});


// ======================================================
// BOTÓN VOLVER ARRIBA
// ======================================================
window.addEventListener("scroll", function () {
    const boton = document.getElementById("btnTop");
    if (!boton) return;

    boton.style.display = window.scrollY > 300 ? "block" : "none";
});

function volverArriba() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ======================================================
// MENSAJE DE CONFIRMACIÓN EN CONSOLA
// ======================================================
console.log("✅ Portal Secretaría de Movilidad La Ceja - script.js cargado correctamente");
