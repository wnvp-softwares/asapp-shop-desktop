import { Router } from "express";
import {
    getDetalleVentas,
    getDetalleVentaById,
    createDetalleVenta,
    updateDetalleVenta,
} from "../../controllers/ventas/detalle_ventas.controller.js";

const router = Router();

// Obtener todos los detalles de ventas
router.get("/", getDetalleVentas);

// Obtener detalle de venta por ID
router.get("/:id", getDetalleVentaById);

// Crear detalle de venta
router.post("/", createDetalleVenta);

// Actualizar detalle de venta
router.put("/:id", updateDetalleVenta);

export default router;