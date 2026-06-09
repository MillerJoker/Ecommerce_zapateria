import { Router } from "express";
import { obtenerProductos,crearProducto,actualizarProducto,eliminarProducto,obtenerProductosbyId } from "../controllers/productos_controller.js";
import { validarCampos, asynHandler } from "../middlewares/avanzado.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.get("/",asynHandler(obtenerProductos));
router.get("/:id",asynHandler(obtenerProductosbyId));
router.post("/",
verifyToken,
validarCampos(["categoria_id","nombre","descripcion","precio","stock"]),
asynHandler(crearProducto)
)

router.put("/:id",asynHandler(actualizarProducto));
router.delete("/:id",asynHandler(eliminarProducto));


export default router;
