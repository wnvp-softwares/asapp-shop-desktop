import { Router } from "express";
import { getProveedores, createProveedor, deleteProveedor } from "../../controllers/inventario/proveedor.controller.js";

const router = Router();

router.get("/", getProveedores);
router.post("/", createProveedor);
router.delete("/:id", deleteProveedor);

export default router;