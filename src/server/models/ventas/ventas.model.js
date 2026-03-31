const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); 
const Usuario = require('../usuarios/Usuario'); 

const Venta = sequelize.define('Venta', {
  id_venta: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  metodo_pago: {
    type: DataTypes.ENUM('efectivo','tarjeta','transferencia'),
    defaultValue: 'efectivo'
  },
  pago_con: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  cambio: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: true
  },
  descuento: {
    type: DataTypes.DECIMAL(10,2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10,2),
    allowNull: false
  }
}, {
  tableName: 'ventas',
  timestamps: false
});

Venta.belongsTo(Usuario, { foreignKey: 'id_usuario' });

module.exports = Venta;