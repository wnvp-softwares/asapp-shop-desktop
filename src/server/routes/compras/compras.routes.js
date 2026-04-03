import { Router } from "express";
import {
    getCompras,
    getCompraById,
    createCompra,
    updateCompra,
} from "../../controllers/compras/compras.controller.js";

const router = Router();

// Obtener todas las compras
router.get("/", getCompras);

// Obtener compra por ID
router.get("/:id", getCompraById);

// Crear compra
router.post("/", createCompra);

// Actualizar compra
router.put("/:id", updateCompra);

export default router;