import { Proveedor } from "../../models/inventario/proveedor.model.js";

export const getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll({
            where: { activo: 1 },
            order: [['fecha_registro', 'DESC']]
        });
        res.json(proveedores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener proveedores" });
    }
};

export const createProveedor = async (req, res) => {
    try {
        const { nombre, telefono, correo, dias_entrega } = req.body;
        
        await Proveedor.create({
            nombre,
            telefono,
            correo,
            dias_entrega 
        });

        res.json({ message: "Proveedor registrado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar proveedor" });
    }
};

export const deleteProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        await Proveedor.update({ activo: 0 }, { where: { id_proveedor: id } });
        res.json({ message: "Proveedor eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar proveedor" });
    }
};