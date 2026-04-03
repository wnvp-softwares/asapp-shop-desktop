import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

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
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  },
 {
    tableName: 'usuarios',
    freezeTableName: true,
    timestamps: false
  });