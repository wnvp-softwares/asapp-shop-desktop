import { Router } from "express";
import {
    getRoles,
    createRol,
    updateRol,
} from "../../controllers/configuraciones/roles.controller.js";

const router = Router();

// Obtener roles
router.get("/", getRoles);

// Crear rol
router.post("/", createRol);


// Actualizar rol
router.put("/:id", updateRol);

export default router;