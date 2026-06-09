import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';

const LibrosPage = () => {
    const [libros, setLibros] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLibros = async () => {
            try {
                const response = await api.get('/libros');
                setLibros(response.data.libros || []);
            } catch (err) {
                console.error("Error al obtener libros:", err);
                setError("No se pudo conectar con el servidor backend.");
            } finally {
                setCargando(false);
            }
        };

        fetchLibros();
    }, []);

    if (cargando) return <p>Cargando catálogo de libros...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h2>Catálogo de Libros</h2>
            {libros.length === 0 ? (
                <p>No hay libros registrados en este momento.</p>
            ) : (
                <table border="1" cellPadding="8" style={{ borderCollapse: 'collapse', width: '100%', marginTop: '15px' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                            <th>ID</th>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Año Publicación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {libros.map((libro) => (
                            <tr key={libro.libro_id || libro.id} style={{ textAlign: 'center' }}>
                                <td>{libro.libro_id || libro.id}</td>
                                <td style={{ textAlign: 'left', fontWeight: 'bold' }}>{libro.titulo}</td>
                                <td>{libro.autor}</td>
                                <td>{libro.anio_publicacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default LibrosPage;