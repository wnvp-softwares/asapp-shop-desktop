import { Compra } from "../../models/compras/compra.model.js";
import { DetalleCompra } from "../../models/compras/detalle_compra.model.js";
import { Proveedor } from "../../models/inventario/proveedor.model.js";
import { Producto } from "../../models/productos/producto.model.js";
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

export const marcarComoRecibida = async (req, res) => {
    const t = await database.transaction();

    try {
        const { id } = req.params;

        const compra = await Compra.findByPk(id);

        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        if (compra.recibido === 1 || compra.recibido === true) {
            return res.status(400).json({ message: "La compra ya fue ingresada al inventario anteriormente" });
        }

        compra.recibido = 1;
        await compra.save({ transaction: t });

        const detalles = await DetalleCompra.findAll({ where: { id_compra: id } });

        for (let detalle of detalles) {
            const producto = await Producto.findByPk(detalle.id_producto);
            
            if (producto) {
                producto.stock = (producto.stock || 0) + detalle.cantidad;
                await producto.save({ transaction: t });
            }
        }

        await t.commit();
        res.json({ message: "Compra recibida e inventario actualizado correctamente" });

    } catch (error) {
        await t.rollback();
        console.error("Error al procesar la llegada de la compra:", error);
        res.status(500).json({ message: "Error interno al actualizar el inventario" });
    }
};