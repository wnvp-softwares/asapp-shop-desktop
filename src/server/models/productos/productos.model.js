const { DataTypes } = require('sequelize');
const db = require('../config/database');
const Categoria = require('./Categoria'); 

const Producto = db.define('Producto', {
    id_producto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo_barras: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    id_categoria: {
        type: DataTypes.INTEGER,
        references: {
            model: Categoria,
            key: 'id_categoria'
        }
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false
    },
    stock_minimo: {
        type: DataTypes.INTEGER,
        defaultValue: 5,
        allowNull: false
    },
    estado: {
        type: DataTypes.ENUM('activo', 'inactivo'),
        defaultValue: 'activo'
    }
}, {
    tableName: 'productos',
    timestamps: false
});

Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' });

module.exports = Producto;