import { Usuario } from "../../models/usuario.model.js";
import { Rol } from "../../models/rol.model.js";
import bcrypt from "bcrypt";

// ===============================
// OBTENER TODOS LOS USUARIOS
// ===============================
export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            include: {
                model: Rol,
                as: "rol"
            }
        });

        if (!usuarios || usuarios.length === 0) {
            return res.status(404).json({ message: "No hay usuarios" });
        }

        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

// ===============================
// OBTENER USUARIO POR ID
// ===============================
export const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findOne({
            where: { id_usuario: id },
            include: { model: Rol, as: "rol" }
        });

        if (!usuario) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        res.json(usuario);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario" });
    }
};

// ===============================
// CREAR USUARIO
// ===============================
export const createUsuario = async (req, res) => {
    try {
        const { nombre_completo, usuario, pass, id_rol, activo } = req.body;

        // Encriptar contraseña
        const hashedPass = await bcrypt.hash(pass, 10);

        await Usuario.create({
            nombre_completo,
            usuario,
            pass: hashedPass,
            id_rol,
            activo
        });

        res.json({ message: "Usuario creado" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear usuario" });
    }
};