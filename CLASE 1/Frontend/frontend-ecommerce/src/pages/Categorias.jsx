import { useState, useEffect } from "react";
import "../styles/Categorias.css";

export const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState("");
    const [statusMessage, setStatusMessage] = useState({ text: "", type: "" });

    const mostrarFeedback = (text, type) => {
        setStatusMessage({ text, type });
        setTimeout(() => setStatusMessage({ text: "", type: "" }), 4000);
    };

    
    const obtenerCategorias = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/obtenerCategorias?todo=true`);
            const data = await res.json();
            if (res.ok) {
                setCategorias(data.categorias || []);
            } else {
                console.error("Error al cargar categorías", data.error);
            }
        } catch (error) {
            console.error("Error en el servidor", error);
        }
    };

    useEffect(() => {
        obtenerCategorias();
    }, []);

    const handleCrear = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/crearCategoria`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({ nombre_categoria: nuevaCategoria })
            });
            
            const data = await res.json();
            if (res.ok) {
                mostrarFeedback("¡Categoría creada con éxito!", "success");
                setNuevaCategoria("");
                obtenerCategorias();
            } else {
                mostrarFeedback(data.error || "Error al crear la categoría", "error");
            }
        } catch (error) {
            mostrarFeedback("Error de conexión con el servidor", "error");
        }
    };


    const handleToggleEstado = async (id_categoria, estaActivo) => {
        const url = estaActivo 
            ? `${import.meta.env.VITE_PUBLIC_URL}/categorias/eliminarCategoria/${id_categoria}` // cambia activo a 0
            : `${import.meta.env.VITE_PUBLIC_URL}/categorias/habilitarCategoria/${id_categoria}`; // cambia activo a 1
        
        const metodo = estaActivo ? "DELETE" : "PUT";

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await res.json();

            if (res.ok) {
                mostrarFeedback(estaActivo ? "Categoría inhabilitada de la tienda." : "Categoría habilitada con éxito.", "success");
                obtenerCategorias();
            } else {
                mostrarFeedback(data.error || "Error al cambiar el estado", "error");
            }
        } catch (error) {
            mostrarFeedback("Error en el servidor al cambiar estado", "error");
        }
    };

    
        const handleEliminarDefinitivo = async (id_categoria) => {
            if (!window.confirm("¿Estás absolutamente seguro de ELIMINAR PERMANENTEMENTE esta categoría? Esta acción borrará el registro físico de la base de datos.")) return;

            try {
                // CORRECCIÓN AQUÍ: Se añade '/categorias' para que coincida exactamente con Postman
                const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/destruirCategoriaFisico/${id_categoria}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    }
                });
                
                const data = await res.json();
                
                if (res.ok) {
                    mostrarFeedback("Categoría eliminada de forma definitiva.", "success");
                    obtenerCategorias();
                } else {
                    mostrarFeedback(data.error || "No se pudo realizar la eliminación física.", "error");
                }
            } catch (error) {
                mostrarFeedback("Error al intentar purgar la categoría", "error");
            }
        };

    return (
        <div className="categories-container">
            <h1 className="categories-title">Panel de Control: Categorías</h1>
            {statusMessage.text && (
                <div style={{
                    padding: '12px 20px',
                    marginBottom: '25px',
                    borderRadius: '8px',
                    backgroundColor: statusMessage.type === "success" ? "#e8f5e9" : "#ffebee",
                    color: statusMessage.type === "success" ? "#2e7d32" : "#c62828",
                    fontWeight: '500',
                    border: `1px solid ${statusMessage.type === "success" ? "#c8e6c9" : "#ffcdcf"}`
                }}>
                    {statusMessage.text}
                </div>
            )}

            <div className="categories-layout">
                <div className="category-card-form">
                    <form onSubmit={handleCrear}>
                        <div className="form-group">
                            <label htmlFor="categoryName">Nueva Categoría</label>
                            <input 
                                id="categoryName"
                                type="text"
                                className="category-input"
                                placeholder="Ej. Casual, Deportivas..."
                                value={nuevaCategoria}
                                onChange={(e) => setNuevaCategoria(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-save">Guardar Categoría</button>
                    </form>
                </div>

                <div className="category-list-wrapper">
                    <h3 className="list-title">Categorías Registradas</h3>
                    {categorias.length === 0 ? (
                        <p style={{ color: '#888', fontStyle: 'italic' }}>No hay categorías registradas en este momento.</p>
                    ) : (
                        <ul className="category-grid">
                            {categorias.map((cat) => (
                                <li 
                                    key={cat.id_categoria} 
                                    className="category-item-card" 
                                    style={{ opacity: cat.activo ? 1 : 0.6, borderLeft: cat.activo ? '4px solid #2e7d32' : '4px solid #757575' }}
                                >
                                    <div>
                                        <h4 className="category-name" style={{ margin: '0 0 5px 0' }}>{cat.nombre_categoria}</h4>
                                        <span style={{ fontSize: '0.75rem', color: cat.activo ? '#2e7d32' : '#757575', fontWeight: 'bold' }}>
                                            {cat.activo ? "● Visible en Tienda" : "○ Inactiva (Oculta)"}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                                        
                                        <button 
                                            type="button"
                                            className="btn-status"
                                            style={{ backgroundColor: cat.activo ? '#ff9800' : '#4caf50', color: '#white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleToggleEstado(cat.id_categoria, cat.activo)}
                                        >
                                            {cat.activo ? "Inhabilitar" : "Habilitar"}
                                        </button>

                                        <button 
                                            type="button"
                                            className="btn-delete"
                                            style={{ backgroundColor: '#d32f2f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                            onClick={() => handleEliminarDefinitivo(cat.id_categoria)}
                                        >
                                            Eliminar BD
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};