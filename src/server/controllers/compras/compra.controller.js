import { Compra } from "../../models/compras/compra.model.js";
import { DetalleCompra } from "../../models/compras/detalle_compra.model.js";
import { Proveedor } from "../../models/inventario/proveedor.model.js";
import { Producto } from "../../models/productos/producto.model.js";

export const getCompras = async (req, res) => {
    try {
        const compras = await Compra.findAll({
            include: [{ model: Proveedor, as: "proveedor" }, { model: DetalleCompra, as: "detalles" }],
            order: [["fecha", "DESC"]]
        });
        res.json(compras);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener compras" });
    }
};

export const createCompra = async (req, res) => {
    try {
        const { id_proveedor, total, detalles } = req.body;
        const compra = await Compra.create({ id_proveedor, total });

        if (detalles && detalles.length > 0) {
            for (const item of detalles) {
                await DetalleCompra.create({
                    id_compra: compra.id_compra,
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    costo: item.costo
                });

                const producto = await Producto.findByPk(item.id_producto);
                if (producto) {
                    await producto.update({ stock: producto.stock + item.cantidad });
                }
            }
        }
        res.json({ message: "Compra registrada y stock actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar compra" });
    }
};