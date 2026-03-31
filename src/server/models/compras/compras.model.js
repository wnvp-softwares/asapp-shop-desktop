import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const Compra = database.define(
    "Compra",
    {
       
         id_compra: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

         id_proveedor: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

          fecha: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        total: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        }

    },
    {
        tableName: "compras",
        freezeTableName: true,
        timestamps: false
    }
);