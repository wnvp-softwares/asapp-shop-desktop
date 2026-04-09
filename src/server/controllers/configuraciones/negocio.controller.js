import { Negocio } from "../../models/configuraciones/negocio.model.js";

export const getNegocio = async (req, res) => {
    try {
        const negocio = await Negocio.findOne();
        if (!negocio) return res.status(404).json({ message: "No hay negocio configurado" });
        res.json(negocio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener negocio" });
    }
};

export const updateNegocio = async (req, res) => {
    try {
        const data = req.body;
        const [updated] = await Negocio.update(data, { where: { id_negocio: 1 } });

        if (updated === 0) {
            await Negocio.create(data);
        }
        res.json({ message: "Datos del negocio guardados correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar negocio" });
    }
};