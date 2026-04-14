import { Negocio } from "../../models/configuraciones/negocio.model.js";

export const getNegocio = async (req, res) => {
    try {
        const negocio = await Negocio.findOne();
        res.json(negocio || {}); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener negocio" });
    }
};

export const updateNegocio = async (req, res) => {
    try {
        const { 
            nombre, direccion, telefono, rfc, 
            moneda, impresora_ip, modo_oscuro, color_primario 
        } = req.body;
        
        let negocio = await Negocio.findOne();

        const dataToSave = {
            nombre: nombre || "Mi Negocio POS",
            direccion: direccion || "",
            telefono: telefono || "",
            rfc: rfc || "",
            moneda: moneda || 'MXN',
            impresora_ip: impresora_ip || null,
            modo_oscuro: modo_oscuro === 'true' || modo_oscuro === true,
            color_primario: color_primario || '#00a86b'
        };

        if (req.file) {
            dataToSave.logo = `/src/uploads/negocio/${req.file.filename}`;
        }

        if (negocio) {
            await negocio.update(dataToSave);
        } else {
            await Negocio.create(dataToSave);
        }

        res.json({ message: "Configuraciones guardadas correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la configuración" });
    }
};