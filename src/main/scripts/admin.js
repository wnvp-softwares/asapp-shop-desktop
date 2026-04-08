/* ==========================================================================
   VARIABLES GLOBALES Y REQUERIMIENTOS (ELECTRON / NODE.JS)
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const Chart = require('chart.js/auto');

let contenedorPrincipal;
let enlacesNavegacion;


/* ==========================================================================
   INICIALIZACIÓN DEL SISTEMA
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    contenedorPrincipal = document.getElementById('contenedor_dinamico');
    enlacesNavegacion = document.querySelectorAll('.navegacion_principal .nav-link');

    iniciarRouter();

    cargarVista('ventas.html');
});


/* ==========================================================================
   SECCIÓN: ROUTER (NAVEGACIÓN ENTRE VENTANAS)
   ========================================================================== */
function iniciarRouter() {
    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', (evento) => {
            evento.preventDefault();

            enlacesNavegacion.forEach(btn => btn.classList.remove('activo'));

            enlace.classList.add('activo');

            const archivoVista = enlace.getAttribute('data-vista');

            if (archivoVista) {
                cargarVista(archivoVista);
            }
        });
    });
}

/**
 * Lee un archivo HTML local y lo inyecta en el contenedor dinámico
 * @param {string} nombreArchivo 
 */
function cargarVista(nombreArchivo) {
    try {
        const rutaCompleta = path.join(__dirname, nombreArchivo);

        const contenidoHTML = fs.readFileSync(rutaCompleta, 'utf8');

        contenedorPrincipal.innerHTML = contenidoHTML;

        if (nombreArchivo === 'reportes.html') {
            setTimeout(() => {
                inicializarGraficas();
            }, 50);
        }

    } catch (error) {
        console.error(`Error al cargar la vista ${nombreArchivo}:`, error);

        contenedorPrincipal.innerHTML = `
            <div class="h-100 d-flex flex-column align-items-center justify-content-center text-danger">
                <i class="bi bi-exclamation-triangle display-1 mb-3 opacity-50"></i>
                <h5>Error al cargar el módulo</h5>
                <p class="text-muted">No se pudo encontrar el archivo: <strong>${nombreArchivo}</strong></p>
            </div>
        `;
    }
}

/* ==========================================================================
   SECCIÓN: GRÁFICAS DE REPORTES (CHART.JS)
   ========================================================================== */
// Variable global para destruir gráficas previas y evitar bugs visuales
let instanciasGraficas = [];

function inicializarGraficas() {
    // 1. Limpiar gráficas anteriores si el usuario sale y vuelve a entrar a Reportes
    instanciasGraficas.forEach(grafica => grafica.destroy());
    instanciasGraficas = [];

    // --- GRÁFICA 1: VENTAS DE LA SEMANA (BARRAS) ---
    const ctxSemana = document.getElementById('graficaVentasSemana');
    if (ctxSemana) {
        const graficaSemana = new Chart(ctxSemana, {
            type: 'bar',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Ventas ($)',
                    data: [4100, 3000, 2000, 2800, 1900, 2400, 3500],
                    backgroundColor: '#00a86b', // Tu verde primario
                    borderRadius: 4 // Bordes ligeramente redondeados
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } } // Ocultar leyenda
            }
        });
        instanciasGraficas.push(graficaSemana);
    }

    // --- GRÁFICA 2: VENTAS POR CATEGORÍA (DONA) ---
    const ctxCategorias = document.getElementById('graficaCategorias');
    if (ctxCategorias) {
        const graficaCategorias = new Chart(ctxCategorias, {
            type: 'doughnut',
            data: {
                labels: ['Bebidas', 'Botanas', 'Dulces', 'Lácteos'],
                datasets: [{
                    data: [33, 25, 25, 17],
                    // Diferentes tonos de verde para la dona
                    backgroundColor: ['#00a86b', '#34d399', '#a7f3d0', '#064e3b'], 
                    borderWidth: 2,
                    borderColor: '#ffffff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%', // Grosor de la dona
                plugins: { 
                    legend: { 
                        position: 'right', // Leyenda a la derecha
                        labels: { boxWidth: 12, usePointStyle: true }
                    } 
                }
            }
        });
        instanciasGraficas.push(graficaCategorias);
    }

    // --- GRÁFICA 3: ACTIVIDAD POR HORA (LÍNEA) ---
    const ctxActividad = document.getElementById('graficaActividad');
    if (ctxActividad) {
        const graficaActividad = new Chart(ctxActividad, {
            type: 'line',
            data: {
                labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'],
                datasets: [{
                    label: 'Ventas',
                    data: [120, 210, 450, 490, 350, 420, 290],
                    borderColor: '#00a86b',
                    backgroundColor: '#00a86b',
                    tension: 0.4, // Suaviza la línea (curvas en lugar de picos)
                    fill: false,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
        instanciasGraficas.push(graficaActividad);
    }
}

/* ==========================================================================
   SECCIÓN: LÓGICA DE VENTAS (CARRITO Y PRODUCTOS)
   ========================================================================== */
// Aquí agregaremos más adelante las funciones para sumar al carrito,
// filtrar categorías, cobrar, etc.