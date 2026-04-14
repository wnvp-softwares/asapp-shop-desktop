import { Router } from "express";
import { getNegocio, updateNegocio } from "../../controllers/configuraciones/negocio.controller.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/negocio'); 
    },
    filename: function (req, file, cb) {
        cb(null, 'logo_' + Date.now() + path.extname(file.originalname));
    }
});

const uploadLogo = multer({ storage: storage });
const router = Router();

router.get("/", getNegocio);
router.put("/", uploadLogo.single('logo'), updateNegocio); 

export default router;