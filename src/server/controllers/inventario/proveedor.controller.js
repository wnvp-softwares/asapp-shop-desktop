import { Proveedor } from "../../models/inventario/proveedor.model.js";

export const getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll();
        res.json(proveedores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener proveedores" });
    }
};

export const createProveedor = async (req, res) => {
    try {
        await Proveedor.create(req.body);
        res.json({ message: "Proveedor registrado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar proveedor" });
    }
};