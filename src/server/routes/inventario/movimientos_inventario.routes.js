import { Router } from "express";
import {
    getMovimientosInventario,
    getMovimientoInventarioById,
    createMovimientoInventario,
} from "../../controllers/inventario/movimientos_inventario.controller.js";

const router = Router();

// Obtener todos los movimientos de inventario
router.get("/", getMovimientosInventario);

// Obtener movimiento de inventario por ID
router.get("/:id", getMovimientoInventarioById);

// Crear movimiento de inventario
router.post("/", createMovimientoInventario);

export default router;