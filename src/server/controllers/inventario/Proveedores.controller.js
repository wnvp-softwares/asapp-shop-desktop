const Proveedores = require('../models/proveedores/Proveedores'); 

module.exports = {

  // Lista de proveedores
  getAllProveedores: async (req, res) => {
    try {
      const proveedores = await Proveedores.findAll();
      res.json(proveedores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los proveedores' });
    }
  },

  // Proveedor por ID
  getProveedorById: async (req, res) => {
    const { id } = req.params;
    try {
      const proveedor = await Proveedores.findByPk(id);
      if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });
      res.json(proveedor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el proveedor' });
    }
  },

  // Crear proveedor
  createProveedor: async (req, res) => {
    const { nombre, telefono, correo } = req.body;
    try {
      const nuevoProveedor = await Proveedores.create({ nombre, telefono, correo });
      res.status(201).json(nuevoProveedor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el proveedor' });
    }
  },

  // Actualizar un proveedor
  updateProveedor: async (req, res) => {
    const { id } = req.params;
    const { nombre, telefono, correo } = req.body;
    try {
      const proveedor = await Proveedores.findByPk(id);
      if (!proveedor) return res.status(404).json({ message: 'Proveedor no encontrado' });

      proveedor.nombre = nombre ?? proveedor.nombre;
      proveedor.telefono = telefono ?? proveedor.telefono;
      proveedor.correo = correo ?? proveedor.correo;
      await proveedor.save();

      res.json(proveedor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el proveedor' });
    }
  },

};