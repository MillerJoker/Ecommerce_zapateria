import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';

const SociosPage = () => {
    const [socios, setSocios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    // Estados del formulario (Creación y Edición)
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [fechaRegistro, setFechaRegistro] = useState('');
    const [editandoId, setEditandoId] = useState(null); 

    // 2. READ: Cargar socios activos al montar el componente
    const obtenerSocios = async () => {
        try {
            const response = await api.get('/socios');
            // Verificamos si la respuesta viene dentro de response.data.socios o directo en response.data
            const datosSocios = response.data.socios || response.data || [];
            setSocios(datosSocios);
        } catch (err) {
            console.error(err);
            setError("No se pudieron cargar los socios activos.");
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        obtenerSocios();
    }, []);

    // 1 y 3. CREATE y UPDATE: Guardar los datos del formulario
    const guardarSocio = async (e) => {
        e.preventDefault();
        try {
            if (editandoId) {
                // Modo Edición (PUT)
                await api.put(`/socios/${editandoId}`, { nombre, email });
                
                // Buscamos dinámicamente por la propiedad de ID que coincida
                setSocios(socios.map(s => {
                    const idActual = s.socio_id || s.id;
                    return idActual === editandoId ? { ...s, nombre, email } : s;
                }));
                setEditandoId(null);
                alert("Socio actualizado con éxito");
            } else {
                // Modo Creación (POST)
                const response = await api.post('/socios', { 
                    nombre, 
                    email, 
                    fecha_registro: fechaRegistro 
                });
                
                // Extraemos el socio recién creado de la respuesta
                const nuevoSocio = response.data.socio || response.data;
                setSocios([...socios, nuevoSocio]);
                alert("Socio registrado con éxito");
                
                // Recargamos de la base de datos para asegurar que traiga el socio_id autogenerado por MySQL
                obtenerSocios();
            }
            
            // Limpiar campos del formulario automáticamente
            setNombre('');
            setEmail('');
            setFechaRegistro('');
        } catch (err) {
            console.error(err);
            alert("Error al procesar la solicitud del socio.");
        }
    };

    // Activar el modo de edición cargando los datos existentes en los inputs
    const prepararEdicion = (socio) => {
        const idCorrecto = socio.socio_id || socio.id;
        setEditandoId(idCorrecto);
        setNombre(socio.nombre);
        setEmail(socio.email);
        setFechaRegistro(socio.fecha_registro ? socio.fecha_registro.split('T')[0] : '');
    };

    // Cancelar la edición actual y resetear el formulario
    const cancelarEdicion = () => {
        setEditandoId(null);
        setNombre('');
        setEmail('');
        setFechaRegistro('');
    };

    // 4. SOFT DELETE CORREGIDO: Maneja ambas alternativas de nombres de propiedad (socio_id o id)
    const darDeBaja = async (id) => {
        if (!id) {
            alert("Error: El ID del socio no es válido o llegó indefinido desde la base de datos.");
            return;
        }

        if (window.confirm("¿Está seguro de que desea dar de baja a este socio?")) {
            try {
                // Petición DELETE al backend
                await api.delete(`/socios/${id}`);
                
                // Filtramos quitando el elemento de la lista local usando cualquiera de las dos propiedades
                setSocios(socios.filter(socio => (socio.socio_id !== id && socio.id !== id)));
                
                alert("Socio dado de baja exitosamente.");
            } catch (err) {
                console.error("Error en la petición DELETE:", err);
                alert("No se pudo dar de baja al socio. Verifica la consola del backend.");
            }
        }
    };

    if (cargando) return <p style={{ color: 'white', padding: '10px' }}>Cargando datos de gestión de socios...</p>;
    if (error) return <p style={{ color: 'red', padding: '10px' }}>{error}</p>;

    return (
        <div style={{ padding: '20px', color: 'white' }}>
            <h2>👥 Gestión de Socios (Módulo 2)</h2>
            
            {/* Formulario de Registro / Edición */}
            <form onSubmit={guardarSocio} style={{ backgroundColor: '#34495e', padding: '15px', borderRadius: '5px', color: 'white', marginBottom: '20px' }}>
                <h3>{editandoId ? '✏️ Editar Socio' : '➕ Registrar Nuevo Socio'}</h3>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Nombre Completo: </label>
                    <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Correo Electrónico: </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                </div>
                {!editandoId && (
                    <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Fecha de Registro: </label>
                        <input type="date" value={fechaRegistro} onChange={(e) => setFechaRegistro(e.target.value)} required style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} />
                    </div>
                )}
                <button type="submit" style={{ backgroundColor: '#2ecc71', color: 'white', padding: '8px 12px', border: 'none', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}>
                    {editandoId ? 'Guardar Cambios' : 'Registrar Socio'}
                </button>
                {editandoId && (
                    <button type="button" onClick={cancelarEdicion} style={{ backgroundColor: '#e74c3c', color: 'white', padding: '8px 12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                        Cancelar
                    </button>
                )}
            </form>

            {/* Listado de Socios Activos */}
            <h3>📋 Lista de Socios Activos</h3>
            {socios.length === 0 ? (
                <p style={{ color: '#bdc3c7' }}>No se encontraron socios activos en la base de datos.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center', backgroundColor: '#1a252f', borderColor: '#34495e' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#2c3e50', color: 'white' }}>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Fecha Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {socios.map((socio) => {
                            // Sistema de detección inteligente de la Llave Primaria
                            const idFila = socio.socio_id || socio.id;
                            
                            return (
                                <tr key={idFila}>
                                    <td>{idFila}</td>
                                    <td style={{ textAlign: 'left', fontWeight: 'bold' }}>{socio.nombre}</td>
                                    <td>{socio.email}</td>
                                    <td>{socio.fecha_registro ? socio.fecha_registro.split('T')[0] : 'N/A'}</td>
                                    <td>
                                        <button onClick={() => prepararEdicion(socio)} style={{ backgroundColor: '#3498db', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', marginRight: '8px', borderRadius: '3px' }}>
                                            Editar
                                        </button>
                                        <button onClick={() => darDeBaja(idFila)} style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', cursor: 'pointer', borderRadius: '3px' }}>
                                            Dar de baja
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SociosPage;