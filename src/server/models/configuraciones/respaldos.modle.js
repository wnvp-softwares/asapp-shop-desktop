import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const Respaldo = database.define(
    "Respaldo",
  {
     id_respaldo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ruta_archivo: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'respaldos',
  freezeTableName: true,
  timestamps: false 
});