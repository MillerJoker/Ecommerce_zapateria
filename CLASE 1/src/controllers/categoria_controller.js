import pool from "../db/connection.js";

//Get
export const obtenerCategorias = async(req,res) => {
    const[row]= await pool.query('SELECT * FROM categorias');
    res.json({total : row.length, categorias:row});
}


export const crearCategoria = async(req,res) => {
    const {nombre} = req.body;
   
    if(!nombre){
        return res.status(400).json({error:"El nombre es obligatorio"});
    }
  
    const [resultado] = await pool.query(
        "INSERT INTO categorias(nombre) VALUES (?)",
        [nombre]
    );
    res.status(201).json({mensaje:"Categoria creada exitosamente",id:resultado.insertId});
}

//put de categoria usando como parametro el id de la categoria a actualizar y en el body el nombre y el campo activa para actualizar la categoria
export const actualizarCategoria = async(req,res) => {
    const {id} = req.params;
    const {nombre} = req.body;
    const {activa} = req.body;
    if(!nombre){
        return res.status(400).json({error:"El nombre es obligatorio"});
    }
    if(activa === undefined){
        return res.status(400).json({error:"El campo activa es obligatorio"});
    }
    const [resultado] = await pool.query(
        "UPDATE categorias SET nombre=?,activa=? WHERE id=?",
        [nombre,activa,id]
    );
    res.json({mensaje:"Categoria actualizada exitosamente",id});
}

//Delete 
export const eliminarCategoria = async(req,res) =>{
    const {id} = req.params;
    try{
        const[resultado] = await pool.query(
            "DELETE FROM categorias WHERE id=?",
            [id]
        );
        if(resultado.affectedRows === 0){
            return res.status(404).json({error:"Categoria no encontrada"});
        }
        res.json({mensaje:"Categoria eliminada exitosamente",id});
    }
    catch(error){
        res.status(500).json({error:"Error al eliminar la categoria porque tiene productos asociados"});
    }
}

