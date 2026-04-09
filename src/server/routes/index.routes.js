import { Router } from "express";

// Importar todas las rutas
import negocioRoutes from "./configuraciones/negocio.routes.js";
import rolRoutes from "./configuraciones/rol.routes.js";
import usuarioRoutes from "./configuraciones/usuario.routes.js";
import categoriaRoutes from "./productos/categoria.routes.js";
import productoRoutes from "./productos/producto.routes.js";
import proveedorRoutes from "./inventario/proveedor.routes.js";
import compraRoutes from "./compras/compra.routes.js";
import ventaRoutes from "./ventas/venta.routes.js";
import movimientoRoutes from "./inventario/movimiento_inventario.routes.js";
import respaldoRoutes from "./configuraciones/respaldo.routes.js";

const router = Router();

// Asignar los endpoints (URLs) a cada archivo de rutas
router.use("/negocio", negocioRoutes);
router.use("/roles", rolRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/categorias", categoriaRoutes);
router.use("/productos", productoRoutes);
router.use("/proveedores", proveedorRoutes);
router.use("/compras", compraRoutes);
router.use("/ventas", ventaRoutes);
router.use("/movimientos", movimientoRoutes);
router.use("/respaldos", respaldoRoutes);

export default router;