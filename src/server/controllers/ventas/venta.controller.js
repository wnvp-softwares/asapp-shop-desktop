import { Venta } from "../../models/ventas/venta.model.js";
import { DetalleVenta } from "../../models/ventas/detalle_venta.model.js";
import { Usuario } from "../../models/configuraciones/usuario.model.js";
import { Producto } from "../../models/productos/producto.model.js";

export const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.findAll({
            include: [ { model: Usuario, as: "usuario" }, { model: DetalleVenta, as: "detalles" } ],
            order: [["fecha", "DESC"]]
        });
        res.json(ventas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener ventas" });
    }
};

export const createVenta = async (req, res) => {
    try {
        const { id_usuario, metodo_pago, pago_con, cambio, descuento, total, detalles } = req.body;
        const venta = await Venta.create({ id_usuario, metodo_pago, pago_con, cambio, descuento, total });

        if (detalles && detalles.length > 0) {
            for (const item of detalles) {
                await DetalleVenta.create({
                    id_venta: venta.id_venta,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.subtotal
                });

                const producto = await Producto.findByPk(item.id_producto);
                if (producto) {
                    await producto.update({ stock: producto.stock - item.cantidad });
                }
            }
        }
        res.json({ message: "Venta realizada y stock descontado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al procesar la venta" });
    }
};