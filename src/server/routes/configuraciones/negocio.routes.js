import { Router } from "express";
import {
    getNegocio,
    createNegocio,
    updateNegocio
} from "../../controllers/configuraciones/negocio.controller.js";

const router = Router();

// Obtener negocio
router.get("/", getNegocio);

// Crear negocio
router.post("/", createNegocio);

// Actualizar negocio
router.put("/:id", updateNegocio);

export default router;