import pool from "../bd/connection.js"

//get obtener libros

export const obtenerLibros = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM libros');
        res.json({ libros: rows });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener libros", error });
    }
};

// POST CREAR LIBROS

export const crearLibro = async (req, res) => {
    const { titulo, autor, anio_publicacion } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO libros (titulo, autor, anio_publicacion) VALUES (?, ?, ?)',
            [titulo, autor, anio_publicacion]
        );
        res.status(201).json({ mensaje: "Libro creado con éxito", id: result.insertId });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al registrar libro", error });
    }
};

// PUT ACTUALIZAR LIBROS

export const cambiarPrestamo = async (req, res) => {
    const { id } = req.params;
    const { disponible } = req.body; // Recibe un booleano
    try {
        await pool.query('UPDATE libros SET disponible = ? WHERE id = ?', [disponible, id]);
        res.json({ mensaje: "Estado de préstamo actualizado" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al actualizar préstamo", error });
    }
};

//DELETE SOFT ELIMINAR LIBROS

export const eliminarLibroFisico = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM libros WHERE id = ?', [id]);
        res.json({ mensaje: "Libro eliminado físicamente de la base de datos" });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al eliminar libro", error });
    }
};