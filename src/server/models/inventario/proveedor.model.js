import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const Proveedor = database.define(
    "Proveedor",
    {
        id_proveedor: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        telefono: {
            type: DataTypes.STRING(20)
        },
        correo: {
            type: DataTypes.STRING(100)
        }
    }, {
    tableName: "proveedores",
    freezeTableName: true,
    timestamps: false
});