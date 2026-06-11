    import pool from "../db/connection.js";

    //Get
    export const obtenerCategorias = async (req, res) => {
        try {
            const { todo } = req.query;
            let query = 'SELECT id_categoria, nombre_categoria, activo FROM categorias';
            
            // Si no se pide "todo", filtramos por las activas
            if (todo !== 'true') {
                query += ' WHERE activo = 1';
            }

            const [row] = await pool.query(query);
            res.json({ total: row.length, categorias: row });
        } catch (error) {
            res.status(500).json({ error: "Error al obtener las categorías" });
        }
    }


    export const crearCategoria = async(req,res) => {
        const {nombre_categoria} = req.body;
    
        if(!nombre_categoria){
            return res.status(400).json({error:"El nombre de la categoría es obligatorio"});
        }
    
        try {
            const [resultado] = await pool.query(
                "INSERT INTO categorias(nombre_categoria, activo) VALUES (?, 1)",
                [nombre_categoria]
            );
            res.status(201).json({mensaje:"Categoria creada exitosamente",id:resultado.insertId});
        } catch (error) {
            res.status(500).json({ error: "Error al crear la categoría" });
        }
    }


    //Actualizar
    export const actualizarCategoria = async (req, res) => {
        const { id } = req.params;
        const { nombre_categoria, activo } = req.body;
        
        try {
            const [categoriaActual] = await pool.query("SELECT * FROM categorias WHERE id_categoria = ?", [id]);
            if (categoriaActual.length === 0) {
                return res.status(404).json({ error: "Categoría no encontrada" });
            }

            const nuevoNombre = nombre_categoria !== undefined ? nombre_categoria : categoriaActual[0].nombre_categoria;
            const nuevoEstado = activo !== undefined ? activo : categoriaActual[0].activo;

            await pool.query(
                "UPDATE categorias SET nombre_categoria = ?, activo = ? WHERE id_categoria = ?",
                [nuevoNombre, nuevoEstado, id]
            );

            res.json({ mensaje: "Categoría actualizada exitosamente", id, activo: nuevoEstado });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Error en el servidor al actualizar la categoría" });
        }
    }

    //Soft Delete (Deshabilitar)
    export const eliminarCategoria = async (req, res) => {
        const { id } = req.params;
        try {
            const [resultado] = await pool.query(
                "UPDATE categorias SET activo = 0 WHERE id_categoria = ?",
                [id]
            );

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Categoría no encontrada" });
            }

            res.json({ mensaje: "Categoría deshabilitada exitosamente (Soft Delete)" });
        } catch (error) {
            res.status(500).json({ error: "Error al deshabilitar la categoría" });
        }
    }

    //Habilitar Categoría
    export const habilitarCategoria = async (req, res) => {
        const { id } = req.params;
        try {
            const [resultado] = await pool.query(
                "UPDATE categorias SET activo = 1 WHERE id_categoria = ?",
                [id]
            );

            if (resultado.affectedRows === 0) {
                return res.status(404).json({ error: "Categoría no encontrada" });
            }

            res.json({ mensaje: "Categoría habilitada exitosamente" });
        } catch (error) {
            res.status(500).json({ error: "Error al habilitar la categoría" });
        }
    }