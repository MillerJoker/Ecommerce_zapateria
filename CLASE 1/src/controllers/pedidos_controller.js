import pool from "../db/connection.js";

//POST - REALIZAR PEDIDO 
export const realizarPedido = async (req, res) => {
    // 1. Control de seguridad por si req.usuario llega vacío
    if (!req.usuario) {
        return res.status(401).json({ error: "No autorizado. No se encontraron datos de usuario." });
    }

    // 2. Extraer el id de manera segura
    const id_usuario = req.usuario.id; 
    const { carrito, id_direccion, metodo_pago } = req.body;
    let total = 0;

    if (!id_direccion) {
        return res.status(400).json({ error: "id_direccion es obligatorio" });
    }

    const conexion = await pool.getConnection();

    try{
        await conexion.beginTransaction();
        carrito.forEach(item => total += (item.precio * item.cantidad));
        const[resPedido] = await conexion.query(
            "INSERT INTO pedidos (id_usuario, id_direccion, total, estado, metodo_pago) VALUES (?,?,?, 'Pendiente', ?)",
            [id_usuario, id_direccion, total, metodo_pago]
        );
        const id_pedido = resPedido.insertId;
        for(const item of carrito){
            await conexion.query(
                "INSERT INTO detalles_pedido (id_pedido, id_variante, cantidad, precio_unitario) VALUES (?,?,?,?)",
                [id_pedido, item.id_variante, item.cantidad, item.precio]
            );
            const [resStock] = await conexion.query(
                "UPDATE variantes_producto SET stock = stock - ? WHERE id_variante = ? AND stock >= ?",
                [item.cantidad, item.id_variante, item.cantidad]
            );
            if(resStock.affectedRows === 0){
                throw new Error(`Variante con id ${item.id_variante} no encontrada o stock insuficiente`);
            }
        }
        await conexion.commit();
        res.status(201).json({mensaje:"Pedido creado exitosamente",id_pedido});

    }catch(error){
        await conexion.rollback();
        res.status(500).json({error: error.message || "Error al procesar el pedido"});
    }
    finally{
        conexion.release();
    }
}

//GET - OBTENER PEDIDOS 
export const obtenerPedidos = async(req,res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;
      
        // Añadimos INNER JOINs para saber quién compra y a dónde va sin complicar el Frontend
        const [pedidos] = await pool.query(
            `SELECT p.id_pedido, p.id_usuario, p.fecha_pedido, p.total, p.estado, p.metodo_pago,
                    CONCAT(u.nombre, ' ', u.apellido) AS cliente, d.ciudad
             FROM pedidos p
             INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
             INNER JOIN direcciones_envio d ON p.id_direccion = d.id_direccion
             ORDER BY p.fecha_pedido DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        
        res.json({
            pagina_actual: page,
            limite: limit,
            data : pedidos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el historial de pedidos" });
    }
}

//GET - VER DETALLE EXACTO 
export const obtenerDetallePedido = async(req,res) => {
    const { id } = req.params;
    try {
        // Traemos los datos maestros del pedido + info del cliente + datos de entrega
        const[pedido] = await pool.query(
            `SELECT p.*, CONCAT(u.nombre, ' ', u.apellido) AS cliente, u.email, u.telefono,
                    CONCAT(d.direccion, ', ', d.ciudad, ' (', d.provincia_estado, ')') AS direccion_completa, d.codigo_postal
             FROM pedidos p
             INNER JOIN usuarios u ON p.id_usuario = u.id_usuario
             INNER JOIN direcciones_envio d ON p.id_direccion = d.id_direccion
             WHERE p.id_pedido = ?`, [id]
        );

        if(pedido.length === 0){
            return res.status(404).json({error:"Pedido no encontrado"});
        }

        // Traemos los artículos incluyendo el campo 'imagen_url' que tienes en tu tabla productos
        const[detalles] = await pool.query(
            `SELECT dp.id_detalle, dp.cantidad, dp.precio_unitario, v.talla, v.color, v.sku,
                    p.nombre AS producto_nombre, p.marca, p.imagen_url 
             FROM detalles_pedido dp 
             INNER JOIN variantes_producto v ON dp.id_variante = v.id_variante 
             INNER JOIN productos p ON v.id_producto = p.id_producto 
             WHERE dp.id_pedido = ?`, [id]
        );

        res.json({
            pedido: pedido[0],
            detalles: detalles
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener el detalle del pedido" });
    }
}

//PUT - ACTUALIZAR PEDIDO
export const actualizarPedido = async(req,res) =>{
    const {id} = req.params;
    const {id_usuario, id_direccion, total, estado, metodo_pago} = req.body;
    
    if(!id_usuario || !total || !estado){
        return res.status(400).json({error:"id_usuario, total y estado son obligatorios"});
    }
    
    try {
        await pool.query(
            "UPDATE pedidos SET id_usuario = ?, id_direccion = ?, total = ?, estado = ?, metodo_pago = ? WHERE id_pedido = ?",
            [id_usuario, id_direccion, total, estado, metodo_pago, id]
        );
        res.json({mensaje:"Pedido actualizado correctamente", id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al actualizar el estado del pedido" });
    }
}

//DELETE - ELIMINAR PEDIDO
export const eliminarPedido = async(req,res) =>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({error:"El id es obligatorio"});
    }
    try {
        await pool.query("DELETE FROM pedidos WHERE id_pedido = ?", [id]);
        res.json({mensaje:"Pedido eliminado exitosamente", id});
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al eliminar el registro del pedido" });
    }
}