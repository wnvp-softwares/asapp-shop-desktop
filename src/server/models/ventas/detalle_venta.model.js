import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";
import { Venta } from "./venta.model.js";
import { Producto } from "../productos/producto.model.js";

export const DetalleVenta = database.define(
  "DetalleVenta",
  {
    id_detalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    precio_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
  tableName: "detalle_ventas",
  freezeTableName: true,
  timestamps: false
});