import { Router } from "express";
import { obtenerCategorias,crearCategoria,actualizarCategoria,eliminarCategoria } from "../controllers/categoria_controller.js";
import { validarCampos,asynHandler } from "../middlewares/avanzado.js";

const router = Router();

router.get("/obtenerCategorias", asynHandler(obtenerCategorias));
router.post("/crearCategoria", validarCampos(["nombre_categoria"]), asynHandler(crearCategoria));
router.put("/actualizarCategoria/:id", validarCampos(["nombre_categoria"]), asynHandler(actualizarCategoria));
router.delete("/eliminarCategoria/:id", asynHandler(eliminarCategoria));


export default router;