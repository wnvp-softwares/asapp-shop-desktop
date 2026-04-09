import { Router } from "express";
import { getRespaldos, createRespaldo } from "../../controllers/configuraciones/respaldo.controller.js";

const router = Router();

router.get("/", getRespaldos);
router.post("/", createRespaldo);

export default router;