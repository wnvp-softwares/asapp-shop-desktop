import Categoria from "../../models/categorias.js";

const { Categoria } = Categoria;

// Obtener Categorias
export const getCategorias = async (req, res) => {
    const categorias = await Categoria.findAll();
    res.json(categorias);
};

// Obtener una por ID
export const getCategoria = async (req, res) => {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
        return res.status(404).json({ error: "Categoría no encontrada" });
    }

    res.json(categoria);
};

// Crear
export const createCategoria = async (req, res) => {
    try {
        const categoria = await Categoria.create(req.body);
        res.status(201).json(categoria);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar
export const updateCategoria = async (req, res) => {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
        return res.status(404).json({ error: "Categoría no encontrada" });
    }

    await categoria.update(req.body);

    res.json(categoria);
};
