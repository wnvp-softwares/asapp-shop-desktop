import { Venta } from "../../models/venta.model.js";
import { Usuario } from "../../models/usuario.model.js";
import { DetalleVenta } from "../../models/detalle_venta.model.js";

// ===============================
// OBTENER TODAS LAS VENTAS
// ===============================
export const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [
                { model: Usuario, as: "usuario" },
                { model: DetalleVenta, as: "detalles" }
            ],
            order: [["fecha", "DESC"]]
        });

        if (!ventas || ventas.length === 0) {
            return res.status(404).json({ message: "No hay ventas" });
        }

        res.json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener ventas" });
    }
};

// ===============================
// OBTENER VENTA POR ID
// ===============================
export const getVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const venta = await Venta.findOne({
            where: { id_venta: id },
            include: [
                { model: Usuario, as: "usuario" },
                { model: DetalleVenta, as: "detalles" }
            ]
        });

        if (!venta) {
            return res.status(404).json({ message: "Venta no encontrada" });
        }

        res.json(venta);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener la venta" });
    }
};

// ===============================
// CREAR VENTA
// ===============================
export const createVenta = async (req, res) => {
    try {
        const { id_usuario, metodo_pago, pago_con, cambio, descuento, total, detalles } = req.body;

        const venta = await Venta.create({
            id_usuario,
            metodo_pago,
            pago_con,
            cambio,
            descuento,
            total
        });

        // Crear detalles de venta
        if (detalles && detalles.length > 0) {
            for (const item of detalles) {
                await DetalleVenta.create({
                    id_venta: venta.id_venta,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.subtotal
                });
            }
        }

        res.json({ message: "Venta creada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear venta" });
    }
};