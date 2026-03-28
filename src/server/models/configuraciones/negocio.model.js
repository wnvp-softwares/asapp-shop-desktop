import { DataTypes } from "sequelize";
import { database } from "../../configs/database.js";

export const Negocio = database.define(
    "Negocio",
    {
        id_negocio: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        nombre: {
            type: DataTypes.STRING,
            allowNull: false
        },

        direccion: {
            type: DataTypes.STRING
        },

        telefono: {
            type: DataTypes.STRING
        },

        rfc: {
            type: DataTypes.STRING
        },

        logo: {
            type: DataTypes.STRING
        }
    },
    {
        tableName: "negocios",
        freezeTableName: true,
        timestamps: false
    }
);