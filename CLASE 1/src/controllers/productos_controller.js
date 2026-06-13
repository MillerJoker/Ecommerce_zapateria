import pool from "../db/connection.js";

// Get - Obtener todos los productos (Modificado para incluir variante predeterminada)
export const obtenerProductos = async(req,res) => {
    try {
        const { todo } = req.query;
        let query = `
            SELECT p.id_producto, p.nombre, p.descripcion, p.marca, p.precio, p.imagen_url, p.activo, c.nombre_categoria AS categoria, 
                (SELECT SUM(stock) FROM variantes_producto WHERE id_producto = p.id_producto) AS stock_total,
                -- Subconsulta para traer el id de la primera variante con stock disponible
                (SELECT id_variante FROM variantes_producto WHERE id_producto = p.id_producto AND stock > 0 LIMIT 1) AS id_variante_predeterminada
            FROM productos p 
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria
        `;

        if (todo !== 'true') {
            query += ' WHERE c.activo = 1 AND p.activo = 1';
        }

        const [row] = await pool.query(query);
        res.json({ total: row.length, productos: row });
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ error: "Error al obtener los productos" });
    }
}

//Get By ID

export const obtenerProductosbyId = async(req,res) =>{
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT p.id_producto, p.nombre, p.descripcion, p.marca, p.precio, p.imagen_url, p.activo, c.nombre_categoria AS categoria
            FROM productos p 
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria 
            WHERE p.id_producto = ?`, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        const [variantes] = await pool.query("SELECT * FROM variantes_producto WHERE id_producto = ?", [id]);
        
        const producto = rows[0];
        producto.variantes = variantes;
        const sumaStock = variantes.reduce((total, variante) => total + (Number(variante.stock) || 0), 0);
        producto.stock_total = sumaStock;
        res.json(producto);

    } catch (error) {
        console.error("Error al obtener detalle del producto:", error);
        res.status(500).json({ error: "Error interno del servidor al cargar el producto" });
    }
};

// Post - Crear Producto 
export const crearProducto = async (req, res) => {
    const { categoria_id, id_categoria, nombre, descripcion, marca, precio, imagen_url, variantes } = req.body;
    const idCategoriaEfectivo = id_categoria || categoria_id;
    if (!idCategoriaEfectivo || !nombre || !precio) {
        return res.status(400).json({ error: "id_categoria, nombre y precio son obligatorios" });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const [resultado] = await connection.query(
            "INSERT INTO productos(id_categoria, nombre, descripcion, marca, precio, imagen_url) VALUES (?,?,?,?,?,?)",
            [idCategoriaEfectivo, nombre, descripcion, marca || '', precio, imagen_url]
        );

        const nuevoIdProducto = resultado.insertId;

        if (variantes && Array.isArray(variantes) && variantes.length > 0) {
            const queryVariantes = "INSERT INTO variantes_producto (id_producto, talla, color, stock, sku) VALUES ?";
            
            const valoresVariantes = variantes.map(v => {
                const codigoColor = String(v.color).substring(0, 3).toUpperCase();
                const skuAutogenerado = `DRPIE-${nuevoIdProducto}-${v.talla}-${codigoColor}`;

                return [
                    nuevoIdProducto,
                    String(v.talla),          
                    String(v.color),          
                    parseInt(v.stock, 10),    
                    String(v.sku || skuAutogenerado)
                ];
            });

            await connection.query(queryVariantes, [valoresVariantes]);
        }

        await connection.commit();
        res.status(201).json({ mensaje: "Producto y variantes creados exitosamente", id: nuevoIdProducto });

    } catch (error) {
        await connection.rollback();
        console.error("Error al crear producto con variantes:", error);
        res.status(500).json({ error: "Error interno en el servidor al guardar el producto" });
    } finally {
        connection.release();
    }
};

// Put - Actualizar Producto y sus Variantes
export const actualizarProducto = async (req, res) => {
    const { id } = req.params;
    const { categoria_id, id_categoria, nombre, descripcion, marca, precio, imagen_url, activo, variantes } = req.body;
    
    const idCategoriaEfectivo = id_categoria || categoria_id;

    if (!idCategoriaEfectivo || !nombre || !precio) {
        return res.status(400).json({ error: "id_categoria, nombre y precio son obligatorios" });
    }

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        await connection.query(
            "UPDATE productos SET id_categoria=?, nombre=?, descripcion=?, marca=?, precio=?, imagen_url=?, activo=? WHERE id_producto=?",
            [idCategoriaEfectivo, nombre, descripcion, marca || '', precio, imagen_url, activo !== undefined ? activo : 1, id]
        );

        await connection.query("DELETE FROM variantes_producto WHERE id_producto = ?", [id]);

        if (variantes && Array.isArray(variantes) && variantes.length > 0) {
            const queryVariantes = "INSERT INTO variantes_producto (id_producto, talla, color, stock, sku) VALUES ?";
            
            const valoresVariantes = variantes.map(v => {
                const codigoColor = String(v.color).substring(0, 3).toUpperCase();
                const skuAutogenerado = `DRPIE-${id}-${v.talla}-${codigoColor}`;

                return [
                    parseInt(id, 10),
                    String(v.talla),           
                    String(v.color),           
                    parseInt(v.stock, 10),     
                    String(v.sku || skuAutogenerado)
                ];
            });

            await connection.query(queryVariantes, [valoresVariantes]);
        }

        await connection.commit();
        res.json({ mensaje: "Producto y variantes actualizados exitosamente", id });

    } catch (error) {
        await connection.rollback();
        console.error("Error al actualizar producto con variantes:", error);
        res.status(500).json({ error: "Error interno en el servidor al actualizar" });
    } finally {
        connection.release();
    }
};

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