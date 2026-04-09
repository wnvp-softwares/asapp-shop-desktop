import { Rol } from "../../models/configuraciones/rol.model.js";

export const getRoles = async (req, res) => {
    try {
        const roles = await Rol.findAll();
        res.json(roles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener roles" });
    }
};

export const createRol = async (req, res) => {
    try {
        await Rol.create(req.body);
        res.json({ message: "Rol creado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear rol" });
    }
};