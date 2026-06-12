import pool from "../db/connection.js";
 
export const crearContacto = async (req, res) => {
    const { nombre_completo, email, telefono, comentario } = req.body;
    if (!nombre_completo || !email || !comentario) {
        return res.status(400).json({ 
            error: "Por favor, llena todos los campos obligatorios (Nombre, Email y Comentario)." 
        });
    }

    const query = `
        INSERT INTO contactos (nombre_completo, email, telefono, comentario) 
        VALUES (?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [nombre_completo, email, telefono, comentario]);
    return res.status(201).json({ 
        mensaje: "¡Contacto guardado con éxito!", 
        id_contacto: result.insertId 
    });
};