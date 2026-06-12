import { useState, useEffect } from "react";
import { data, Link } from "react-router-dom";
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
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/obtenerCategorias`);
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
            console.error("Error en el servidor", error);
            mostrarFeedback("Error de conexión con el servidor", "error");
        }
    };

    const handleEliminar = async (id_categoria) => {
        if (!window.confirm("¿Estás completamente seguro de eliminar esta categoría? Esto podría afectar a los productos vinculados.")) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/eliminarCategoria/${id_categoria}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            
            const data = await res.json();
            
            if (res.ok) {
                mostrarFeedback("Categoría eliminada correctamente.", "success");
                obtenerCategorias();
            } else {
                mostrarFeedback(data.error || "No se pudo eliminar la categoría", "error");
            }
        } catch (error) {
            console.error("Error en el servidor", error);
            mostrarFeedback("Error al intentar eliminar", "error");
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
                                <li key={cat.id_categoria} className="category-item-card">
                                    <h4 className="category-name">{cat.nombre_categoria}</h4>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleEliminar(cat.id_categoria)}
                                    >
                                        Eliminar
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};