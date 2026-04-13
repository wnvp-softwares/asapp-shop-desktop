import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads'); 
    },
    filename: function (req, file, cb) {
        const sufijoUnico = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'prod_' + sufijoUnico + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('El archivo no es una imagen válida.'), false);
    }
};

export const uploadImagenProducto = multer({ storage: storage, fileFilter: fileFilter });