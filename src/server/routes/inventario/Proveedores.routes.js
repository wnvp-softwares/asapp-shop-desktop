import { Router } from "express";
import {
    getProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
} from "../../controllers/proveedores/proveedores.controller.js";

const router = Router();

// Obtener todos los proveedores
router.get("/", getProveedores);

// Obtener proveedor por ID
router.get("/:id", getProveedorById);

// Crear proveedor
router.post("/", createProveedor);

// Actualizar proveedor
router.put("/:id", updateProveedor);

export default router;