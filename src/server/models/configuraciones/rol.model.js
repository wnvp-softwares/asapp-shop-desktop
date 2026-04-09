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
            type: DataTypes.STRING(50),
            allowNull: false
        }
    }, {
    tableName: "roles",
    freezeTableName: true,
    timestamps: false
});