import { Producto } from "../../models/productos/producto.model.js";
import { Categoria } from "../../models/productos/categoria.model.js";

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({ include: { model: Categoria, as: "categoria" } });
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
};

export const createProducto = async (req, res) => {
    try {
        await Producto.create(req.body);
        res.json({ message: "Producto creado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear producto" });
    }
};