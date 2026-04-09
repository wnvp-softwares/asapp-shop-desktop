import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";
import { Compra } from "../../models/compras/compra.model.js";
import { Producto } from "../../models/productos/producto.model.js";

export const DetalleCompra = database.define(
  "DetalleCompra",
  {
    id_detalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_compra: {
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
    costo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    }
  }, {
  tableName: "detalle_compras",
  freezeTableName: true,
  timestamps: false
});