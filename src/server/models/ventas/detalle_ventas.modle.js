import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const DetalleVenta = database.define(
    "DetalleVenta",
  {
    id_detalle: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_venta: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  },
  subtotal: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, 
{
  tableName: 'detalle_ventas',
  freezeTableName: true,
  timestamps: false
});

import { Venta } from "./Venta.js";
import { Producto } from "./Producto.js";

DetalleVenta.belongsTo(Venta, {
    foreignKey: "id_venta",
    as: "venta"
});

DetalleVenta.belongsTo(Producto, {
    foreignKey: "id_producto",
    as: "producto"
});

Venta.hasMany(DetalleVenta, {
    foreignKey: "id_venta",
    as: "detalles"
});

Producto.hasMany(DetalleVenta, {
    foreignKey: "id_producto",
    as: "detalles_venta"
});