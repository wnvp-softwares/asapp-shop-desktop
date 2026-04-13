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
        const nuevoBtnCerrar = btnCerrarSesion.cloneNode(true);
        btnCerrarSesion.replaceWith(nuevoBtnCerrar);

        nuevoBtnCerrar.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarModalConfirmacion(
                "Cerrar Sesión",
                "¿Estás seguro de que deseas salir?",
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
   🗺️ MÓDULO 2: ROUTER (NAVEGACIÓN)
   ========================================================================== */
function iniciarRouter() {
    enlacesNavegacion.forEach(enlace => {
        enlace.addEventListener('click', (evento) => {
            evento.preventDefault();
            enlacesNavegacion.forEach(btn => btn.classList.remove('activo'));
            enlace.classList.add('activo');
            const archivoVista = enlace.getAttribute('data-vista');
            if (archivoVista) cargarVista(archivoVista);
        });
    });
}

function cargarVista(nombreArchivo) {
    try {
        const rutaCompleta = path.join(__dirname, nombreArchivo);
        const contenidoHTML = fs.readFileSync(rutaCompleta, 'utf8');
        contenedorPrincipal.innerHTML = contenidoHTML;

        if (nombreArchivo === 'reportes.html') setTimeout(() => inicializarGraficas(), 50);
        else if (nombreArchivo === 'usuarios.html') setTimeout(() => cargarUsuarios(), 50);
        else if (nombreArchivo === 'categorias.html') setTimeout(() => configurarModuloCategorias(), 50);
        else if (nombreArchivo === 'productos.html') setTimeout(() => configurarModuloProductos(), 50);
        else if (nombreArchivo === 'ventas.html') setTimeout(() => configurarModuloPOS(), 50);

    } catch (error) {
        console.error(`Error al cargar la vista ${nombreArchivo}:`, error);
        contenedorPrincipal.innerHTML = `<div class="text-danger p-5"><h5>Error al cargar el módulo</h5></div>`;
    }
}


/* ==========================================================================
   📊 MÓDULO 3: GRÁFICAS DE REPORTES
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
   👥 MÓDULO 4: GESTIÓN DE USUARIOS
   ========================================================================== */
let usuarioActualSeleccionado = null;
let rolesDisponibles = [];

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

        configurarBotonesModalesUsuario();
        cargarRolesSelect();
        configurarBuscadorUsuarios();
    } catch (error) {
        contenedorLista.innerHTML = '<p class="text-danger text-center mt-4">Error de conexión.</p>';
    }
}

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

async function cargarRolesSelect() {
    try {
        const response = await fetch('http://localhost:3000/api/roles');
        rolesDisponibles = await response.json();
        const select = document.getElementById('inputRolUsr');
        if (select) {
            select.innerHTML = '<option value="" disabled selected>Selecciona un rol</option>';
            rolesDisponibles.forEach(rol => select.innerHTML += `<option value="${rol.id_rol}">${rol.nombre}</option>`);
        }
    } catch (error) { }
}

function configurarBotonesModalesUsuario() {
    const btnNuevo = document.getElementById('btnNuevoUsuario');
    const btnEditar = document.getElementById('btnEditarUsuario');
    const btnEliminar = document.getElementById('btnEliminarUsuario');
    const formUsuarioData = document.getElementById('formUsuarioData');

    const modalDOM = document.getElementById('modalFormularioUsuario');
    if (!modalDOM) return;
    const modalInstancia = bootstrap.Modal.getOrCreateInstance(modalDOM);

    modalDOM.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    });

    if (btnNuevo) {
        btnNuevo.addEventListener('click', () => {
            document.getElementById('formUsuarioData').reset();
            document.getElementById('inputIdUsuario').value = '';
            document.getElementById('tituloModalUsuario').textContent = 'Nuevo Usuario';
            document.getElementById('hintPass').textContent = '(Obligatorio)';
            limpiarErroresInputs('inputNombreUsr', 'inputUsuarioAcceso', 'inputRolUsr', 'inputPassUsr');
            modalInstancia.show();
        });
    }

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
            limpiarErroresInputs('inputNombreUsr', 'inputUsuarioAcceso', 'inputRolUsr', 'inputPassUsr');
            modalInstancia.show();
        });
    }

    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            if (!usuarioActualSeleccionado) return;
            mostrarModalConfirmacion(
                "Eliminar Usuario",
                `¿Estás seguro de que deseas eliminar a <b>${usuarioActualSeleccionado.nombre_completo}</b>?`,
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
                }, "Sí, eliminar"
            );
        });
    }

    if (formUsuarioData) {
        const formActualizado = formUsuarioData.cloneNode(true);
        formUsuarioData.replaceWith(formActualizado);

        formActualizado.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idUsuario = document.getElementById('inputIdUsuario').value;
            const esEdicion = idUsuario !== '';

            const inputNombre = document.getElementById('inputNombreUsr');
            const inputUsuarioAcceso = document.getElementById('inputUsuarioAcceso');
            const inputRol = document.getElementById('inputRolUsr');
            const inputPass = document.getElementById('inputPassUsr');
            const inputTelefono = document.getElementById('inputTelefonoUsr');

            limpiarErroresInputs('inputNombreUsr', 'inputUsuarioAcceso', 'inputRolUsr', 'inputPassUsr');

            let hayErrores = false;
            if (inputNombre.value.trim() === '') { marcarInputConError(inputNombre); hayErrores = true; }
            if (inputUsuarioAcceso.value.trim() === '') { marcarInputConError(inputUsuarioAcceso); hayErrores = true; }
            if (inputRol.value === '' || inputRol.value === null) { marcarInputConError(inputRol); hayErrores = true; }
            if (!esEdicion && inputPass.value.trim() === '') { marcarInputConError(inputPass); hayErrores = true; }

            if (hayErrores) {
                mostrarNotificacion("Por favor, llena los campos resaltados en rojo.", "error");
                return;
            }

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
            } catch (error) { mostrarNotificacion("No se pudo conectar al servidor", "error"); }
        });
    }
}

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
            if (usuariosVisibles === 0 && itemsUsuario.length > 0) mensajeSinResultados.classList.remove('d-none');
            else mensajeSinResultados.classList.add('d-none');
        }
    };
    nuevoInputBuscar.addEventListener('input', filtrarLista);
    filtrarLista();
}


/* ==========================================================================
   🏷️ MÓDULO 5: GESTIÓN DE CATEGORÍAS
   ========================================================================== */
function configurarModuloCategorias() {
    configurarModalesCategoria();
    configurarBuscadorCategorias();
    cargarCategorias();
}

async function cargarCategorias() {
    const contenedor = document.getElementById('contenedorCategorias');
    const mensajeSinResultados = document.getElementById('mensajeSinResultadosCategoria');
    if (!contenedor) return;

    contenedor.innerHTML = `<div class="col-12 text-center mt-5 w-100"><div class="spinner-border text-success" role="status"></div><p class="text-muted mt-2">Cargando categorías...</p></div>`;
    mensajeSinResultados.classList.add('d-none');

    try {
        const response = await fetch('http://localhost:3000/api/categorias');
        if (!response.ok) throw new Error('Error en el servidor');
        const categorias = await response.json();
        contenedor.innerHTML = '';

        if (categorias.length === 0) {
            mensajeSinResultados.classList.remove('d-none');
            return;
        }

        categorias.forEach(cat => {
            const col = document.createElement('div');
            col.className = 'col item_categoria';
            const descripcion = cat.descripcion ? cat.descripcion : 'Sin descripción';
            const conteo = cat.conteo_productos || 0;

            col.innerHTML = `
                <div class="tarjeta_categoria p-4 h-100 d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="fw-bold text-dark mb-0">${cat.nombre}</h5>
                        <span class="pildora_conteo">${conteo} productos</span>
                    </div>
                    <p class="text-secondary mb-3" style="font-size: 0.9rem;">${descripcion}</p>
                    <div class="acciones_categoria mt-auto pt-3 border-top border-light d-flex gap-4">
                        <button class="btn btn-link p-0 text-decoration-none fw-medium d-flex align-items-center btn-editar-cat text-secondary" style="font-size: 0.75rem;">
                            <i class="bi bi-pencil me-2"></i> Editar
                        </button>
                        <button class="btn btn-link p-0 text-decoration-none fw-medium d-flex align-items-center btn-eliminar-cat text-secondary" style="font-size: 0.75rem;">
                            <i class="bi bi-trash3 me-2"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;

            col.querySelector('.btn-editar-cat').addEventListener('click', () => {
                document.getElementById('formCategoriaData').reset();
                document.getElementById('inputIdCategoria').value = cat.id_categoria;
                document.getElementById('tituloModalCategoria').textContent = 'Editar Categoría';
                document.getElementById('inputNombreCat').value = cat.nombre;
                document.getElementById('inputDescripcionCat').value = cat.descripcion || '';
                limpiarErroresInputs('inputNombreCat');
                bootstrap.Modal.getOrCreateInstance(document.getElementById('modalFormularioCategoria')).show();
            });

            col.querySelector('.btn-eliminar-cat').addEventListener('click', () => {
                mostrarModalConfirmacion("Eliminar Categoría", `¿Estás seguro de eliminar <b>${cat.nombre}</b>?`, async () => {
                    try {
                        const resp = await fetch(`http://localhost:3000/api/categorias/${cat.id_categoria}`, { method: 'DELETE' });
                        if (resp.ok) { mostrarNotificacion("Categoría eliminada", "success"); cargarCategorias(); }
                        else { const data = await resp.json(); mostrarNotificacion(data.message || "Error al eliminar", "error"); }
                    } catch (error) { mostrarNotificacion("Error de conexión", "error"); }
                }, "Sí, eliminar");
            });

            contenedor.appendChild(col);
        });

        const inputBuscar = document.getElementById('inputBuscarCategoria');
        if (inputBuscar) inputBuscar.dispatchEvent(new Event('input'));

    } catch (error) {
        contenedor.innerHTML = `<div class="col-12 text-center mt-4 w-100"><p class="text-danger">Error de conexión.</p></div>`;
    }
}

function configurarModalesCategoria() {
    const btnNueva = document.getElementById('btnNuevaCategoria');
    const formCategoria = document.getElementById('formCategoriaData');
    const modalDOM = document.getElementById('modalFormularioCategoria');

    if (!modalDOM) return;
    const modalInstancia = bootstrap.Modal.getOrCreateInstance(modalDOM);

    modalDOM.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    });

    if (btnNueva) {
        btnNueva.addEventListener('click', () => {
            document.getElementById('formCategoriaData').reset();
            document.getElementById('inputIdCategoria').value = '';
            document.getElementById('tituloModalCategoria').textContent = 'Nueva Categoría';
            limpiarErroresInputs('inputNombreCat');
            modalInstancia.show();
        });
    }

    if (formCategoria) {
        const formActualizado = formCategoria.cloneNode(true);
        formCategoria.replaceWith(formActualizado);

        formActualizado.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idCategoria = document.getElementById('inputIdCategoria').value;
            const esEdicion = idCategoria !== '';
            const inputNombre = document.getElementById('inputNombreCat');
            const inputDescripcion = document.getElementById('inputDescripcionCat');

            limpiarErroresInputs('inputNombreCat');

            if (inputNombre.value.trim() === '') {
                marcarInputConError(inputNombre);
                mostrarNotificacion("El nombre es obligatorio.", "error");
                return;
            }

            const payload = { nombre: inputNombre.value.trim(), descripcion: inputDescripcion.value.trim() };
            const url = esEdicion ? `http://localhost:3000/api/categorias/${idCategoria}` : `http://localhost:3000/api/categorias`;
            const metodo = esEdicion ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, { method: metodo, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                if (response.ok) {
                    modalInstancia.hide();
                    mostrarNotificacion(esEdicion ? "Categoría actualizada" : "Categoría creada", "success");
                    cargarCategorias();
                } else {
                    const data = await response.json();
                    mostrarNotificacion(data.message || "Error al guardar", "error");
                }
            } catch (error) { mostrarNotificacion("Error de conexión", "error"); }
        });
    }
}

function configurarBuscadorCategorias() {
    const inputBuscar = document.getElementById('inputBuscarCategoria');
    const mensajeSinResultados = document.getElementById('mensajeSinResultadosCategoria');
    const contenedorCategorias = document.getElementById('contenedorCategorias');
    if (!inputBuscar) return;

    const nuevoInputBuscar = inputBuscar.cloneNode(true);
    inputBuscar.replaceWith(nuevoInputBuscar);

    const filtrarLista = () => {
        const textoBusqueda = nuevoInputBuscar.value.toLowerCase().trim();
        const itemsCategoria = document.querySelectorAll('#contenedorCategorias .item_categoria');
        let categoriasVisibles = 0;

        itemsCategoria.forEach(item => {
            const nombre = item.querySelector('h5').textContent.toLowerCase();
            const descripcion = item.querySelector('p').textContent.toLowerCase();
            if (nombre.includes(textoBusqueda) || descripcion.includes(textoBusqueda)) {
                item.classList.remove('d-none');
                categoriasVisibles++;
            } else {
                item.classList.add('d-none');
            }
        });

        if (mensajeSinResultados && contenedorCategorias) {
            if (categoriasVisibles === 0 && itemsCategoria.length > 0) {
                mensajeSinResultados.classList.remove('d-none');
                contenedorCategorias.classList.add('d-none');
            } else {
                mensajeSinResultados.classList.add('d-none');
                contenedorCategorias.classList.remove('d-none');
            }
        }
    };
    nuevoInputBuscar.addEventListener('input', filtrarLista);
}


/* ==========================================================================
   📦 MÓDULO 6: GESTIÓN DE PRODUCTOS
   ========================================================================== */
let productosDisponibles = [];
let archivoImagenSeleccionado = null;
let imagenEliminada = false;

// 🌟 Estado global del ordenamiento (Por defecto: por nombre A-Z)
let ordenActual = { columna: 'nombre', ascendente: true };

function configurarModuloProductos() {
    configurarOrdenamientoTabla(); // Activa los clics en los encabezados
    cargarProductos();
    configurarBuscadorYFiltroProductos();
    configurarModalesProducto();
}

// 🌟 FUNCIÓN PARA ORDENAR EL ARREGLO DE PRODUCTOS
function ordenarArrayProductos(productos) {
    return productos.sort((a, b) => {
        let valorA = a[ordenActual.columna];
        let valorB = b[ordenActual.columna];

        // Lógica de extracción de datos complejos (categorías)
        if (ordenActual.columna === 'categoria') {
            valorA = a.categoria ? a.categoria.nombre.toLowerCase() : '';
            valorB = b.categoria ? b.categoria.nombre.toLowerCase() : '';
        }
        // Lógica para textos simples
        else if (['nombre', 'codigo_barras', 'estado'].includes(ordenActual.columna)) {
            valorA = (valorA || '').toString().toLowerCase();
            valorB = (valorB || '').toString().toLowerCase();
        }
        // Lógica matemática para números
        else if (['precio', 'stock'].includes(ordenActual.columna)) {
            valorA = parseFloat(valorA) || 0;
            valorB = parseFloat(valorB) || 0;
        }

        // Retornar según dirección (ascendente/descendente)
        if (valorA < valorB) return ordenActual.ascendente ? -1 : 1;
        if (valorA > valorB) return ordenActual.ascendente ? 1 : -1;
        return 0;
    });
}

function configurarOrdenamientoTabla() {
    const headers = document.querySelectorAll('.th-sortable');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const columnaSeleccionada = header.dataset.sort;

            if (ordenActual.columna === columnaSeleccionada) {
                ordenActual.ascendente = !ordenActual.ascendente;
            } else {
                ordenActual.columna = columnaSeleccionada;
                ordenActual.ascendente = true;
            }

            headers.forEach(h => {
                h.classList.remove('active');
                const icon = h.querySelector('.icono-orden');
                if (icon) icon.className = 'bi bi-arrow-down-up icono-orden';
            });

            header.classList.add('active');
            const iconSeleccionado = header.querySelector('.icono-orden');
            if (iconSeleccionado) {
                iconSeleccionado.className = ordenActual.ascendente ? 'bi bi-arrow-down icono-orden' : 'bi bi-arrow-up icono-orden';
            }

            const productosOrdenados = ordenarArrayProductos([...productosDisponibles]);
            renderizarTablaProductos(productosOrdenados);

            const inputBuscar = document.getElementById('inputBuscarProducto');
            if (inputBuscar) inputBuscar.dispatchEvent(new Event('input'));
        });
    });
}

async function cargarProductos() {
    const tbody = document.getElementById('tbodyProductos');
    if (!tbody) return;

    tbody.innerHTML = `<tr><td colspan="7" class="text-center py-5"><div class="spinner-border text-success"></div><p class="mt-2 text-muted">Cargando productos...</p></td></tr>`;

    try {
        const response = await fetch('http://localhost:3000/api/productos');
        if (!response.ok) throw new Error('Error al cargar productos');

        productosDisponibles = await response.json();

        const productosOrdenados = ordenarArrayProductos([...productosDisponibles]);
        renderizarTablaProductos(productosOrdenados);

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger py-4">Error de conexión con la base de datos.</td></tr>`;
    }
}

function renderizarTablaProductos(productos) {
    const tbody = document.getElementById('tbodyProductos');
    if (!tbody) return;

    tbody.innerHTML = '';

    const msjPrevio = document.getElementById('mensajeSinResultadosProducto');
    if (msjPrevio) msjPrevio.remove();

    if (productos.length === 0) {
        tbody.insertAdjacentHTML('beforeend', `<tr id="mensajeSinResultadosProducto"><td colspan="7" class="text-center text-muted py-4">No se encontraron productos registrados.</td></tr>`);
        return;
    }

    productos.forEach(prod => {
        const tr = document.createElement('tr');
        tr.className = 'item_producto_tabla';

        const codigo = prod.codigo_barras || 'N/A';
        const nombre = prod.nombre;
        const categoria = prod.categoria ? prod.categoria.nombre : 'Sin categoría';
        const precio = `$${parseFloat(prod.precio).toFixed(2)}`;

        const stock = prod.stock;
        const stockMinimo = prod.stock_minimo || 5;
        const esStockBajo = stock <= stockMinimo;
        const claseStock = esStockBajo ? 'fw-bold stock_bajo' : 'fw-bold text-dark';
        const puntoRojo = esStockBajo ? '<span class="punto_rojo"></span>' : '';

        const esActivo = prod.estado === 'activo';
        const claseEstado = esActivo ? 'pildora_estado activo' : 'pildora_estado inactivo';
        const textoEstado = esActivo ? 'Activo' : 'Inactivo';

        tr.dataset.nombre = nombre.toLowerCase();
        tr.dataset.codigo = codigo.toLowerCase();
        tr.dataset.estado = prod.estado;

        tr.innerHTML = `
            <td class="text-secondary ps-3">${codigo}</td>
            <td class="fw-medium text-dark">${nombre}</td>
            <td><span class="pildora_categoria_tabla">${categoria}</span></td>
            <td class="fw-bold text-dark">${precio}</td>
            <td class="${claseStock}">${stock} ${puntoRojo}</td>
            <td><span class="${claseEstado}">${textoEstado}</span></td>
            <td class="text-end pe-3">
                <button class="btn btn-sm text-secondary boton_accion btn-editar-prod" title="Editar"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-sm text-secondary boton_accion btn-eliminar-prod" title="Eliminar"><i class="bi bi-trash"></i></button>
            </td>
        `;

        tr.querySelector('.btn-editar-prod').addEventListener('click', () => abrirModalEdicionProducto(prod));

        tr.querySelector('.btn-eliminar-prod').addEventListener('click', () => {
            mostrarModalConfirmacion("Eliminar Producto", `¿Estás seguro de eliminar el producto <b>${nombre}</b>?`, async () => {
                try {
                    const resp = await fetch(`http://localhost:3000/api/productos/${prod.id_producto}`, { method: 'DELETE' });
                    if (resp.ok) { mostrarNotificacion("Producto eliminado", "success"); cargarProductos(); }
                    else { const data = await resp.json(); mostrarNotificacion(data.message || "Error al eliminar", "error"); }
                } catch (error) { mostrarNotificacion("Error de conexión", "error"); }
            }, "Sí, eliminar");
        });

        tbody.appendChild(tr);
    });
}

function configurarBuscadorYFiltroProductos() {
    const inputBuscar = document.getElementById('inputBuscarProducto');
    const selectFiltro = document.getElementById('filtroEstadoProducto');
    if (!inputBuscar || !selectFiltro) return;

    const nuevoInput = inputBuscar.cloneNode(true);
    inputBuscar.replaceWith(nuevoInput);
    const nuevoSelect = selectFiltro.cloneNode(true);
    selectFiltro.replaceWith(nuevoSelect);

    const aplicarFiltros = () => {
        const texto = nuevoInput.value.toLowerCase().trim();
        const filtro = nuevoSelect.value;
        const filas = document.querySelectorAll('#tbodyProductos .item_producto_tabla');
        let visibles = 0;

        filas.forEach(fila => {
            const coincideTexto = fila.dataset.nombre.includes(texto) || fila.dataset.codigo.includes(texto);
            let coincideFiltro = true;
            if (filtro === 'activos' && fila.dataset.estado !== 'activo') coincideFiltro = false;
            if (filtro === 'inactivos' && fila.dataset.estado !== 'inactivo') coincideFiltro = false;

            if (coincideTexto && coincideFiltro) {
                fila.classList.remove('d-none');
                visibles++;
            } else {
                fila.classList.add('d-none');
            }
        });

        let trSinResultados = document.getElementById('mensajeSinResultadosProducto');
        if (!trSinResultados) {
            document.getElementById('tbodyProductos').insertAdjacentHTML('beforeend', `<tr id="mensajeSinResultadosProducto" class="d-none"><td colspan="7" class="text-center text-muted py-4">No se encontraron productos con esos filtros.</td></tr>`);
            trSinResultados = document.getElementById('mensajeSinResultadosProducto');
        }

        if (visibles === 0 && filas.length > 0) trSinResultados.classList.remove('d-none');
        else if (trSinResultados) trSinResultados.classList.add('d-none');
    };

    nuevoInput.addEventListener('input', aplicarFiltros);
    nuevoSelect.addEventListener('change', aplicarFiltros);
}

// ==========================================
// LÓGICA DEL MODAL DE PRODUCTOS Y DRAG&DROP
// ==========================================
async function cargarCategoriasSelectProd() {
    try {
        const response = await fetch('http://localhost:3000/api/categorias');
        const categorias = await response.json();
        const select = document.getElementById('inputCategoriaProd');
        if (select) {
            select.innerHTML = '<option value="" disabled selected>Seleccione una categoría</option>';
            categorias.forEach(cat => select.innerHTML += `<option value="${cat.id_categoria}">${cat.nombre}</option>`);
        }
    } catch (error) { console.error("Error al cargar categorias", error); }
}

function configurarModalesProducto() {
    const modalDOM = document.getElementById('modalFormularioProducto');
    if (!modalDOM) return;

    let formProducto = document.getElementById('formProductoData');
    const btnNuevo = document.getElementById('btnNuevoProducto');

    if (formProducto) {
        const nuevoForm = formProducto.cloneNode(true);
        formProducto.replaceWith(nuevoForm);
        formProducto = document.getElementById('formProductoData');
    }

    const modalInstancia = bootstrap.Modal.getOrCreateInstance(modalDOM);

    const dropZone = document.getElementById('dropZoneImagen');
    const inputFile = document.getElementById('inputFileImagen');
    const imgPreview = document.getElementById('imgPreview');
    const contenedorPreview = document.getElementById('contenedorPreviewImagen');
    const contenedorTextos = document.getElementById('contenedorTextosDropzone');
    const btnRemoverImg = document.getElementById('btnRemoverImagen');

    const procesarArchivoImagen = (file) => {
        if (!file || !file.type.startsWith('image/')) {
            mostrarNotificacion("Por favor selecciona un archivo de imagen válido", "error");
            return;
        }
        archivoImagenSeleccionado = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            if (imgPreview) imgPreview.src = e.target.result;
            if (contenedorPreview) contenedorPreview.classList.remove('d-none');
            if (contenedorTextos) contenedorTextos.classList.add('d-none');
        };
        reader.readAsDataURL(file);
    };

    dropZone?.addEventListener('click', (e) => {
        if (e.target.closest('#btnRemoverImagen')) {
            e.stopPropagation();
            archivoImagenSeleccionado = null;
            imagenEliminada = true;
            if (inputFile) inputFile.value = "";
            if (imgPreview) imgPreview.src = "";
            if (contenedorPreview) contenedorPreview.classList.add('d-none');
            if (contenedorTextos) contenedorTextos.classList.remove('d-none');
        } else {
            inputFile?.click();
        }
    });

    dropZone?.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.classList.add('dragover'); });
    dropZone?.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
    dropZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) procesarArchivoImagen(e.dataTransfer.files[0]);
    });

    inputFile?.addEventListener('change', function () {
        if (this.files.length) procesarArchivoImagen(this.files[0]);
    });

    const nuevoBtnNuevo = btnNuevo ? btnNuevo.cloneNode(true) : null;
    if (btnNuevo) btnNuevo.replaceWith(nuevoBtnNuevo);

    if (nuevoBtnNuevo) {
        nuevoBtnNuevo.addEventListener('click', async () => {
            formProducto?.reset();
            const inputId = document.getElementById('inputIdProducto');
            if (inputId) inputId.value = '';

            const titulo = document.getElementById('tituloModalProducto');
            if (titulo) titulo.textContent = 'Nuevo Producto';

            archivoImagenSeleccionado = null;
            imagenEliminada = false;
            if (inputFile) inputFile.value = "";
            if (imgPreview) imgPreview.src = "";
            if (contenedorPreview) contenedorPreview.classList.add('d-none');
            if (contenedorTextos) contenedorTextos.classList.remove('d-none');

            limpiarErroresInputs('inputNombreProd', 'inputPrecioProd');
            await cargarCategoriasSelectProd();
            modalInstancia.show();
        });
    }

    if (formProducto) {
        formProducto.addEventListener('submit', async (e) => {
            e.preventDefault();
            const idProd = document.getElementById('inputIdProducto')?.value || '';
            const esEdicion = idProd !== '';

            const iNombre = document.getElementById('inputNombreProd');
            const iPrecio = document.getElementById('inputPrecioProd');
            limpiarErroresInputs('inputNombreProd', 'inputPrecioProd');

            if (!iNombre || !iPrecio || iNombre.value.trim() === '' || iPrecio.value.trim() === '') {
                if (iNombre && iNombre.value.trim() === '') marcarInputConError(iNombre);
                if (iPrecio && iPrecio.value.trim() === '') marcarInputConError(iPrecio);
                mostrarNotificacion("Nombre y precio son obligatorios", "error");
                return;
            }

            const formData = new FormData();
            formData.append('nombre', iNombre.value.trim());
            formData.append('codigo_barras', document.getElementById('inputCodigoProd')?.value.trim() || '');
            formData.append('id_categoria', document.getElementById('inputCategoriaProd')?.value || '');
            formData.append('precio', iPrecio.value.trim());
            formData.append('stock', document.getElementById('inputStockProd')?.value.trim() || '0');
            formData.append('stock_minimo', document.getElementById('inputStockMinProd')?.value.trim() || '5');

            const switchEstado = document.getElementById('switchEstadoProd');
            formData.append('estado', switchEstado?.checked ? 'activo' : 'inactivo');

            if (archivoImagenSeleccionado) formData.append('imagen', archivoImagenSeleccionado);
            formData.append('eliminar_imagen', imagenEliminada);

            const url = esEdicion ? `http://localhost:3000/api/productos/${idProd}` : `http://localhost:3000/api/productos`;
            const metodo = esEdicion ? 'PUT' : 'POST';

            try {
                const response = await fetch(url, { method: metodo, body: formData });
                if (response.ok) {
                    modalInstancia.hide();
                    mostrarNotificacion(esEdicion ? "Producto actualizado" : "Producto creado", "success");
                    cargarProductos();
                } else {
                    const data = await response.json();
                    mostrarNotificacion(data.message || "Error al guardar", "error");
                }
            } catch (error) { mostrarNotificacion("Error de conexión", "error"); }
        });
    }

    modalDOM.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    }, { once: true });
}

async function abrirModalEdicionProducto(prod) {
    document.getElementById('formProductoData')?.reset();
    await cargarCategoriasSelectProd();

    const safeSet = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

    safeSet('inputIdProducto', prod.id_producto);
    const titulo = document.getElementById('tituloModalProducto');
    if (titulo) titulo.textContent = 'Editar Producto';

    safeSet('inputNombreProd', prod.nombre);
    safeSet('inputCodigoProd', prod.codigo_barras || '');
    safeSet('inputCategoriaProd', prod.id_categoria || '');
    safeSet('inputPrecioProd', prod.precio);
    safeSet('inputStockProd', prod.stock);
    safeSet('inputStockMinProd', prod.stock_minimo);

    const sw = document.getElementById('switchEstadoProd');
    if (sw) sw.checked = prod.estado === 'activo';

    archivoImagenSeleccionado = null;
    imagenEliminada = false;

    const imgPreview = document.getElementById('imgPreview');
    const contenedorPreview = document.getElementById('contenedorPreviewImagen');
    const contenedorTextos = document.getElementById('contenedorTextosDropzone');

    if (prod.imagen) {
        if (imgPreview) imgPreview.src = `http://localhost:3000${prod.imagen}`;
        if (contenedorPreview) contenedorPreview.classList.remove('d-none');
        if (contenedorTextos) contenedorTextos.classList.add('d-none');
    } else {
        document.getElementById('btnRemoverImagen')?.click();
    }

    limpiarErroresInputs('inputNombreProd', 'inputPrecioProd');
    bootstrap.Modal.getOrCreateInstance(document.getElementById('modalFormularioProducto')).show();
}

/* ==========================================================================
   🛠️ HERRAMIENTAS GLOBALES Y UTILIDADES
   ========================================================================== */
function marcarInputConError(elemento) {
    elemento.style.setProperty('border-color', '#ef4444', 'important');
    elemento.style.setProperty('background-color', '#fef2f2', 'important');
}

function limpiarErroresInputs(...ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) { el.style.removeProperty('border-color'); el.style.removeProperty('background-color'); }
    });
}

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

    if (!modalDOM) return;
    tituloDOM.textContent = titulo;
    mensajeDOM.innerHTML = mensajeHTML;
    btnConfirmar.textContent = textoBotonConfirmar;

    const nuevoBtnConfirmar = btnConfirmar.cloneNode(true);
    btnConfirmar.replaceWith(nuevoBtnConfirmar);

    const modalInstancia = bootstrap.Modal.getOrCreateInstance(modalDOM);
    modalDOM.addEventListener('hidden.bs.modal', () => {
        document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
        document.body.classList.remove('modal-open');
        document.body.style.paddingRight = '';
    }, { once: true });

    modalInstancia.show();
    nuevoBtnConfirmar.addEventListener('click', () => {
        modalInstancia.hide();
        callbackAccion();
    });
}

/* ==========================================================================
   🛒 MÓDULO 7: PUNTO DE VENTA (POS)
   ========================================================================== */
let posProductosCache = [];
let posCategoriaActiva = 'todas';
let carritoPOS = [];

function configurarModuloPOS() {
    cargarCategoriasPOS();
    cargarProductosPOS();
    configurarBuscadorPOS();
    configurarCobroPOS(); 
}

async function cargarCategoriasPOS() {
    const contenedor = document.getElementById('contenedorCategoriasPOS');
    if (!contenedor) return;

    try {
        const response = await fetch('http://localhost:3000/api/categorias');
        const categorias = await response.json();

        contenedor.innerHTML = `<span class="pildora_categoria activa" data-id="todas">Todas</span>`;

        categorias.forEach(cat => {
            if (cat.conteo_productos > 0) {
                contenedor.innerHTML += `<span class="pildora_categoria" data-id="${cat.id_categoria}">${cat.nombre}</span>`;
            }
        });

        const pildoras = contenedor.querySelectorAll('.pildora_categoria');
        pildoras.forEach(pildora => {
            pildora.addEventListener('click', () => {
                pildoras.forEach(p => p.classList.remove('activa'));
                pildora.classList.add('activa');
                posCategoriaActiva = pildora.dataset.id;
                filtrarProductosPOS();
            });
        });
    } catch (error) {
        console.error("Error al cargar categorías POS", error);
    }
}

async function cargarProductosPOS() {
    const contenedor = document.getElementById('contenedorProductosPOS');
    if (!contenedor) return;

    contenedor.innerHTML = `<div class="col-12 text-center py-5"><div class="spinner-border text-success"></div></div>`;

    try {
        const response = await fetch('http://localhost:3000/api/productos');
        const productos = await response.json();

        posProductosCache = productos
            .filter(p => p.estado === 'activo')
            .sort((a, b) => a.nombre.localeCompare(b.nombre));

        renderizarProductosPOS(posProductosCache);

    } catch (error) {
        contenedor.innerHTML = `<div class="col-12 text-center text-danger py-4">Error al cargar productos.</div>`;
    }
}

function renderizarProductosPOS(productos) {
    const contenedor = document.getElementById('contenedorProductosPOS');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (productos.length === 0) {
        contenedor.innerHTML = `<div class="col-12 text-center text-muted py-5 w-100">No hay productos disponibles.</div>`;
        return;
    }

    productos.forEach(prod => {
        const col = document.createElement('div');
        col.className = 'col item_producto_pos';

        col.dataset.nombre = prod.nombre.toLowerCase();
        col.dataset.codigo = (prod.codigo_barras || '').toLowerCase();
        col.dataset.categoria = prod.id_categoria || 'sin_categoria';

        const imagenSrc = prod.imagen ? `http://localhost:3000${prod.imagen}` : null;
        const precioFormat = `$${parseFloat(prod.precio).toFixed(2)}`;
        const codigoMostrar = prod.codigo_barras || 'Sin código';
        const stock = prod.stock;
        const esStockBajo = stock <= (prod.stock_minimo || 5);

        const bgStock = esStockBajo ? 'bg-danger-subtle border-danger-subtle' : 'bg-light border';
        const colorIconoStock = esStockBajo ? 'text-danger' : 'text-secondary';
        const colorTextoStock = esStockBajo ? 'text-danger' : 'text-dark';

        col.innerHTML = `
            <div class="tarjeta_producto bg-white h-100 d-flex flex-column shadow-sm hover-zoom border border-light" style="border-radius: 12px; cursor: pointer; transition: transform 0.2s ease, box-shadow 0.2s ease;">
                <div style="height: 140px; overflow: hidden; border-top-left-radius: 12px; border-top-right-radius: 12px;" class="bg-light d-flex align-items-center justify-content-center">
                    ${imagenSrc
                ? `<img src="${imagenSrc}" alt="${prod.nombre}" class="img-fluid w-100 h-100" style="object-fit: cover;">`
                : `<i class="bi bi-image fs-1 opacity-50 text-secondary"></i>`
            }
                </div>
                <div class="p-3 d-flex flex-column flex-grow-1">
                    <h6 class="fw-bold text-dark mb-1 lh-sm" style="font-size: 0.95rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;" title="${prod.nombre}">
                        ${prod.nombre}
                    </h6>
                    <small class="text-muted mb-2" style="font-size: 0.75rem;">
                        <i class="bi bi-upc-scan me-1"></i>${codigoMostrar}
                    </small>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <span class="fw-bold text-success" style="font-size: 1.1rem;">${precioFormat}</span>
                        <div class="${bgStock} px-2 py-1 rounded d-flex align-items-center gap-1">
                            <i class="bi bi-box-seam ${colorIconoStock}" style="font-size: 0.75rem;"></i>
                            <span class="fw-medium ${colorTextoStock}" style="font-size: 0.75rem;">${stock}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        col.addEventListener('click', () => {
            if (prod.stock > 0) {
                agregarAlCarritoPOS(prod);
            } else {
                mostrarNotificacion(`No hay stock de ${prod.nombre}`, "error");
            }
        });

        contenedor.appendChild(col);
    });
}

function filtrarProductosPOS() {
    const inputBuscar = document.getElementById('inputBuscarPOS');
    const texto = inputBuscar ? inputBuscar.value.toLowerCase().trim() : '';
    const items = document.querySelectorAll('#contenedorProductosPOS .item_producto_pos');
    let visibles = 0;

    items.forEach(item => {
        const coincideTexto = item.dataset.nombre.includes(texto) || item.dataset.codigo.includes(texto);
        const coincideCategoria = (posCategoriaActiva === 'todas') || (item.dataset.categoria === posCategoriaActiva);

        if (coincideTexto && coincideCategoria) {
            item.classList.remove('d-none');
            visibles++;
        } else {
            item.classList.add('d-none');
        }
    });

    let msjVacio = document.getElementById('msjVacioPOS');
    if (!msjVacio) {
        document.getElementById('contenedorProductosPOS').insertAdjacentHTML('beforeend', `<div id="msjVacioPOS" class="col-12 text-center text-muted py-5 w-100 d-none">No se encontraron productos.</div>`);
        msjVacio = document.getElementById('msjVacioPOS');
    }

    if (visibles === 0 && items.length > 0) msjVacio.classList.remove('d-none');
    else if (msjVacio) msjVacio.classList.add('d-none');
}

function configurarBuscadorPOS() {
    const inputBuscar = document.getElementById('inputBuscarPOS');
    if (!inputBuscar) return;
    const nuevoInput = inputBuscar.cloneNode(true);
    inputBuscar.replaceWith(nuevoInput);
    nuevoInput.addEventListener('input', filtrarProductosPOS);
}

/* ==========================================================================
   🛒 LÓGICA DEL CARRITO DE COMPRAS Y TICKET
   ========================================================================== */

function agregarAlCarritoPOS(producto) {
    const indiceExistente = carritoPOS.findIndex(item => item.id_producto === producto.id_producto);

    if (indiceExistente !== -1) {
        if (carritoPOS[indiceExistente].cantidad < producto.stock) {
            carritoPOS[indiceExistente].cantidad++;
        } else {
            mostrarNotificacion("Stock máximo alcanzado", "error");
            return;
        }
    } else {
        carritoPOS.push({
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            precio: parseFloat(producto.precio),
            stockMaximo: producto.stock,
            cantidad: 1
        });
    }
    renderizarTicketPOS();
}

function renderizarTicketPOS() {
    const estadoVacio = document.getElementById('estadoVacioPOS');
    const contenedorTicket = document.getElementById('contenedorTicketPOS');

    if (!contenedorTicket || !estadoVacio) return;

    if (carritoPOS.length === 0) {
        estadoVacio.classList.remove('d-none');
        contenedorTicket.classList.add('d-none');
        contenedorTicket.innerHTML = '';
        actualizarTotalesPOS();
        return;
    }

    estadoVacio.classList.add('d-none');
    contenedorTicket.classList.remove('d-none');
    contenedorTicket.innerHTML = '';

    carritoPOS.forEach(item => {
        const divItem = document.createElement('div');
        divItem.className = 'tarjeta_item_ticket position-relative';
        divItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-start mb-1">
                <h6 class="mb-0 fw-bold text-dark lh-sm pe-4" style="font-size: 0.9rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${item.nombre}</h6>
                <button class="btn btn-link text-muted p-0 text-decoration-none btn-eliminar-carrito position-absolute top-0 end-0 mt-2 me-3" data-id="${item.id_producto}">
                    <i class="bi bi-trash fs-6 hover-danger"></i>
                </button>
            </div>
            <div class="text-success fw-medium mb-2" style="font-size: 0.8rem;">$${item.precio.toFixed(2)} c/u</div>
            
            <div class="d-flex justify-content-between align-items-center mt-2">
                <div class="control_cantidad_pos">
                    <button class="btn_cant_pos btn-restar-carrito" data-id="${item.id_producto}"><i class="bi bi-dash"></i></button>
                    <span class="px-3 fw-bold text-dark" style="font-size: 0.85rem;">${item.cantidad}</span>
                    <button class="btn_cant_pos btn-sumar-carrito" data-id="${item.id_producto}"><i class="bi bi-plus"></i></button>
                </div>
                <span class="fw-bold text-dark" style="font-size: 1.05rem;">$${(item.precio * item.cantidad).toFixed(2)}</span>
            </div>
        `;

        divItem.querySelector('.btn-eliminar-carrito').addEventListener('click', () => eliminarDelCarritoPOS(item.id_producto));
        divItem.querySelector('.btn-restar-carrito').addEventListener('click', () => cambiarCantidadCarritoPOS(item.id_producto, -1));
        divItem.querySelector('.btn-sumar-carrito').addEventListener('click', () => cambiarCantidadCarritoPOS(item.id_producto, 1));

        contenedorTicket.appendChild(divItem);
    });

    contenedorTicket.scrollTop = contenedorTicket.scrollHeight;

    actualizarTotalesPOS();
}

function cambiarCantidadCarritoPOS(id, delta) {
    const item = carritoPOS.find(p => p.id_producto === id);
    if (!item) return;

    const nuevaCantidad = item.cantidad + delta;

    if (nuevaCantidad > 0 && nuevaCantidad <= item.stockMaximo) {
        item.cantidad = nuevaCantidad;
        renderizarTicketPOS();
    } else if (nuevaCantidad === 0) {
        eliminarDelCarritoPOS(id);
    } else if (nuevaCantidad > item.stockMaximo) {
        mostrarNotificacion("Stock máximo alcanzado", "error");
    }
}

function eliminarDelCarritoPOS(id) {
    carritoPOS = carritoPOS.filter(p => p.id_producto !== id);
    renderizarTicketPOS();
}

function actualizarTotalesPOS() {
    const subtotal = carritoPOS.reduce((suma, item) => suma + (item.precio * item.cantidad), 0);
    const descuento = 0; 
    const total = subtotal - descuento;

    document.getElementById('txtSubtotalPOS').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('txtDescuentoPOS').textContent = `-$${descuento.toFixed(2)}`;
    document.getElementById('txtTotalPOS').textContent = `$${total.toFixed(2)}`;
}

function configurarCobroPOS() {
    const botonesMetodo = document.querySelectorAll('.boton_metodo_pago');
    const contenedorPagoCon = document.getElementById('contenedorPagoCon');
    const inputPagoCon = document.getElementById('inputPagoCon');
    const btnCancelar = document.getElementById('btnCancelarPOS');

    botonesMetodo.forEach(boton => {
        boton.addEventListener('click', () => {
            botonesMetodo.forEach(b => b.classList.remove('activa'));
            boton.classList.add('activa');

            if (boton.dataset.metodo === 'efectivo') {
                contenedorPagoCon.classList.remove('d-none');
                contenedorPagoCon.classList.add('d-flex');
            } else {
                contenedorPagoCon.classList.add('d-none');
                contenedorPagoCon.classList.remove('d-flex');
                inputPagoCon.value = ''; 
            }
        });
    });

    // Botón Cancelar (Vaciar carrito)
    if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
            if (carritoPOS.length === 0) return;
            mostrarModalConfirmacion(
                "Cancelar Venta",
                "¿Estás seguro de que deseas vaciar el ticket actual?",
                () => {
                    carritoPOS = [];
                    inputPagoCon.value = '';
                    document.querySelector('.boton_metodo_pago[data-metodo="efectivo"]').click();
                    renderizarTicketPOS();
                },
                "Sí, vaciar"
            );
        });
    }
}