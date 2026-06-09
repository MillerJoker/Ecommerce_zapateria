import { Router } from "express";
import {crearSocio, obtenerSociosActivos, actualizarSocio, deshabilitarSocio} from "../controller/socios_controller.js";
import { asyncHandler } from "../middleware/avanzado.js";

const router = Router();
router.post("/", asyncHandler(crearSocio));
router.get("/", asyncHandler(obtenerSociosActivos));
router.put("/:id", asyncHandler(actualizarSocio));
router.delete("/:id", asyncHandler(deshabilitarSocio));

export default router;