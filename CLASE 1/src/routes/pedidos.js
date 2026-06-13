import { Router } from "express";
import { 
    realizarPedido, 
    obtenerPedidos, 
    obtenerDetallePedido, 
    actualizarPedido, 
    eliminarPedido 
} from "../controllers/pedidos_controller.js";
import { asynHandler } from "../middlewares/avanzado.js";

const router = Router();
router.post("/realizarPedido", asynHandler(realizarPedido));
router.get("/obtenerPedidos", asynHandler(obtenerPedidos));
router.get("/obtenerDetallePedido/:id", asynHandler(obtenerDetallePedido));
router.put("/actualizarPedido/:id", asynHandler(actualizarPedido));
router.delete("/eliminarPedido/:id", asynHandler(eliminarPedido));

export default router;