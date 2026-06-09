import {Router} from "express";
import { obtenerLibros,crearLibro,cambiarPrestamo,eliminarLibroFisico} from "../controller/libros_controller.js";
import { validarCampos,asyncHandler } from "../middleware/avanzado.js";

const router = Router();

router.get("/", asyncHandler(obtenerLibros));
router.post("/", asyncHandler(crearLibro));
router.put("/:id/prestamo", asyncHandler(cambiarPrestamo));
router.delete("/:id", asyncHandler(eliminarLibroFisico));

export default router;