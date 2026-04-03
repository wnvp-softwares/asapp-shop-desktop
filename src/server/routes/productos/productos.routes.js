import { Router } from "express";
import {
    getProductos,
    getProductoById,
    createProducto,
    updateProducto,
} from "../../controllers/productos/productos.controller.js";

const router = Router();

// Obtener todos los productos
router.get("/", getProductos);

// Obtener producto por ID
router.get("/:id", getProductoById);

// Crear producto
router.post("/", createProducto);

// Actualizar producto
router.put("/:id", updateProducto);

export default router;