import { Categoria } from "../../models/productos/categoria.model.js";

export const getCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll();
        res.json(categorias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener categorías" });
    }
};

export const createCategoria = async (req, res) => {
    try {
        await Categoria.create(req.body);
        res.status(201).json({ message: "Categoría creada" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear categoría" });
    }
};