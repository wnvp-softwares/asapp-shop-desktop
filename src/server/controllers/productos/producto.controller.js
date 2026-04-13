import { Producto } from "../../models/productos/producto.model.js";
import { Categoria } from "../../models/productos/categoria.model.js";

export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({ include: { model: Categoria, as: "categoria" } });
        res.json(productos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener productos" });
    }
};

export const createProducto = async (req, res) => {
    try {
        const { codigo_barras, nombre, id_categoria, precio, stock, stock_minimo, estado } = req.body;
        const imagenUrl = req.file ? `/src/uploads/${req.file.filename}` : null;

        await Producto.create({
            codigo_barras: codigo_barras || null,
            nombre,
            id_categoria: id_categoria || null,
            precio,
            stock: stock || 0,
            stock_minimo: stock_minimo || 5,
            estado: estado, 
            imagen: imagenUrl
        });

        res.json({ message: "Producto creado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear producto." });
    }
};

export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) return res.status(404).json({ message: "Producto no encontrado" });

        const { codigo_barras, nombre, id_categoria, precio, stock, stock_minimo, estado, eliminar_imagen } = req.body;

        producto.codigo_barras = codigo_barras || null;
        producto.nombre = nombre || producto.nombre;
        producto.id_categoria = id_categoria || null;
        producto.precio = precio || producto.precio;
        producto.stock = stock || producto.stock;
        producto.stock_minimo = stock_minimo || producto.stock_minimo;
        
        if (estado) producto.estado = estado;

        if (req.file) {
            producto.imagen = `/src/uploads/${req.file.filename}`;
        } else if (eliminar_imagen === 'true') {
            producto.imagen = null;
        }

        await producto.save();
        res.json({ message: "Producto actualizado correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar producto" });
    }
};

export const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findByPk(id);
        if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
        await producto.destroy();
        res.json({ message: "Producto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "No se puede eliminar un producto con historial de ventas." });
    }
};