import { Proveedor } from "../../models/proveedor.model.js";

// ===============================
// OBTENER TODOS LOS PROVEEDORES
// ===============================
export const getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll();

        if (!proveedores || proveedores.length === 0) {
            return res.status(404).json({ message: "No hay proveedores" });
        }

        res.json(proveedores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener proveedores" });
    }
};

// ===============================
// OBTENER PROVEEDOR POR ID
// ===============================
export const getProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const proveedor = await Proveedor.findOne({ where: { id_proveedor: id } });

        if (!proveedor) {
            return res.status(404).json({ message: "Proveedor no encontrado" });
        }

        res.json(proveedor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el proveedor" });
    }
};

// ===============================
// CREAR PROVEEDOR
// ===============================
export const createProveedor = async (req, res) => {
    try {
        const data = req.body;

        await Proveedor.create(data);

        res.json({ message: "Proveedor creado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear proveedor" });
    }
};

// ===============================
// ACTUALIZAR PROVEEDOR
// ===============================
export const updateProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await Proveedor.update(data, { where: { id_proveedor: id } });

        res.json({ message: "Proveedor actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar proveedor" });
    }
};