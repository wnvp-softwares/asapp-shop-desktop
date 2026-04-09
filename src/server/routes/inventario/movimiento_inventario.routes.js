import { Router } from "express";
import { getMovimientos, createMovimiento } from "../../controllers/inventario/movimiento_inventario.controller.js";

const router = Router();

router.get("/", getMovimientos);
router.post("/", createMovimiento);

export default router;