import { Router } from "express";
import { getRoles, createRol } from "../../controllers/configuraciones/rol.controller.js";

const router = Router();

router.get("/", getRoles);
router.post("/", createRol);

export default router;