import { Router } from "express";
import { getCategorias, createCategoria } from "../../controllers/productos/categoria.controller.js";

const router = Router();

router.get("/", getCategorias);
router.post("/", createCategoria);

export default router;