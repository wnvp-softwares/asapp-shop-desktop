import { Router } from "express";
import {
    getRoles,
    createRol,
    updateRol,
    deleteRol
} from "../../controllers/configuraciones/roles.controller.js";

const router = Router();

// Obtener roles
router.get("/", getRoles);

// Crear rol
router.post("/", createRol);


// Actualizar rol
router.put("/:id", updateRol);


// Eliminar rol
router.put("/:id", deleteRol);

export default router;