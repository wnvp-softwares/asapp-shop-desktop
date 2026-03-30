const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');


router.get('/usuarios', usuarioController.getUsuarios);
router.post('/usuarios', usuarioController.createUsuario);
router.get('/usuarios/:id', usuarioController.getUsuario);
router.put('/usuarios/:id', usuarioController.updateUsuario);

router.post('/login', usuarioController.login);

module.exports = router;