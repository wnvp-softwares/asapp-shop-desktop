const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 
const Compra = require('./Compra');
const Producto = require('./Producto');

const DetalleCompra = sequelize.define('DetalleCompra', {
  id_detalle: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_compra: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Compra,
      key: 'id_compra'
    }
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id_producto'
    }
  },
  cantidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  costo: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false,
  }
}, {
  tableName: 'detalle_compras',
  timestamps: false
});

DetalleCompra.belongsTo(Compra, { foreignKey: 'id_compra' });
DetalleCompra.belongsTo(Producto, { foreignKey: 'id_producto' });

module.exports = DetalleCompra;