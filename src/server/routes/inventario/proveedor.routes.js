import { Router } from "express";
import { getProveedores, createProveedor } from "../../controllers/inventario/proveedor.controller.js";

const router = Router();

router.get("/", getProveedores);
router.post("/", createProveedor);

export default router;