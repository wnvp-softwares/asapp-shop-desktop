import { Router } from "express";
import { getVentas, createVenta } from "../../controllers/ventas/venta.controller.js";

const router = Router();

router.get("/", getVentas);
router.post("/", createVenta);

export default router;