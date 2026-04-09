import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";
import { Rol } from "../../models/configuraciones/rol.model.js";

export const Usuario = database.define(
  "Usuario",
  {
    id_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre_completo: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    pass: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    ultimo_acceso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
  tableName: "usuarios",
  freezeTableName: true,
  timestamps: false
});