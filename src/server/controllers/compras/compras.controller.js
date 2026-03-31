const Compras = require('../models/compras/Compras'); 
const Proveedores = require('../models/proveedores/Proveedores'); 

module.exports = {

  // Listar todas las compras
  getAllCompras: async (req, res) => {
    try {
      const compras = await Compras.findAll({
        include: [{ model: Proveedores }] 
      });
      res.json(compras);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las compras' });
    }
  },

  // Obtener una compra por ID
  getCompraById: async (req, res) => {
    const { id } = req.params;
    try {
      const compra = await Compras.findByPk(id, {
        include: [{ model: Proveedores }]
      });
      if (!compra) return res.status(404).json({ message: 'Compra no encontrada' });
      res.json(compra);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener la compra' });
    }
  },

  // Crear una nueva compra
  createCompra: async (req, res) => {
    const { id_proveedor, total } = req.body;
    try {
      const nuevaCompra = await Compras.create({ id_proveedor, total });
      res.status(201).json(nuevaCompra);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la compra' });
    }
  },

  // Actualizar una compra
  updateCompra: async (req, res) => {
    const { id } = req.params;
    const { id_proveedor, total } = req.body;
    try {
      const compra = await Compras.findByPk(id);
      if (!compra) return res.status(404).json({ message: 'Compra no encontrada' });

      compra.id_proveedor = id_proveedor ?? compra.id_proveedor;
      compra.total = total ?? compra.total;
      await compra.save();

      res.json(compra);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar la compra' });
    }
  },

};