import { Usuario } from "../../models/configuraciones/usuario.model.js";
import { Rol } from "../../models/configuraciones/rol.model.js";
import bcrypt from "bcryptjs";

export const getUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({ include: { model: Rol, as: "rol" } });
        res.json(usuarios);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

export const createUsuario = async (req, res) => {
    try {
        const { nombre_completo, usuario, pass, telefono, id_rol, activo } = req.body;

        const hashedPass = await bcrypt.hash(pass, 10);

        await Usuario.create({
            nombre_completo,
            usuario,
            pass: hashedPass,
            telefono,
            id_rol,
            activo
        });

        res.json({ message: "Usuario creado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear usuario. Verifica que el nombre de usuario no esté repetido." });
    }
};

// ===============================
// LOGIN DE USUARIO
// ===============================
export const loginUsuario = async (req, res) => {
    try {
        const { usuario, pass } = req.body;

        const user = await Usuario.findOne({
            where: { usuario },
            include: { model: Rol, as: "rol" }
        });

        if (!user) {
            return res.status(404).json({ message: "El usuario no existe." });
        }

        if (!user.activo) {
            return res.status(401).json({ message: "Este usuario ha sido desactivado." });
        }

        const isMatch = await bcrypt.compare(pass, user.pass);
        if (!isMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        await user.update({ ultimo_acceso: new Date() });

        res.json({
            message: "Login exitoso",
            user: {
                id: user.id_usuario,
                nombre: user.nombre_completo,
                rol: user.rol.nombre
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al intentar iniciar sesión." });
    }
};