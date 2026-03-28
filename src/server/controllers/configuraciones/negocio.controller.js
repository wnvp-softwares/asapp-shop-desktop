import { Negocio } from "../../models/negocio.model.js";

// ===============================
// OBTENER NEGOCIO
// ===============================
export const getNegocio = async (req, res) => {
    try {
        const negocio = await Negocio.findOne();

        if (!negocio) {
            return res.status(404).json({ message: "No hay negocio" });
        }

        res.json(negocio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener negocio" });
    }
};

// ===============================
// CREAR NEGOCIO
// ===============================
export const createNegocio = async (req, res) => {
    try {
        const data = req.body;

        await Negocio.create(data);

        res.json({ message: "Negocio creado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear negocio" });
    }
};

// ===============================
// ACTUALIZAR NEGOCIO
// ===============================
export const updateNegocio = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await Negocio.update(data, {
            where: { id_negocio: id }
        });

        res.json({ message: "Negocio actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar negocio" });
    }
};