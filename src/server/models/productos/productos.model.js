
import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const Producto = database.define(
    "Producto",
    {
    id_producto: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    codigo_barras: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagen: {
        type: DataTypes.STRING,
    },
    id_categoria: {
        type: DataTypes.INTEGER
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
    frezeeTableName,
    timestamps: false
});

import { Categoria } from "./Categoria.js";

Producto.belongsTo(Categoria, {
    foreignKey: "id_categoria",
    as: "categoria"
});

Categoria.hasMany(Producto, {
    foreignKey: "id_categoria",
    as: "productos"
});