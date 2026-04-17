import { Compra } from "../../models/compras/compra.model.js";
import { DetalleCompra } from "../../models/compras/detalle_compra.model.js";
import { Proveedor } from "../../models/inventario/proveedor.model.js";
import { database } from "../../configs/database.js";

export const getCompras = async (req, res) => {
    try {
        const compras = await Compra.findAll({
            include: [
                { model: Proveedor, as: 'proveedor' } 
            ],
            order: [['fecha', 'DESC']]
        });
        res.json(compras);
    } catch (error) {
        console.error("Error al obtener compras:", error);
        res.status(500).json({ message: "Error al obtener compras" });
    }
};

export const createCompra = async (req, res) => {
    const t = await database.transaction(); 

    try {
        const { 
            id_proveedor, fecha, total, estado, 
            monto_pagado, monto_deuda, recibido, detalles 
        } = req.body;

        const nuevaCompra = await Compra.create({
            id_proveedor,
            fecha,
            estado,
            monto_pagado,
            monto_deuda,
            recibido,
            total
        }, { transaction: t });

        const detallesParaInsertar = detalles.map(producto => ({
            id_compra: nuevaCompra.id_compra,
            id_producto: producto.id_producto,
            cantidad: producto.cantidad,
            precio_unitario: producto.precio_unitario, 
            subtotal: producto.subtotal
        }));

        await DetalleCompra.bulkCreate(detallesParaInsertar, { transaction: t });

        await t.commit();
        res.status(201).json({ message: "Compra y detalles registrados exitosamente" });

    } catch (error) {
        await t.rollback();
        console.error("Error al crear compra:", error);
        res.status(500).json({ message: "Error interno al registrar la compra" });
    }
};