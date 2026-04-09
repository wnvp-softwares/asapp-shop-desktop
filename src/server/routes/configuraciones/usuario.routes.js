import { Router } from "express";
import { getUsuarios, createUsuario, loginUsuario } from "../../controllers/configuraciones/usuario.controller.js";

const router = Router();

router.get("/", getUsuarios);
router.post("/", createUsuario);
router.post("/login", loginUsuario);

export default router;