import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const Producto = database.define(
    "Producto",
    {
        id_producto: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        codigo_barras: {
            type: DataTypes.STRING(50),
            unique: true
        },
        nombre: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        imagen: {
            type: DataTypes.STRING(255)
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
            allowNull: false,
            defaultValue: 0
        },
        stock_minimo: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5
        },
        estado: {
            type: DataTypes.ENUM('activo', 'inactivo'),
            defaultValue: 'activo'
        }
    }, {
    tableName: "productos",
    freezeTableName: true,
    timestamps: false
});