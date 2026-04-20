import { Router } from "express";
import { getCompras, createCompra, marcarComoRecibida } from "../../controllers/compras/compra.controller.js";

const router = Router();

router.get("/", getCompras);
router.post("/", createCompra);
router.put("/:id/recibir", marcarComoRecibida);

export default router;