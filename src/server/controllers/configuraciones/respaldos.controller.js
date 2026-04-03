import { Respaldo } from "../../models/respaldo.model.js";

// ===============================
// OBTENER TODOS LOS RESPALDOS
// ===============================
export const getRespaldos = async (req, res) => {
    try {
        const respaldos = await Respaldo.findAll({
            order: [["fecha", "DESC"]]
        });

        if (!respaldos || respaldos.length === 0) {
            return res.status(404).json({ message: "No hay respaldos" });
        }

        res.json(respaldos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener respaldos" });
    }
};

// ===============================
// OBTENER RESPALDO POR ID
// ===============================
export const getRespaldoById = async (req, res) => {
    try {
        const { id } = req.params;
        const respaldo = await Respaldo.findOne({ where: { id_respaldo: id } });

        if (!respaldo) {
            return res.status(404).json({ message: "Respaldo no encontrado" });
        }

        res.json(respaldo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener respaldo" });
    }
};

// ===============================
// CREAR RESPALDO
// ===============================
export const createRespaldo = async (req, res) => {
    try {
        const { ruta_archivo } = req.body;

        await Respaldo.create({ ruta_archivo });

        res.json({ message: "Respaldo creado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear respaldo" });
    }
};

// ===============================
// ACTUALIZAR RESPALDO
// ===============================
export const updateRespaldo = async (req, res) => {
    try {
        const { id } = req.params;
        const { ruta_archivo } = req.body;

        await Respaldo.update({ ruta_archivo }, { where: { id_respaldo: id } });

        res.json({ message: "Respaldo actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar respaldo" });
    }
};