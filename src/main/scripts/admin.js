/* ==========================================================================
   VARIABLES GLOBALES Y REQUERIMIENTOS (ELECTRON / NODE.JS)
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const Chart = require('chart.js/auto');

let contenedorPrincipal;
let enlacesNavegacion;

/* ==========================================================================
   INICIALIZACIÓN CENTRAL DEL SISTEMA
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    contenedorPrincipal = document.getElementById('contenedor_dinamico');

    if (formLogin) {
        iniciarLogicaLogin();
    }

    if (contenedorPrincipal) {
        enlacesNavegacion = document.querySelectorAll('.navegacion_principal .nav-link');
        mostrarUsuarioEnSidebar();
        iniciarRouter();
        cargarVista('ventas.html');
    }
});

/* ==========================================================================
   SECCIÓN 1: LÓGICA DE LOGIN Y SESIÓN
   ========================================================================== */
function iniciarLogicaLogin() {
    const formLogin = document.getElementById('formLogin');
    const inputUsuario = document.getElementById('usuario');
    const inputPass = document.getElementById('contrasena');
    const alertaError = document.getElementById('alertaError');
    const btnSubmit = document.getElementById('btnSubmit');

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        alertaError.classList.add('d-none');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cargando...';

        const usuario = inputUsuario.value.trim();
        const pass = inputPass.value.trim();

        try {
            const response = await fetch('http://localhost:3000/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, pass })
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem('usuarioSesion', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                mostrarErrorLogin(data.message);
            }

        } catch (error) {
            console.error("Error de conexión:", error);
            mostrarErrorLogin("No se pudo conectar con el servidor.");
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = 'Iniciar Sesión';
        }
    });

    function mostrarErrorLogin(mensaje) {
        alertaError.textContent = mensaje;
        alertaError.classList.remove('d-none');
    }
}

function mostrarUsuarioEnSidebar() {
    const datosSesion = sessionStorage.getItem('usuarioSesion');

    if (datosSesion) {
        const usuario = JSON.parse(datosSesion);
        const nombreSidebar = document.getElementById('nombreUsuarioSidebar');
        const rolSidebar = document.getElementById('rolUsuarioSidebar');

        if (nombreSidebar) nombreSidebar.textContent = usuario.nombre;
        if (rolSidebar) rolSidebar.textContent = usuario.rol;
    } else {
        window.location.href = 'login.html';
    }

    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        btnCerrarSesion.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('usuarioSesion');
            window.location.href = 'login.html';
        });
    }
}

/* ==========================================================================
   SECCIÓN 2: ROUTER (NAVEGACIÓN DEL DASHBOARD)
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

function cargarVista(nombreArchivo) {
    try {
        const rutaCompleta = path.join(__dirname, nombreArchivo);
        const contenidoHTML = fs.readFileSync(rutaCompleta, 'utf8');
        contenedorPrincipal.innerHTML = contenidoHTML;

        if (nombreArchivo === 'reportes.html') {
            setTimeout(() => inicializarGraficas(), 50);
        } else if (nombreArchivo === 'usuarios.html') {
            setTimeout(() => cargarUsuarios(), 50);
        }

    } catch (error) {
        console.error(`Error al cargar la vista ${nombreArchivo}:`, error);
        contenedorPrincipal.innerHTML = `<div class="h-100 d-flex flex-column align-items-center justify-content-center text-danger"><h5>Error al cargar el módulo</h5></div>`;
    }
}

/* ==========================================================================
   SECCIÓN 3: GRÁFICAS DE REPORTES (CHART.JS)
   ========================================================================== */
let instanciasGraficas = [];

function inicializarGraficas() {
    instanciasGraficas.forEach(grafica => grafica.destroy());
    instanciasGraficas = [];

    const ctxSemana = document.getElementById('graficaVentasSemana');
    if (ctxSemana) {
        instanciasGraficas.push(new Chart(ctxSemana, {
            type: 'bar',
            data: { labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], datasets: [{ label: 'Ventas ($)', data: [4100, 3000, 2000, 2800, 1900, 2400, 3500], backgroundColor: '#00a86b', borderRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
        }));
    }

    const ctxCategorias = document.getElementById('graficaCategorias');
    if (ctxCategorias) {
        instanciasGraficas.push(new Chart(ctxCategorias, {
            type: 'doughnut',
            data: { labels: ['Bebidas', 'Botanas', 'Dulces', 'Lácteos'], datasets: [{ data: [33, 25, 25, 17], backgroundColor: ['#00a86b', '#34d399', '#a7f3d0', '#064e3b'], borderWidth: 2, borderColor: '#ffffff' }] },
            options: { responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'right', labels: { boxWidth: 12, usePointStyle: true } } } }
        }));
    }

    const ctxActividad = document.getElementById('graficaActividad');
    if (ctxActividad) {
        instanciasGraficas.push(new Chart(ctxActividad, {
            type: 'line',
            data: { labels: ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'], datasets: [{ label: 'Ventas', data: [120, 210, 450, 490, 350, 420, 290], borderColor: '#00a86b', backgroundColor: '#00a86b', tension: 0.4, fill: false, pointRadius: 4 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }
        }));
    }
}

/* ==========================================================================
   SECCIÓN 4: MÓDULO DE USUARIOS
   ========================================================================== */
async function cargarUsuarios() {
    const contenedorLista = document.querySelector('.lista_usuarios_scroll');
    if (!contenedorLista) return;

    contenedorLista.innerHTML = `<div class="text-center mt-5"><div class="spinner-border text-success" role="status"></div><p class="text-muted mt-2">Cargando usuarios...</p></div>`;

    try {
        const response = await fetch('http://localhost:3000/api/usuarios');
        if (!response.ok) throw new Error('No se pudieron obtener los usuarios');

        const usuarios = await response.json();
        contenedorLista.innerHTML = '';

        if (usuarios.length === 0) {
            contenedorLista.innerHTML = '<p class="text-muted text-center mt-4">No hay usuarios registrados.</p>';
            return;
        }

        usuarios.forEach(user => {
            const partesNombre = user.nombre_completo.split(' ');
            const iniciales = (partesNombre[0][0] + (partesNombre[1] ? partesNombre[1][0] : '')).toUpperCase();
            const nombreRol = user.rol ? user.rol.nombre : 'Sin Rol';

            const div = document.createElement('div');
            div.className = 'item_usuario_lista d-flex align-items-center p-3 mb-3 cursor-pointer border-0 shadow-sm';

            div.innerHTML = `
                <div class="avatar_iniciales me-3">${iniciales}</div>
                <div class="flex-grow-1">
                    <h6 class="mb-0 fw-bold text-dark">${user.nombre_completo}</h6>
                    <small class="text-muted">${nombreRol}</small>
                </div>
            `;

            div.addEventListener('click', () => seleccionarUsuario(user, div));
            contenedorLista.appendChild(div);
        });

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        contenedorLista.innerHTML = '<p class="text-danger text-center mt-4">Error de conexión.</p>';
    }
}

function seleccionarUsuario(user, elementoDiv) {
    document.querySelectorAll('.item_usuario_lista').forEach(el => el.classList.remove('activa'));
    elementoDiv.classList.add('activa');

    const estadoVacio = document.getElementById('estadoVacioUsuario');
    const detalleUsuario = document.getElementById('detalleUsuario');

    if (estadoVacio) estadoVacio.classList.add('d-none');
    if (detalleUsuario) {
        detalleUsuario.classList.remove('d-none');
        detalleUsuario.classList.add('d-flex');
    }

    const partesNombre = user.nombre_completo.split(' ');
    const iniciales = (partesNombre[0][0] + (partesNombre[1] ? partesNombre[1][0] : '')).toUpperCase();

    document.getElementById('detAvatar').textContent = iniciales;
    document.getElementById('detNombre').textContent = user.nombre_completo;
    document.getElementById('detRol').textContent = user.rol ? user.rol.nombre : 'Sin Rol';
    document.getElementById('detUsuarioAcceso').textContent = user.usuario;
    document.getElementById('detTelefono').textContent = user.telefono ? user.telefono : 'No registrado';

    let textoUltimoAcceso = "Nunca";
    if (user.ultimo_acceso) {
        const fecha = new Date(user.ultimo_acceso);
        textoUltimoAcceso = fecha.toLocaleString('es-MX', { 
            dateStyle: 'short', 
            timeStyle: 'short' 
        });
    }
    document.getElementById('detUltimoAcceso').textContent = textoUltimoAcceso;
}