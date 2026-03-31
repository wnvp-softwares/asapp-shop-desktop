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
            type: DataTypes.STRING,
            allowNull: false
        },


        telefono: {
            type: DataTypes.STRING
        },

        correo: {
            type: DataTypes.STRING
        },

    },
    {
        tableName: "proveedores",
        freezeTableName: true,
        timestamps: false
    }
);