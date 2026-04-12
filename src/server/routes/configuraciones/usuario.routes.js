import { Router } from "express";
import { getUsuarios, createUsuario, loginUsuario, updateUsuario, deleteUsuario } from "../../controllers/configuraciones/usuario.controller.js";

const router = Router();

router.get("/", getUsuarios);
router.post("/", createUsuario);
router.post("/login", loginUsuario);
router.put("/:id", updateUsuario);
router.delete("/:id", deleteUsuario);

export default router;