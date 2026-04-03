import { Router } from "express";
import {
    getDetalleCompras,
    getDetalleCompraById,
    createDetalleCompra,
    updateDetalleCompra,
} from "../../controllers/compras/detalle_compras.controller.js";

const router = Router();

// Obtener todos los detalles de compras
router.get("/", getDetalleCompras);

// Obtener detalle de compra por ID
router.get("/:id", getDetalleCompraById);

// Crear detalle de compra
router.post("/", createDetalleCompra);

// Actualizar detalle de compra
router.put("/:id", updateDetalleCompra);

export default router;