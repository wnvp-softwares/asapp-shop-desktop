import { MovimientoInventario } from "../../models/movimiento_inventario.model.js";
import { Producto } from "../../models/producto.model.js";

// ===============================
// OBTENER TODOS LOS MOVIMIENTOS
// ===============================
export const getMovimientosInventario = async (req, res) => {
    try {
        const movimientos = await MovimientoInventario.findAll({
            include: { model: Producto, as: "producto" },
            order: [["fecha", "DESC"]]
        });

        if (!movimientos || movimientos.length === 0) {
            return res.status(404).json({ message: "No hay movimientos de inventario" });
        }

        res.json(movimientos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener movimientos de inventario" });
    }
};

// ===============================
// OBTENER MOVIMIENTO POR ID
// ===============================
export const getMovimientoInventarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const movimiento = await MovimientoInventario.findOne({
            where: { id_movimiento: id },
            include: { model: Producto, as: "producto" }
        });

        if (!movimiento) {
            return res.status(404).json({ message: "Movimiento no encontrado" });
        }

        res.json(movimiento);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener movimiento de inventario" });
    }
};

// ===============================
// CREAR MOVIMIENTO DE INVENTARIO
// ===============================
export const createMovimientoInventario = async (req, res) => {
    try {
        const { id_producto, tipo, cantidad, referencia } = req.body;

        // Crear movimiento
        const movimiento = await MovimientoInventario.create({
            id_producto,
            tipo,
            cantidad,
            referencia
        });

        // Actualizar stock del producto según tipo
        const producto = await Producto.findByPk(id_producto);
        if (producto) {
            let nuevoStock = producto.stock;
            if (tipo === "entrada") nuevoStock += cantidad;
            else if (tipo === "salida") nuevoStock -= cantidad;
            // Ajuste puede ser positivo o negativo
            else if (tipo === "ajuste") nuevoStock = producto.stock + cantidad;

            await producto.update({ stock: nuevoStock });
        }

        res.json({ message: "Movimiento de inventario registrado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear movimiento de inventario" });
    }
};