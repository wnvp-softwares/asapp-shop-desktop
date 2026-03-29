import { Rol } from "../../models/roles.model.js";

// ===============================
// OBTENER ROLES
// ===============================
export const getRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();

        if (!roles || roles.length === 0) {
            return res.status(404).json({ message: "No hay roles" });
        }

        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener roles" });
    }
};

// ===============================
// CREAR ROL
// ===============================
export const createRol = async (req, res) => {
    try {
        const data = req.body;

        await Rol.create(data);

        res.json({ message: "Rol creado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear rol" });
    }
};

// ===============================
// ACTUALIZAR ROL
// ===============================
export const updateRol = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await Rol.update(data, {
            where: { id_negocio: id }
        });

        res.json({ message: "Rol actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar rol" });
    }
};

// ===============================
// ELIMINAR ROL 
// ===============================

//! A pesar de la existencia de acciones de Eliminar en los controllers, estos no deberán ser usados
export const deleteRol = async (req, res) => {
    try {
        const { id } = req.params;

        await Rol.destroy({
            where: { id_rol: id }
        });

        res.json({ message: "Rol eliminado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al eliminar rol" });
    }
};