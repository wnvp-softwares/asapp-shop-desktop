// ==========================================================================
// 1. IMPORTAMOS TODOS LOS MODELOS DE SUS SUBCARPETAS
// ==========================================================================
import { Negocio } from "./configuraciones/negocio.model.js";
import { Rol } from "./configuraciones/rol.model.js";
import { Usuario } from "./configuraciones/usuario.model.js";
import { Respaldo } from "./configuraciones/respaldo.model.js";

import { Categoria } from "./productos/categoria.model.js";
import { Producto } from "./productos/producto.model.js";

import { Proveedor } from "./inventario/proveedor.model.js";
import { MovimientoInventario } from "./inventario/movimiento_inventario.model.js";

import { Compra } from "./compras/compra.model.js";
import { DetalleCompra } from "./compras/detalle_compra.model.js";

import { Venta } from "./ventas/venta.model.js";
import { DetalleVenta } from "./ventas/detalle_venta.model.js";

// ==========================================================================
// 2. DEFINIMOS LAS RELACIONES (hasMany / belongsTo)
// ==========================================================================

// --- USUARIOS Y ROLES ---
Rol.hasMany(Usuario, { foreignKey: "id_rol", as: "usuarios" });
Usuario.belongsTo(Rol, { foreignKey: "id_rol", as: "rol" });

// --- PRODUCTOS Y CATEGORÍAS ---
Categoria.hasMany(Producto, { foreignKey: "id_categoria", as: "productos" });
Producto.belongsTo(Categoria, { foreignKey: "id_categoria", as: "categoria" });

// --- COMPRAS Y PROVEEDORES ---
Proveedor.hasMany(Compra, { foreignKey: "id_proveedor", as: "compras" });
Compra.belongsTo(Proveedor, { foreignKey: "id_proveedor", as: "proveedor" });

// --- DETALLES DE COMPRA ---
Compra.hasMany(DetalleCompra, { foreignKey: "id_compra", as: "detalles" });
DetalleCompra.belongsTo(Compra, { foreignKey: "id_compra", as: "compra" });

Producto.hasMany(DetalleCompra, { foreignKey: "id_producto", as: "detalles_compra" });
DetalleCompra.belongsTo(Producto, { foreignKey: "id_producto", as: "producto" });

// --- VENTAS Y USUARIOS ---
Usuario.hasMany(Venta, { foreignKey: "id_usuario", as: "ventas" });
Venta.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

// --- DETALLES DE VENTA ---
Venta.hasMany(DetalleVenta, { foreignKey: "id_venta", as: "detalles" });
DetalleVenta.belongsTo(Venta, { foreignKey: "id_venta", as: "venta" });

Producto.hasMany(DetalleVenta, { foreignKey: "id_producto", as: "detalles_venta" });
DetalleVenta.belongsTo(Producto, { foreignKey: "id_producto", as: "producto" });

// --- MOVIMIENTOS DE INVENTARIO ---
Producto.hasMany(MovimientoInventario, { foreignKey: "id_producto", as: "movimientos" });
MovimientoInventario.belongsTo(Producto, { foreignKey: "id_producto", as: "producto" });

// ==========================================================================
// 3. EXPORTAMOS TODO EMPAQUETADO
// ==========================================================================
export {
    Negocio, Rol, Usuario, Respaldo,
    Categoria, Producto, Proveedor, MovimientoInventario,
    Compra, DetalleCompra, Venta, DetalleVenta
};