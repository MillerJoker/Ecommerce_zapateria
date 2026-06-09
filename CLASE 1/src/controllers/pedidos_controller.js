import pool from "../db/connection.js";


//POST REALIZAR PEDIDO
export const realizarPedido = async(req,res) => {
    const{carrito} = req.body;
    const usuario_id = req.usuario.id;
    let total = 0;

    const conexion = await pool.getConnection();

    try{
        await conexion.beginTransaction();
        carrito.forEach(item => total += (item.precio * item.cantidad));
        const[resPedido] = await conexion.query(
            "INSERT INTO pedidos (usuario_id,total,estado) VALUES (?,?,'pagado')",
            [usuario_id,total]
        );
        const pedido_id = resPedido.insertId;
        for(const item of carrito){
            await conexion.query(
                "INSERT INTO detalle_pedido (pedido_id,producto_id,cantidad,precio_unitario) VALUES (?,?,?,?)",
                [pedido_id,item.producto_id,item.cantidad,item.precio]
            );
             const [resStock] = await conexion.query(
                "UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?",
                [item.cantidad,item.producto_id,item.cantidad]
            );
            if(resStock.affectedRows === 0){
                throw new Error(`Producto con id ${item.producto_id} no encontrado o stock insuficiente`);
            }
        }
        await conexion.commit();
        res.status(201).json({mensaje:"Pedido creado exitosamente",pedido_id});

    }catch(error){
        await conexion.rollback();
        res.status(500).json({error:"Error al procesar el pedido"});
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
        "Select id,usuario_id,total,estado FROM pedidos LIMIT ? OFFSET ?",
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
    const[pedido] = await pool.query("SELECT * FROM pedidos WHERE id= ?",[id]);

    if(pedido.length ===0){
        return res.status(404).json({error:"Pedido no encontrado"});
    }

    const[detalles] = await pool.query(
        'SELECT dp.id, dp.cantidad, dp.precio_unitario, p.nombre AS producto_nombre from detalle_pedido dp INNER JOIN productos p ON dp.'
    )
}

//actualizar pedido

export const actualizarPedido = async(req,res) =>{
    const {id} = req.params;
    const {usuario_id, total, estado} = req.body;
    if(!usuario_id|| !total || !estado){
        return res.status(400).json({error:"todos los campos son obligatorios"});
    }
    const resultado = await pool.query(
        "UPDATE pedidos SET usuario_id = ?, total = ?, estado = ? WHERE id=?",
        [usuario_id,total,estado,id]
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
        "DELETE FROM pedidos WHERE id = ?", [id]
    );
    res.json({mensaje:"Pedido eliminado exitosamente",id})
}