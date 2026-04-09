import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";
import { Producto } from "../../models/productos/producto.model.js";

export const MovimientoInventario = database.define(
  "MovimientoInventario",
  {
    id_movimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    tipo: {
      type: DataTypes.ENUM('entrada', 'salida', 'ajuste'),
      allowNull: false
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    referencia: {
      type: DataTypes.STRING(100)
    }
  }, {
  tableName: "movimientos_inventario",
  freezeTableName: true,
  timestamps: false
});