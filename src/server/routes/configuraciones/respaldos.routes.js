import { Router } from "express";
import {
    getRespaldos,
    getRespaldoById,
    createRespaldo,
    updateRespaldo,
} from "../../controllers/respaldo/respaldo.controller.js";

const router = Router();

// Obtener todos los respaldos
router.get("/", getRespaldos);

// Obtener respaldo por ID
router.get("/:id", getRespaldoById);

// Crear respaldo
router.post("/", createRespaldo);

// Actualizar respaldo
router.put("/:id", updateRespaldo);

export default router;