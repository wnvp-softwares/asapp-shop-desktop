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
            type: DataTypes.STRING(100),
            allowNull: false
        },
        direccion: {
            type: DataTypes.STRING(255)
        },
        telefono: {
            type: DataTypes.STRING(20)
        },
        rfc: {
            type: DataTypes.STRING(20)
        },
        logo: {
            type: DataTypes.STRING(255)
        },
        moneda: {
            type: DataTypes.STRING(10),
            defaultValue: 'MXN'
        },
        impresora_ip: {
            type: DataTypes.STRING(50)
        },
        modo_oscuro: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        color_primario: {
            type: DataTypes.STRING(20),
            defaultValue: '#00a86b'
        }
    }, {
    tableName: "negocios",
    freezeTableName: true,
    timestamps: false
});