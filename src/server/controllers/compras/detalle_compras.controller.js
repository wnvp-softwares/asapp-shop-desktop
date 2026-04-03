import { Compra } from "../../models/compra.model.js";
import { Proveedor } from "../../models/proveedor.model.js";
import { DetalleCompra } from "../../models/detalle_compra.model.js";

// ===============================
// OBTENER TODAS LAS COMPRAS
// ===============================
export const getCompras = async (req, res) => {
    try {
        const compras = await Compra.findAll({
            include: [
                { model: Proveedor, as: "proveedor" },
                { model: DetalleCompra, as: "detalles" }
            ],
            order: [["fecha", "DESC"]]
        });

        if (!compras || compras.length === 0) {
            return res.status(404).json({ message: "No hay compras" });
        }

        res.json(compras);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener compras" });
    }
};

// ===============================
// OBTENER COMPRA POR ID
// ===============================
export const getCompraById = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await Compra.findOne({
            where: { id_compra: id },
            include: [
                { model: Proveedor, as: "proveedor" },
                { model: DetalleCompra, as: "detalles" }
            ]
        });

        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        res.json(compra);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la compra" });
    }
};

// ===============================
// CREAR COMPRA
// ===============================
export const createCompra = async (req, res) => {
    try {
        const { id_proveedor, total, detalles } = req.body;

        const compra = await Compra.create({ id_proveedor, total });

        // Crear detalles de compra si existen
        if (detalles && detalles.length > 0) {
            for (const item of detalles) {
                await DetalleCompra.create({
                    id_compra: compra.id_compra,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    costo: item.costo
                });
            }
        }

        res.json({ message: "Compra creada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear compra" });
    }
};

// ===============================
// ACTUALIZAR COMPRA
// ===============================
export const updateCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_proveedor, total } = req.body;

        await Compra.update({ id_proveedor, total }, { where: { id_compra: id } });

        res.json({ message: "Compra actualizada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar compra" });
    }
};