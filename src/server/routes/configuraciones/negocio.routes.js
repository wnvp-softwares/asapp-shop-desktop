import { Router } from "express";
import { getNegocio, updateNegocio } from "../../controllers/configuraciones/negocio.controller.js";

const router = Router();

router.get("/", getNegocio);
router.put("/", updateNegocio); 

export default router;