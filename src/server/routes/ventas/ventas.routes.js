import { Router } from "express";
import {
    getVentas,
    getVentaById,
    createVenta,
} from "../../controllers/ventas/ventas.controller.js";

const router = Router();

// Obtener todas las ventas
router.get("/", getVentas);

// Obtener venta por ID
router.get("/:id", getVentaById);

// Crear venta
router.post("/", createVenta);

export default router;