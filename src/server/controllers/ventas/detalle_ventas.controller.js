import { DetalleVenta } from "../../models/detalle_venta.model.js";
import { Venta } from "../../models/venta.model.js";
import { Producto } from "../../models/producto.model.js";

// ===============================
// OBTENER TODOS LOS DETALLES DE VENTA
// ===============================
export const getDetalleVentas = async (req, res) => {
    try {
        const detalles = await DetalleVenta.findAll({
            include: [
                { model: Venta, as: "venta" },
                { model: Producto, as: "producto" }
            ]
        });

        if (!detalles || detalles.length === 0) {
            return res.status(404).json({ message: "No hay detalles de venta" });
        }

        res.json(detalles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener detalles de venta" });
    }
};

// ===============================
// OBTENER DETALLE POR ID
// ===============================
export const getDetalleVentaById = async (req, res) => {
    try {
        const { id } = req.params;
        const detalle = await DetalleVenta.findOne({
            where: { id_detalle: id },
            include: [
                { model: Venta, as: "venta" },
                { model: Producto, as: "producto" }
            ]
        });

        if (!detalle) {
            return res.status(404).json({ message: "Detalle no encontrado" });
        }

        res.json(detalle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener detalle de venta" });
    }
};

// ===============================
// CREAR DETALLE DE VENTA
// ===============================
export const createDetalleVenta = async (req, res) => {
    try {
        const { id_venta, id_producto, cantidad, precio_unitario, subtotal } = req.body;

        const detalle = await DetalleVenta.create({
            id_venta,
            id_producto,
            cantidad,
            precio_unitario,
            subtotal
        });

        // Opcional: actualizar stock del producto
        const producto = await Producto.findByPk(id_producto);
        if (producto) {
            await producto.update({ stock: producto.stock - cantidad });
        }

        res.json({ message: "Detalle de venta creado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear detalle de venta" });
    }
};

// ===============================
// ACTUALIZAR DETALLE DE VENTA
// ===============================
export const updateDetalleVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_producto, cantidad, precio_unitario, subtotal } = req.body;

        const detalle = await DetalleVenta.findByPk(id);
        if (!detalle) return res.status(404).json({ message: "Detalle no encontrado" });

        // Opcional: ajustar stock si cambia la cantidad
        if (cantidad !== detalle.cantidad) {
            const producto = await Producto.findByPk(id_producto);
            if (producto) {
                const diferencia = cantidad - detalle.cantidad;
                await producto.update({ stock: producto.stock - diferencia });
            }
        }

        await DetalleVenta.update(
            { id_producto, cantidad, precio_unitario, subtotal },
            { where: { id_detalle: id } }
        );

        res.json({ message: "Detalle de venta actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar detalle de venta" });
    }
};