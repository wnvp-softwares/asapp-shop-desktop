const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); 
const Producto = require('../productos/Producto'); 

const MovimientosInventario = sequelize.define('MovimientosInventario', {
  id_movimiento: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Producto,
      key: 'id_producto'
    }
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
    type: DataTypes.STRING(100),
    allowNull: true
  }
},
 {
  tableName: 'movimientos_inventario',
  timestamps: false
});


MovimientosInventario.belongsTo(Producto, { foreignKey: 'id_producto' });

module.exports = MovimientosInventario;