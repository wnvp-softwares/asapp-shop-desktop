import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const Categoria = database.define(
    "Categoria",
    {
        id_categoria: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        descripcion: {
            type: DataTypes.STRING(255),
            allowNull: true 
        }
    }, {
    tableName: "categorias",
    freezeTableName: true,
    timestamps: false
});