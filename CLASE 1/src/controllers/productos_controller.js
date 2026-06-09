import pool from "../db/connection.js";

//Get
export const obtenerProductos = async(req,res) => {
    const[row]= await pool.query('SELECT p.id, p.nombre,p.descripcion,p.precio,p.stock,c.nombre AS categoria FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id'    
    );
    res.json({total : row.length, productos:row});
}

//Get By ID

export const obtenerProductosbyId= async(req,res) =>{
    const{id} = req.params;
    const[rows]= await pool.query("SELECT p.id, p.nombre,p.descripcion,p.precio,p.stock,c.nombre AS categoria FROM productos p INNER JOIN categorias c ON p.categoria_id = c.id WHERE p.id=?",[id]);

    if(rows.length===0){
        return res.status(404).json({error:"Producto no encontrado"});
    }
    res.json(rows[0]);
}

//Post 

export const crearProducto = async(req,res) => {
    const {categoria_id,nombre,descripcion,precio,stock} = req.body;
    if(!categoria_id || !nombre || !descripcion || !precio || !stock){
        return res.status(400).json({error:"Todos los campos son obligatorios"});
    }
    const resultado = await pool.query(
        "INSERT INTO productos(categoria_id,nombre,descripcion,precio,stock) VALUES (?,?,?,?,?)",
        [categoria_id,nombre,descripcion,precio,stock]
    );
    res.status(201).json({mensaje:"Producto creado exitosamente",id:resultado.insertId});
}

//Put

export const actualizarProducto = async(req,res) => {
    const {id} = req.params;
    const {categoria_id,nombre,descripcion,precio,stock} = req.body;
    if(!categoria_id || !nombre || !descripcion || !precio || !stock){
        return res.status(400).json({error:"Todos los campos son obligatorios"});
    }
    const resultado = await pool.query(
        "UPDATE productos SET categoria_id=?,nombre=?,descripcion=?,precio=?,stock=? WHERE id=?",
        [categoria_id,nombre,descripcion,precio,stock,id]
    );
    res.json({mensaje:"Producto actualizado exitosamente",id});
}

//Delete
export const eliminarProducto = async(req,res) =>{
    const {id} = req.params;
    if(!id){
        return res.status(400).json({error:"El id es obligatorio"});
    }
    await pool.query(
        "DELETE FROM productos WHERE id=?",
        [id]
    );
    res.json({mensaje:"Producto eliminado exitosamente",id}
    )

}