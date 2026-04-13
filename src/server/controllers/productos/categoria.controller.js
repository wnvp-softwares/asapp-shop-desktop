import { Categoria } from "../../models/productos/categoria.model.js";
import { Producto } from "../../models/productos/producto.model.js";

// OBTENER TODAS
export const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll({
            include: [{
                model: Producto,
                as: "productos"
            }]
        });

        const categoriasConConteo = categorias.map(cat => {
            return {
                id_categoria: cat.id_categoria,
                nombre: cat.nombre,
                descripcion: cat.descripcion,
                conteo_productos: cat.productos.length 
            };
        });

        res.json(categoriasConConteo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener categorías" });
    }
};

// CREAR
export const createCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        await Categoria.create({ nombre, descripcion });
        res.status(201).json({ message: "Categoría creada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear categoría" });
    }
};

// EDITAR (PUT)
export const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

        const categoria = await Categoria.findByPk(id);
        if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });

        categoria.nombre = nombre || categoria.nombre;
        categoria.descripcion = descripcion !== undefined ? descripcion : categoria.descripcion;

        await categoria.save();
        res.json({ message: "Categoría actualizada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la categoría" });
    }
};

// ELIMINAR (DELETE)
export const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const categoria = await Categoria.findByPk(id);
        
        if (!categoria) return res.status(404).json({ message: "Categoría no encontrada" });

        await categoria.destroy();
        res.json({ message: "Categoría eliminada correctamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "No se puede eliminar porque tiene productos asociados" });
    }
};