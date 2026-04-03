import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const MovimientoInventario = database.define(
    "MovimientoInventario",
  {
    id_movimiento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tipo: {
    type: DataTypes.ENUM('entrada','salida','ajuste'),
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
    type: DataTypes.STRING,
    }
},
{
  tableName: 'movimientos_inventario',
  freezeTableName: true,
  timestamps: false
}
);

import { Producto } from "./Producto.js";

MovimientoInventario.belongsTo(Producto, {
    foreignKey: "id_producto",
    as: "producto"
});

Producto.hasMany(MovimientoInventario, {
    foreignKey: "id_producto",
    as: "movimientos"
});