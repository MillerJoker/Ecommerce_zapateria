import pool from "../bd/connection.js";

//post de socios
export const crearSocio = async (req, res) => {
    const { nombre, email, fecha_registro } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO socios (nombre, email, fecha_registro) VALUES (?, ?, ?)',
            [nombre, email, fecha_registro]
        );
        res.status(201).json({ mensaje: "Socio registrado", id: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al crear socio", error });
    }
};

//Get de socios

export const obtenerSociosActivos = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM socios WHERE activo = TRUE');
        res.json({ socios: rows });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener socios", error });
    }
};

//Put de socios

export const actualizarSocio = async (req, res) => {
    const { id } = req.params;
    const { nombre, email } = req.body;
    try {
        await pool.query('UPDATE socios SET nombre = ?, email = ? WHERE id = ?', [nombre, email, id]);
        res.json({ mensaje: "Datos del socio actualizados" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar socio", error });
    }
};

export const deshabilitarSocio = async (req, res) => {
    try {
        const { id } = req.params; 

        console.log("Intentando dar de baja al socio con ID:", id);

        // CORRECCIÓN AQUÍ: Se cambió "socio_id" por "id" para coincidir con tu base de datos
        const [result] = await pool.query(
            "UPDATE socios SET activo = false WHERE id = ?",
            [id]
        );

        // Si no se afectó ninguna fila es porque el ID no existe
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: "Socio no encontrado" });
        }

        return res.json({ mensaje: "Socio dado de baja exitosamente (Soft Delete aplicado)" });

    } catch (error) {
        console.error("❌ Error interno en deshabilitarSocio:", error.message);
        
        return res.status(500).json({ 
            mensaje: "Error al procesar el borrado lógico en el servidor", 
            error: error.message 
        });
    }
};