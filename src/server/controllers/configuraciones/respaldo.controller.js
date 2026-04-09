import { Respaldo } from "../../models/configuraciones/respaldo.model.js";

export const getRespaldos = async (req, res) => {
    try {
        const respaldos = await Respaldo.findAll({ order: [["fecha", "DESC"]] });
        res.json(respaldos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener respaldos" });
    }
};

export const createRespaldo = async (req, res) => {
    try {
        await Respaldo.create({ ruta_archivo: req.body.ruta_archivo });
        res.json({ message: "Registro de respaldo creado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear registro de respaldo" });
    }
};