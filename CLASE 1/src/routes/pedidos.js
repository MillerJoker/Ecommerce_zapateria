import { Router } from "express";
import { realizarPedido, obtenerPedidos, actualizarPedido, eliminarPedido } from "../controllers/pedidos_controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/realizarPedido",verifyToken, realizarPedido);
router.get("/obtenerPedidos",verifyToken, obtenerPedidos);
router.put("/:id",actualizarPedido);
router.delete("/:id",verifyToken,eliminarPedido);
export default router;