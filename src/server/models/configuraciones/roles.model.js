import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const Rol = database.define(
    "Rol",
    {
        id_rol: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
        
    {
        tableName: "roles",
        freezeTableName: true,
        timestamps: false
    }
);