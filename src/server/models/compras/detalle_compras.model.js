import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const DetalleCompra = database.define(
    "DetalleCompra",
    {
     id_detalle: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_compra: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  costo: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  }
},
 {
  tableName: 'detalle_compras',
  freezeTableName: true,
  timestamps: false
});

import { Compra } from "./Compra.js";
import { Producto } from "./Producto.js";

DetalleCompra.belongsTo(Compra, {
    foreignKey: "id_compra",
    as: "compra"
});

DetalleCompra.belongsTo(Producto, {
    foreignKey: "id_producto",
    as: "producto"
});

Compra.hasMany(DetalleCompra, {
    foreignKey: "id_compra",
    as: "detalles"
});

Producto.hasMany(DetalleCompra, {
    foreignKey: "id_producto",
    as: "detalles_compra"
});