import { Router } from "express";

import negocioRoutes from "./configuraciones/negocio.routes.js";
import rolesRoutes from "./configuraciones/roles.routes.js";
import usuariosRoutes from "./usuarios/usuarios.routes.js";
import categoriasRoutes from "./productos/categoria.routes.js";
import productosRoutes from "./productos/productos.routes.js";
import proveedoresRoutes from "./proveedores/proveedores.routes.js";
import comprasRoutes from "./compras/compras.routes.js";
import detalleComprasRoutes from "./compras/detalle_compras.routes.js";
import ventasRoutes from "./ventas/ventas.routes.js";
import detalleVentasRoutes from "./ventas/detalle_ventas.routes.js";
import movimientosRoutes from "./inventario/movimientos_inventario.routes.js";
import respaldosRoutes from "./respaldo/respaldo.routes.js";

const router = Router();

router.use("/negocios", negocioRoutes);
router.use("/roles", rolesRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/productos", productosRoutes);
router.use("/proveedores", proveedoresRoutes);
router.use("/compras", comprasRoutes);
router.use("/detalle-compras", detalleComprasRoutes);
router.use("/ventas", ventasRoutes);
router.use("/detalle-ventas", detalleVentasRoutes);
router.use("/movimientos", movimientosRoutes);
router.use("/respaldos", respaldosRoutes);

export default router;