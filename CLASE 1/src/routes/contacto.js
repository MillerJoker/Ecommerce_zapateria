import { Router } from "express";
import { crearContacto } from "../controllers/contacto_controller.js";
import { validarCampos, asynHandler } from "../middlewares/avanzado.js";

const router = Router();

router.post(
    "/crearContacto", 
    validarCampos(["nombre_completo", "email", "comentario"]), 
    asynHandler(crearContacto)
);

export default router;