import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";
import { Usuario } from "../../models/configuraciones/usuario.model.js";

export const Venta = database.define(
  "Venta",
  {
    id_venta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    metodo_pago: {
      type: DataTypes.ENUM('efectivo', 'tarjeta', 'transferencia'),
      defaultValue: 'efectivo'
    },
    pago_con: {
      type: DataTypes.DECIMAL(10, 2)
    },
    cambio: {
      type: DataTypes.DECIMAL(10, 2)
    },
    descuento: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
  tableName: "ventas",
  freezeTableName: true,
  timestamps: false
});