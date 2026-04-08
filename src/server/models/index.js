import { database } from "./configs/database.js";


import { Negocio } from "./models/negocios.js";
import { Rol } from "./models/roles.js";
import { Usuario } from "./models/usuarios.js";
import { Categoria } from "./models/categorias.js";
import { Producto } from "./models/productos.js";
import { Proveedor } from "./models/proveedores.js";
import { Compra } from "./models/Compra.js";
import { DetalleCompra } from "./models/DetalleCompra.js";
import { Venta } from "./models/Venta.js";
import { DetalleVenta } from "./models/DetalleVenta.js";
import { MovimientoInventario } from "./models/MovimientoInventario.js";
import { Respaldo } from "./models/Respaldo.js";


const iniciarServidor = async () => {
    try {
        await database.authenticate();
        console.log("Conexión a la base de datos exitosa");

        await database.sync();
        console.log("Tablas sincronizadas");

        console.log(" Servidor listo");

    } catch (error) {
        console.error(" Error al iniciar:", error);
    }
};

// 🔹 Ejecutar
iniciarServidor();