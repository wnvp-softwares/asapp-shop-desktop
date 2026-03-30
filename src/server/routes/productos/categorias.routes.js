import { Router } from "express";
import {
    getCategorias,
    getCategoria,
    createCategoria,
    updateCategoria,
} from "../../controllers/productos/categoria.controller.js";

const router = Router();

// Obtener todas las categorias
router.get("/", getCategorias);

// Obtener una categoria
router.get("/:id", getCategoria);

// Crear categoria
router.post("/", createCategoria);

// Actualizar categoria
router.put("/:id", updateCategoria);

export default router;