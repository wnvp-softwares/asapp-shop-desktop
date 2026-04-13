import express from "express";
import dotenv from "dotenv";

dotenv.config();

import apiRoutes from "./routes/index.routes.js"; 

import { database } from "./configs/database.js";

import "./models/index.model.js"; 

const app = express();

app.use(express.json());
app.use('/src/uploads', express.static('src/uploads'));

app.use("/api", apiRoutes);

// ===================================================================
// INICIALIZACIÓN DEL SERVIDOR Y BASE DE DATOS
// ===================================================================
const iniciarServidor = async () => {
    try {
        await database.authenticate();
        console.log("Conexión a la base de datos exitosa");

        await database.sync();
        console.log("Tablas y relaciones sincronizadas correctamente");

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
    }
};

iniciarServidor();