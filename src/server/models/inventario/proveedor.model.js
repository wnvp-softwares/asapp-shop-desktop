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
        },
        dias_entrega: {
            type: DataTypes.TEXT
        },
        activo: {
            type: DataTypes.TINYINT(1),
            defaultValue: 1
        },
        fecha_registro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
    tableName: "proveedores",
    freezeTableName: true,
    timestamps: false
});