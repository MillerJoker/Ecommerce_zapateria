import pool from "../db/connection.js";


//POST REALIZAR PEDIDO
export const realizarPedido = async(req,res) => {
    const{carrito, id_direccion, metodo_pago} = req.body;
    const id_usuario = req.usuario.id;
    let total = 0;

    if(!id_direccion){
        return res.status(400).json({error:"id_direccion es obligatorio"});
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


//GET OBTENER PEDIDOS DE UN USUARIO
export const obtenerPedidos = async(req,res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1 ) *limit;
  
    const [pedidos] = await pool.query(
        "Select id_pedido, id_usuario, id_direccion, total, estado FROM pedidos LIMIT ? OFFSET ?",
        [limit, offset]
    );
    res.json({
        pagina_actual: page,
        limite: limit,
        data : pedidos
    });
}

//get para ver el detalle exacto del pedido

export const obtenerDetallePedido = async(req,res) => {
    const {id} = req.params;
    const[pedido] = await pool.query("SELECT * FROM pedidos WHERE id_pedido= ?",[id]);

    if(pedido.length ===0){
        return res.status(404).json({error:"Pedido no encontrado"});
    }

    const[detalles] = await pool.query(
        `SELECT dp.id_detalle, dp.cantidad, dp.precio_unitario, v.talla, v.color, p.nombre AS producto_nombre 
         FROM detalles_pedido dp 
         INNER JOIN variantes_producto v ON dp.id_variante = v.id_variante 
         INNER JOIN productos p ON v.id_producto = p.id_producto 
         WHERE dp.id_pedido = ?`, [id]
    );

    res.json({
        pedido: pedido[0],
        detalles: detalles
    });
}

//actualizar pedido

export const actualizarPedido = async(req,res) =>{
    const {id} = req.params;
    const {id_usuario, id_direccion, total, estado, metodo_pago} = req.body;
    if(!id_usuario|| !total || !estado){
        return res.status(400).json({error:"id_usuario, total y estado son obligatorios"});
    }
    const resultado = await pool.query(
        "UPDATE pedidos SET id_usuario = ?, id_direccion = ?, total = ?, estado = ?, metodo_pago = ? WHERE id_pedido=?",
        [id_usuario, id_direccion, total, estado, metodo_pago, id]
    );
    res.json({mensaje:"Pedido actualizado correctamente", id});
}

//Delete pedido

export const eliminarPedido = async(req,res) =>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({error:"El id es obligatorio"});
    }
    await pool.query(
        "DELETE FROM pedidos WHERE id_pedido = ?", [id]
    );
    res.json({mensaje:"Pedido eliminado exitosamente",id})
}