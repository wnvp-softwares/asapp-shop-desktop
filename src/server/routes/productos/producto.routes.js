import { Router } from "express";
import { getProductos, createProducto, updateProducto, deleteProducto } from "../../controllers/productos/producto.controller.js";
import { uploadImagenProducto } from "../../configs/multer.js"; 

const router = Router();

router.get("/", getProductos);
router.post("/", uploadImagenProducto.single('imagen'), createProducto);
router.put("/:id", uploadImagenProducto.single('imagen'), updateProducto);
router.delete("/:id", deleteProducto);

export default router;