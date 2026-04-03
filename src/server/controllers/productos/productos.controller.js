import { Producto } from "../../models/producto.model.js";
import { Categoria } from "../../models/categoria.model.js";

// ===============================
// OBTENER TODOS LOS PRODUCTOS
// ===============================
export const getProductos = async (req, res) => {
    try {
        const productos = await Producto.findAll({
            include: {
                model: Categoria,
                as: "categoria"
            }
        });

        if (!productos || productos.length === 0) {
            return res.status(404).json({ message: "No hay productos" });
        }

        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener productos" });
    }
};

// ===============================
// OBTENER PRODUCTO POR ID
// ===============================
export const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Producto.findOne({
            where: { id_producto: id },
            include: { model: Categoria, as: "categoria" }
        });

        if (!producto) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        res.json(producto);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el producto" });
    }
};

// ===============================
// CREAR PRODUCTO
// ===============================
export const createProducto = async (req, res) => {
    try {
        const data = req.body;

        await Producto.create(data);

        res.json({ message: "Producto creado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear producto" });
    }
};

// ===============================
// ACTUALIZAR PRODUCTO
// ===============================
export const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        await Producto.update(data, {
            where: { id_producto: id }
        });

        res.json({ message: "Producto actualizado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar producto" });
    }
};