import { Router } from "express";
import {
    getUsuarios,
    getUsuarioById,
    createUsuario,
} from "../../controllers/usuarios/usuarios.controller.js";

const router = Router();

// Obtener todos los usuarios
router.get("/", getUsuarios);

// Obtener usuario por ID
router.get("/:id", getUsuarioById);

// Crear usuario
router.post("/", createUsuario);

export default router;