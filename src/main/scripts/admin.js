/* ==========================================================================
   ==========================================================================
   🧠 ARCHIVO MAESTRO: admin.js
   Contiene la lógica de interacción del panel de administración (Frontend)
   ==========================================================================
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const Chart = require('chart.js/auto');

// Variables de estado del cascarón
let contenedorPrincipal;
let enlacesNavegacion;

/* ==========================================================================
   🚀 INICIALIZACIÓN CENTRAL DEL SISTEMA
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.getElementById('formLogin');
    contenedorPrincipal = document.getElementById('contenedor_dinamico');

    // ¿Estamos en la pantalla de Login?
    if (formLogin) {
        iniciarLogicaLogin();
    }

    // ¿Estamos en el Cascarón (Dashboard)?
    if (contenedorPrincipal) {
        enlacesNavegacion = document.querySelectorAll('.navegacion_principal .nav-link');
        mostrarUsuarioEnSidebar(); // Carga datos y configura el botón de cerrar sesión
        iniciarRouter();           // Prepara el menú lateral
        cargarVista('ventas.html'); // Vista que se abre por defecto al entrar
    }
});


/* ==========================================================================
   🔐 MÓDULO 1: LÓGICA DE LOGIN Y SESIÓN
   ========================================================================== */
function iniciarLogicaLogin() {
    const formLogin = document.getElementById('formLogin');
    const inputUsuario = document.getElementById('usuario');
    const inputPass = document.getElementById('contrasena');
    const alertaError = document.getElementById('alertaError');
    const btnSubmit = document.getElementById('btnSubmit');

    formLogin.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Estado de carga
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
                // Guardar la sesión y dejar entrar
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

    // Verificar si el usuario realmente pasó por el login
    if (datosSesion) {
        const usuario = JSON.parse(datosSesion);
        const nombreSidebar = document.getElementById('nombreUsuarioSidebar');
        const rolSidebar = document.getElementById('rolUsuarioSidebar');

        if (nombreSidebar) nombreSidebar.textContent = usuario.nombre;
        if (rolSidebar) rolSidebar.textContent = usuario.rol;
    } else {
        // Expulsar si es un intruso
        window.location.href = 'login.html';
    }

    // Configurar el botón de Cerrar Sesión con Modal de confirmación
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
    if (btnCerrarSesion) {
        const nuevoBtnCerrar = btnCerrarSesion.cloneNode(true);
        btnCerrarSesion.replaceWith(nuevoBtnCerrar);

        nuevoBtnCerrar.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModalConfirmacion(
                "Cerrar Sesión",
                "¿Estás seguro de que deseas salir? Tendrás que volver a ingresar tus credenciales para acceder al sistema.",
                () => {
                    sessionStorage.removeItem('usuarioSesion');
                    window.location.href = 'login.html';
                },
                "Sí, cerrar sesión"
            );
        });
    }
}


/* ==========================================================================
   🗺️ MÓDULO 2: ROUTER (NAVEGACIÓN DEL DASHBOARD)
   ========================================================================== */
function iniciarRouter() {
    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', (evento) => {
            evento.preventDefault();

            // Cambiar estilos de los botones del menú
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

        // Disparar funciones según la ventana a la que entramos
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
   📊 MÓDULO 3: GRÁFICAS DE REPORTES
   ========================================================================== */
let instanciasGraficas = [];

function inicializarGraficas() {
    // Destruir gráficas viejas si las hay para que no se encimen
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
   👥 MÓDULO 4: GESTIÓN DE USUARIOS
   ========================================================================== */
let usuarioActualSeleccionado = null;
let rolesDisponibles = [];

// 1. Obtener datos y pintar la lista
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

        // Configurar herramientas secundarias
        configurarBotonesModalesUsuario();
        cargarRolesSelect();
        configurarBuscadorUsuarios();

    } catch (error) {
        console.error("Error al cargar usuarios:", error);
        contenedorLista.innerHTML = '<p class="text-danger text-center mt-4">Error de conexión.</p>';
    }
}

// 2. Mostrar datos al dar clic en un usuario
function seleccionarUsuario(user, elementoDiv) {
    document.querySelectorAll('.item_usuario_lista').forEach(el => el.classList.remove('activa'));
    elementoDiv.classList.add('activa');

    usuarioActualSeleccionado = user;

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
        textoUltimoAcceso = fecha.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
    }
    document.getElementById('detUltimoAcceso').textContent = textoUltimoAcceso;
}

// 3. Cargar select de Roles en el modal
async function cargarRolesSelect() {
    try {
        const response = await fetch('http://localhost:3000/api/roles');
        rolesDisponibles = await response.json();
        const select = document.getElementById('inputRolUsr');

        if (select) {
            select.innerHTML = '<option value="" disabled selected>Selecciona un rol</option>';
            rolesDisponibles.forEach(rol => {
                select.innerHTML += `<option value="${rol.id_rol}">${rol.nombre}</option>`;
            });
        }
    } catch (error) {
        console.error("Error al cargar roles:", error);
    }
}

// 4. Lógica de creación, edición y validación de usuarios
function configurarBotonesModalesUsuario() {
    const btnNuevo = document.getElementById('btnNuevoUsuario');
    const btnEditar = document.getElementById('btnEditarUsuario');
    const btnEliminar = document.getElementById('btnEliminarUsuario');
    const formUsuarioData = document.getElementById('formUsuarioData');

    const modalDOM = document.getElementById('modalFormularioUsuario');
    if (!modalDOM) return;
    const modalInstancia = bootstrap.Modal.getOrCreateInstance(modalDOM);

    modalDOM.addEventListener('hidden.bs.modal', () => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    });

    // Preparar modal para Crear
    if (btnNuevo) {
        btnNuevo.addEventListener('click', () => {
            document.getElementById('formUsuarioData').reset();
            document.getElementById('inputIdUsuario').value = '';
            document.getElementById('tituloModalUsuario').textContent = 'Nuevo Usuario';
            document.getElementById('hintPass').textContent = '(Obligatorio)';
            limpiarErroresInputsUsuario(); // Limpiar rastro de errores anteriores
            modalInstancia.show();
        });
    }

    // Preparar modal para Editar
    if (btnEditar) {
        btnEditar.addEventListener('click', () => {
            if (!usuarioActualSeleccionado) return;

            document.getElementById('tituloModalUsuario').textContent = 'Editar Usuario';
            document.getElementById('inputIdUsuario').value = usuarioActualSeleccionado.id_usuario;
            document.getElementById('inputNombreUsr').value = usuarioActualSeleccionado.nombre_completo;
            document.getElementById('inputUsuarioAcceso').value = usuarioActualSeleccionado.usuario;
            document.getElementById('inputRolUsr').value = usuarioActualSeleccionado.id_rol;
            document.getElementById('inputTelefonoUsr').value = usuarioActualSeleccionado.telefono || '';
            document.getElementById('inputPassUsr').value = '';
            document.getElementById('hintPass').textContent = '(Dejar en blanco para conservar la actual)';

            limpiarErroresInputsUsuario(); // Limpiar rastro de errores anteriores
            modalInstancia.show();
        });
    }

    // Lógica para Eliminar
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            if (!usuarioActualSeleccionado) return;

            mostrarModalConfirmacion(
                "Eliminar Usuario",
                `¿Estás seguro de que deseas eliminar permanentemente a <b>${usuarioActualSeleccionado.nombre_completo}</b>? Esta acción no se puede deshacer.`,
                async () => {
                    try {
                        const response = await fetch(`http://localhost:3000/api/usuarios/${usuarioActualSeleccionado.id_usuario}`, { method: 'DELETE' });

                        if (response.ok) {
                            mostrarNotificacion("Usuario eliminado correctamente", "success");
                            document.getElementById('detalleUsuario').classList.add('d-none');
                            document.getElementById('estadoVacioUsuario').classList.remove('d-none');
                            usuarioActualSeleccionado = null;
                            cargarUsuarios();
                        } else {
                            const data = await response.json();
                            mostrarNotificacion(data.message || "Error al eliminar", "error");
                        }
                    } catch (error) {
                        mostrarNotificacion("No se pudo conectar al servidor", "error");
                    }
                },
                "Sí, eliminar"
            );
        });
    }

    // Lógica al Enviar Formulario (Validación Manual + Fetch)
    if (formUsuarioData) {
        formUsuarioData.replaceWith(formUsuarioData.cloneNode(true));
        const formActualizado = document.getElementById('formUsuarioData');

        formActualizado.addEventListener('submit', async (e) => {
            e.preventDefault();

            // 1. Capturar elementos
            const idUsuario = document.getElementById('inputIdUsuario').value;
            const esEdicion = idUsuario !== '';

            const inputNombre = document.getElementById('inputNombreUsr');
            const inputUsuarioAcceso = document.getElementById('inputUsuarioAcceso');
            const inputRol = document.getElementById('inputRolUsr');
            const inputPass = document.getElementById('inputPassUsr');
            const inputTelefono = document.getElementById('inputTelefonoUsr');

            // 2. Limpiar errores visuales
            limpiarErroresInputsUsuario();

            // 3. Validación Manual de campos obligatorios
            let hayErrores = false;

            if (inputNombre.value.trim() === '') {
                marcarInputConError(inputNombre);
                hayErrores = true;
            }
            if (inputUsuarioAcceso.value.trim() === '') {
                marcarInputConError(inputUsuarioAcceso);
                hayErrores = true;
            }
            if (inputRol.value === '' || inputRol.value === null) {
                marcarInputConError(inputRol);
                hayErrores = true;
            }
            // La contraseña solo es obligatoria si es un usuario nuevo
            if (!esEdicion && inputPass.value.trim() === '') {
                marcarInputConError(inputPass);
                hayErrores = true;
            }

            // Si faltan datos, detenemos el proceso y mostramos Toast
            if (hayErrores) {
                mostrarNotificacion("Por favor, llena los campos resaltados en rojo.", "error");
                return;
            }

            // 4. Armar Payload y enviar a BD
            const payload = {
                nombre_completo: inputNombre.value.trim(),
                usuario: inputUsuarioAcceso.value.trim(),
                id_rol: inputRol.value,
                telefono: inputTelefono.value.trim(),
                pass: inputPass.value.trim()
            };

            const url = esEdicion ? `http://localhost:3000/api/usuarios/${idUsuario}` : `http://localhost:3000/api/usuarios`;
            const metodo = esEdicion ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, {
                    method: metodo,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    modalInstancia.hide();
                    mostrarNotificacion(esEdicion ? "Usuario actualizado correctamente" : "Usuario creado exitosamente", "success");

                    document.getElementById('detalleUsuario').classList.add('d-none');
                    document.getElementById('estadoVacioUsuario').classList.remove('d-none');
                    usuarioActualSeleccionado = null;
                    cargarUsuarios();
                } else {
                    const data = await response.json();
                    mostrarNotificacion(data.message || "Ocurrió un error al guardar", "error");
                }
            } catch (error) {
                mostrarNotificacion("No se pudo conectar al servidor", "error");
            }
        });
    }
}

// Sub-funciones de validación visual
function marcarInputConError(elemento) {
    elemento.style.setProperty('border-color', '#ef4444', 'important');
    elemento.style.setProperty('background-color', '#fef2f2', 'important');
}

function limpiarErroresInputsUsuario() {
    const inputs = [
        document.getElementById('inputNombreUsr'),
        document.getElementById('inputUsuarioAcceso'),
        document.getElementById('inputRolUsr'),
        document.getElementById('inputPassUsr')
    ];
    inputs.forEach(input => {
        if (input) {
            input.style.removeProperty('border-color');
            input.style.removeProperty('background-color');
        }
    });
}

// 5. Buscador en tiempo real
function configurarBuscadorUsuarios() {
    const inputBuscar = document.getElementById('inputBuscarUsuario');
    const mensajeSinResultados = document.getElementById('mensajeSinResultados');

    if (!inputBuscar) return;

    const nuevoInputBuscar = inputBuscar.cloneNode(true);
    inputBuscar.replaceWith(nuevoInputBuscar);

    const filtrarLista = () => {
        const textoBusqueda = nuevoInputBuscar.value.toLowerCase().trim();
        const itemsUsuario = document.querySelectorAll('.item_usuario_lista');
        let usuariosVisibles = 0;

        itemsUsuario.forEach(item => {
            const nombre = item.querySelector('h6').textContent.toLowerCase();
            const rol = item.querySelector('small').textContent.toLowerCase();

            if (nombre.includes(textoBusqueda) || rol.includes(textoBusqueda)) {
                item.classList.remove('d-none');
                item.classList.add('d-flex');
                usuariosVisibles++;
            } else {
                item.classList.remove('d-flex');
                item.classList.add('d-none');
            }
        });

        if (mensajeSinResultados) {
            if (usuariosVisibles === 0 && itemsUsuario.length > 0) {
                mensajeSinResultados.classList.remove('d-none');
            } else {
                mensajeSinResultados.classList.add('d-none');
            }
        }
    };

    nuevoInputBuscar.addEventListener('input', filtrarLista);
    filtrarLista();
}


/* ==========================================================================
   🛠️ HERRAMIENTAS GLOBALES (TOASTS Y MODALES)
   ========================================================================== */

function mostrarNotificacion(mensaje, tipo = "success") {
    const toastDOM = document.getElementById('toastNotificacion');
    const toastMensaje = document.getElementById('toastMensaje');

    if (!toastDOM || !toastMensaje) return;

    toastMensaje.textContent = mensaje;
    toastDOM.className = `toast align-items-center text-white border-0 ${tipo === "success" ? "bg-success" : "bg-danger"}`;

    const toast = new bootstrap.Toast(toastDOM, { delay: 3000 });
    toast.show();
}

function mostrarModalConfirmacion(titulo, mensajeHTML, callbackAccion, textoBotonConfirmar = "Confirmar") {
    const modalDOM = document.getElementById('modalConfirmacionGenerico');
    const tituloDOM = document.getElementById('tituloModalConfirmacion');
    const mensajeDOM = document.getElementById('mensajeModalConfirmacion');
    const btnConfirmar = document.getElementById('btnConfirmarAccionModal');

    if (!modalDOM) {
        console.error("No se encontró el HTML del modal de confirmación en dashboard.html");
        return;
    }

    tituloDOM.textContent = titulo;
    mensajeDOM.innerHTML = mensajeHTML;
    btnConfirmar.textContent = textoBotonConfirmar;

    const nuevoBtnConfirmar = btnConfirmar.cloneNode(true);
    btnConfirmar.replaceWith(nuevoBtnConfirmar);

    const modalInstancia = bootstrap.Modal.getOrCreateInstance(modalDOM);

    modalDOM.addEventListener('hidden.bs.modal', () => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach(backdrop => backdrop.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    }, { once: true });

    modalInstancia.show();

    nuevoBtnConfirmar.addEventListener('click', () => {
        modalInstancia.hide();
        callbackAccion();
    });
}