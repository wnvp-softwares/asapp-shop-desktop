const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); 

const Respaldos = sequelize.define('Respaldos', {
  id_respaldo: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  ruta_archivo: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'respaldos',
  timestamps: false
});

module.exports = Respaldos;