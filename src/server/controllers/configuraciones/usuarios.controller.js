const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

// Obtener todos
exports.getUsuarios = async (req, res) => {
  const usuarios = await Usuario.findAll({ include: 'rol' });
  res.json(usuarios);
};

// Crear usuario
exports.createUsuario = async (req, res) => {
  try {
    const data = req.body;

    data.pass = await bcrypt.hash(data.pass, 10);

    const usuario = await Usuario.create(data);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener uno
exports.getUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id, { include: 'rol' });

  if (!usuario) {
    return res.status(404).json({ error: 'No encontrado' });
  }

  res.json(usuario);
};

// Actualizar
exports.updateUsuario = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);

  if (!usuario) {
    return res.status(404).json({ error: 'No encontrado' });
  }

  const data = req.body;

  if (data.pass) {
    data.pass = await bcrypt.hash(data.pass, 10);
  }

  await usuario.update(data);
  res.json(usuario);
};

// Eliminar
exports.deleteUsuario = async (req, res) => {
  await Usuario.destroy({ where: { id_usuario: req.params.id } });
  res.json({ mensaje: 'Usuario eliminado' });
};

// Login
exports.login = async (req, res) => {
  const { usuario, pass } = req.body;

  const user = await Usuario.findOne({ where: { usuario } });

  if (!user) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  const valid = await bcrypt.compare(pass, user.pass);

  if (!valid) {
    return res.status(401).json({ error: 'Credenciales incorrectas' });
  }

  res.json(user);
};
