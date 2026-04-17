create database pos_assap;
use pos_assap;

-- =========================
-- negocio (configuración)
-- =========================
create table negocios (
    id_negocio int auto_increment primary key,
    nombre varchar(100) not null,
    direccion varchar(255),
    telefono varchar(20),
    rfc varchar(20),
    logo varchar(255),
    moneda varchar(10) default 'MXN',
    impresora_ip varchar(50),
    modo_oscuro boolean default false,
    color_primario varchar(20) default '#00a86b'
);

-- =========================
-- roles
-- =========================
create table roles (
    id_rol int auto_increment primary key,
    nombre varchar(50) not null
);

-- =========================
-- usuarios
-- =========================
create table usuarios (
    id_usuario int auto_increment primary key,
    nombre_completo varchar(100) not null,
    usuario varchar(50) not null unique,
    pass varchar(255) not null,
    telefono varchar(20),
    ultimo_acceso datetime,
    id_rol int not null,
    activo boolean default true,

    foreign key (id_rol) references roles(id_rol)
);

-- =========================
-- categorias
-- =========================
create table categorias (
    id_categoria int auto_increment primary key,
    nombre varchar(100) not null,
    descripcion varchar(255)
);

-- =========================
-- productos
-- =========================
create table productos (
    id_producto int auto_increment primary key,
    codigo_barras varchar(50) unique,
    nombre varchar(150) not null,
    imagen varchar(255),
    id_categoria int,
    precio decimal(10,2) not null,
    stock int not null default 0,
    stock_minimo int not null default 5,
    estado enum('activo','inactivo') default 'activo',

    foreign key (id_categoria) references categorias(id_categoria)
);

-- =========================
-- proveedores
-- =========================
create table proveedores (
    id_proveedor int auto_increment primary key,
    nombre varchar(100) not null,
    telefono varchar(20),
    correo varchar(100),
    dias_entrega TEXT AFTER correo,
    activo TINYINT(1) DEFAULT 1,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP;
);

-- =========================
-- compras
-- =========================
create table compras (
    id_compra int auto_increment primary key,
    id_proveedor int,
    fecha datetime default current_timestamp,
    estado ENUM('pagado', 'pendiente') DEFAULT 'pendiente',
    monto_pagado DECIMAL(10,2) DEFAULT 0.00,
    monto_deuda DECIMAL(10,2) DEFAULT 0.00,
    recibido TINYINT(1) DEFAULT 0,
    total decimal(10,2) not null,

    foreign key (id_proveedor) references proveedores(id_proveedor)
);

create table detalle_compras (
    id_detalle int auto_increment primary key,
    id_compra int not null,
    id_producto int not null,
    cantidad int not null,
    precio_unitario decimal(10,2) not null,
    subtotal decimal(10,2) not null,

    foreign key (id_compra) references compras(id_compra),
    foreign key (id_producto) references productos(id_producto)
);

-- =========================
-- ventas
-- =========================
create table ventas (
    id_venta int auto_increment primary key,
    id_usuario int not null,
    fecha datetime default current_timestamp,
    metodo_pago enum('efectivo','tarjeta','transferencia') default 'efectivo',
    pago_con decimal(10,2),
    cambio decimal(10,2),
    descuento decimal(10,2) default 0,
    total decimal(10,2) not null,

    foreign key (id_usuario) references usuarios(id_usuario)
);

create table detalle_ventas (
    id_detalle int auto_increment primary key,
    id_venta int not null,
    id_producto int not null,
    cantidad int not null,
    precio_unitario decimal(10,2) not null,
    subtotal decimal(10,2) not null,

    foreign key (id_venta) references ventas(id_venta),
    foreign key (id_producto) references productos(id_producto)
);

-- =========================
-- movimientos de inventario
-- =========================
create table movimientos_inventario (
    id_movimiento int auto_increment primary key,
    id_producto int not null,
    tipo enum('entrada','salida','ajuste') not null,
    cantidad int not null,
    fecha datetime default current_timestamp,
    referencia varchar(100),

    foreign key (id_producto) references productos(id_producto)
);

-- =========================
-- respaldos
-- =========================
create table respaldos (
    id_respaldo int auto_increment primary key,
    fecha datetime default current_timestamp,
    ruta_archivo varchar(255)
);