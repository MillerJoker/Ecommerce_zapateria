import pool from "../db/connection.js";

//Get
export const obtenerProductos = async(req,res) => {
    try {
        const { todo } = req.query;
        let query = `
            SELECT p.id_producto, p.nombre, p.descripcion, p.marca, p.precio, p.imagen_url, p.activo, c.nombre_categoria AS categoria, 
            (SELECT SUM(stock) FROM variantes_producto WHERE id_producto = p.id_producto) AS stock_total
            FROM productos p 
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria
        `;

        if (todo !== 'true') {
            query += ' WHERE c.activo = 1 AND p.activo = 1';
        }

        const [row] = await pool.query(query);
        res.json({ total: row.length, productos: row });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
}

//Get By ID

export const obtenerProductosbyId= async(req,res) =>{
    const{id} = req.params;
    const[rows]= await pool.query(`
        SELECT p.id_producto, p.nombre, p.descripcion, p.marca, p.precio, p.imagen_url, p.activo, c.nombre_categoria AS categoria
        FROM productos p 
        INNER JOIN categorias c ON p.id_categoria = c.id_categoria 
        WHERE p.id_producto=?`,[id]);

    if(rows.length===0){
        return res.status(404).json({error:"Producto no encontrado"});
    }

    const [variantes] = await pool.query("SELECT * FROM variantes_producto WHERE id_producto = ?", [id]);
    const producto = rows[0];
    producto.variantes = variantes;

    res.json(producto);
}

//Post 

export const crearProducto = async(req,res) => {
    const {id_categoria,nombre,descripcion,marca,precio,imagen_url} = req.body;
    if(!id_categoria || !nombre || !precio){
        return res.status(400).json({error:"id_categoria, nombre y precio son obligatorios"});
    }
    const [resultado] = await pool.query(
        "INSERT INTO productos(id_categoria,nombre,descripcion,marca,precio,imagen_url) VALUES (?,?,?,?,?,?)",
        [id_categoria,nombre,descripcion,marca,precio,imagen_url]
    );
    res.status(201).json({mensaje:"Producto creado exitosamente",id:resultado.insertId});
}

//Put

export const actualizarProducto = async(req,res) => {
    const {id} = req.params;
    const {id_categoria,nombre,descripcion,marca,precio,imagen_url,activo} = req.body;
    if(!id_categoria || !nombre || !precio){
        return res.status(400).json({error:"id_categoria, nombre y precio son obligatorios"});
    }
    const [resultado] = await pool.query(
        "UPDATE productos SET id_categoria=?,nombre=?,descripcion=?,marca=?,precio=?,imagen_url=?,activo=? WHERE id_producto=?",
        [id_categoria,nombre,descripcion,marca,precio,imagen_url,activo,id]
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
        "DELETE FROM productos WHERE id_producto=?",
        [id]
    );
    res.json({mensaje:"Producto eliminado exitosamente",id}
    )

}