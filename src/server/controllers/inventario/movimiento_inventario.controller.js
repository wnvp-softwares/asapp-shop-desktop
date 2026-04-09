import { MovimientoInventario } from "../../models/inventario/movimiento_inventario.model.js";
import { Producto } from "../../models/productos/producto.model.js";

export const getMovimientos = async (req, res) => {
    try {
        const movimientos = await MovimientoInventario.findAll({
            include: { model: Producto, as: "producto" },
            order: [["fecha", "DESC"]]
        });
        res.json(movimientos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener movimientos" });
    }
};

export const createMovimiento = async (req, res) => {
    try {
        const { id_producto, tipo, cantidad, referencia } = req.body;
        await MovimientoInventario.create({ id_producto, tipo, cantidad, referencia });

        const producto = await Producto.findByPk(id_producto);
        if (producto) {
            let nuevoStock = producto.stock;
            if (tipo === "entrada") nuevoStock += cantidad;
            else if (tipo === "salida") nuevoStock -= cantidad;
            else if (tipo === "ajuste") nuevoStock = cantidad;

            await producto.update({ stock: nuevoStock });
        }
        res.json({ message: "Movimiento registrado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar movimiento" });
    }
};