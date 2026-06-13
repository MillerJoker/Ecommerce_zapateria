import { useState, useEffect } from "react";
import "../styles/AdminProductos.css";

export const AdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategoria] = useState([]);
    const [mensaje, setMensaje] = useState("");

    const [form, setForm] = useState({
        categoria_id: "",
        nombre: "",
        descripcion: "",
        marca: "", 
        precio: "",
        imagen_url: "",
        variantes: [] 
    });
    
    const [editandoId, setEditandoId] = useState(null);

    useEffect(() => {
        listarProductos();
        obtenerCategorias();
    }, []);

    const listarProductos = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos`);
            const data = await response.json();
            setProductos(data.productos || []);
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };

    const obtenerCategorias = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/obtenerCategorias`);
            const data = await res.json();
            if (res.ok) {
                setCategoria(data.categorias || []);
            }
        } catch (error) {
            console.error("Error en el servidor al traer categorías", error);
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const agregarFilaVariante = () => {
        setForm({
            ...form,
            variantes: [...form.variantes, { talla: "", color: "", stock: "" }]
        });
    };

    const eliminarFilaVariante = (indexAEliminar) => {
        const filtradas = form.variantes.filter((_, idx) => idx !== indexAEliminar);
        setForm({ ...form, variantes: filtradas });
    };

    const handleVarianteChange = (index, e) => {
        const nuevasVariantes = [...form.variantes];
        nuevasVariantes[index][e.target.name] = e.target.value;
        setForm({ ...form, variantes: nuevasVariantes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");

        // 1. Validar que existan variantes añadidas
        if (form.variantes.length === 0) {
            setMensaje("Error: Debes ingresar al menos una variante (Color/Talla/Stock) para el producto.");
            return;
        }

        // 2. Validar que la categoría sea un número válido
        const parsedCategoriaId = parseInt(form.categoria_id, 10);
        if (!parsedCategoriaId || isNaN(parsedCategoriaId)) {
            setMensaje("Error: Por favor, selecciona una categoría válida de la lista.");
            return;
        }

        // 3. Validar de forma estricta campos obligatorios globales
        if (!form.nombre.trim() || !form.descripcion.trim() || !form.marca.trim() || !form.precio) {
            setMensaje("Error: Todos los campos del producto (Nombre, Marca, Descripción y Precio) son obligatorios.");
            return;
        }

        const variantesLimpias = [];
        for (let i = 0; i < form.variantes.length; i++) {
            const v = form.variantes[i];
            const tallaParsed = parseInt(v.talla, 10);
            const stockParsed = parseInt(v.stock, 10);

            if (!v.color.trim() || isNaN(tallaParsed) || isNaN(stockParsed)) {
                setMensaje(`Error en la variante #${i + 1}: Asegúrate de rellenar Color, Talla y Stock con valores numéricos válidos.`);
                return;
            }

            variantesLimpias.push({
                talla: tallaParsed,
                color: v.color.trim(),
                stock: stockParsed
            });
        }

        // 5. Estructurar el Payload final libre de 'undefined' o strings corruptos
        const payloadJson = {
            id_categoria: parsedCategoriaId,
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            marca: form.marca.trim(), 
            precio: parseFloat(form.precio),
            imagen_url: form.imagen_url.trim() || null, 
            variantes: variantesLimpias
        };

        const metodo = editandoId ? "PUT" : "POST";
        const url = editandoId
            ? `${import.meta.env.VITE_PUBLIC_URL}/productos/${editandoId}`
            : `${import.meta.env.VITE_PUBLIC_URL}/productos`; 
            
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payloadJson) 
            });
            const data = await res.json();

            if (res.ok) {
                setMensaje(`Producto ${editandoId ? 'actualizado' : 'creado'} correctamente.`);
                // Reseteo limpio del formulario manteniendo la propiedad interna del estado
                setForm({ categoria_id: "", nombre: "", descripcion: "", marca: "", precio: "", imagen_url: "", variantes: [] });
                setEditandoId(null);
                listarProductos();
            } else {
                setMensaje("Error del servidor: " + (data.error || data.mensaje || "Datos inconsistentes"));
            }
        } catch (error) {
            console.error("Error guardando producto", error);
            setMensaje("Error de conexión al guardar");
        }
    };

    const handleEditar = (prod) => {
        setEditandoId(prod.id_producto);
        
        const CategoriaEncontrada = categorias.find(c => 
            c.nombre_categoria.trim().toLowerCase() === prod.categoria.trim().toLowerCase()
        );

        const variantesPrecargadas = prod.variantes ? prod.variantes.map(v => ({
            talla: v.talla,
            color: v.color,
            stock: v.stock
        })) : [];

        setForm({
            categoria_id: CategoriaEncontrada ? CategoriaEncontrada.id_categoria : "",
            nombre: prod.nombre,
            descripcion: prod.descripcion,
            marca: prod.marca || "", 
            precio: prod.precio,
            imagen_url: prod.imagen_url || "",
            variantes: variantesPrecargadas
        });
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar este producto? Se eliminarán también todas sus variantes vinculadas.")) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos/${id}`, {
                method: "DELETE"
            });
            
            if (res.ok) {
                setMensaje("Producto Eliminado permanentemente");
                listarProductos();
            } else {
                const data = await res.json();
                setMensaje("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error al eliminar", error);
        }
    };

    return (
        <div className="admin-container">
            <h1 className="admin-title">Gestión De Productos</h1>
            <p style={{ color: "#777", margin: "0 0 20px 0" }}>Administra el catálogo general, controla atributos de color, dimensiones de tallas y existencias físicas en almacén.</p>
            
            {mensaje && <div className="alert-message">{mensaje}</div>}
          
            <form className="form-card" onSubmit={handleSubmit}>
                <div className="form-grid">
                    
                    <div className="form-group">
                        <label>Categoría del Calzado</label>
                        <select className="form-select" name="categoria_id" value={form.categoria_id} onChange={handleChange} required>
                            <option value="">Selecciona una Categoría</option>
                            {categorias.map(cat => (
                                <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre_categoria}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Nombre Comercial</label>
                        <input className="form-input" type="text" name="nombre" placeholder="Ej. Oxford Classic" value={form.nombre} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Marca del Calzado</label>
                        <input className="form-input" type="text" name="marca" placeholder="Ej. Nike, Tatoo" value={form.marca} onChange={handleChange} required />
                    </div>

                    <div className="form-group full-width">
                        <label>Descripción Extendida</label>
                        <input className="form-input" type="text" name="descripcion" placeholder="Detalles de materiales, costuras y tipo de horma..." value={form.descripcion} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>Precio Unitario ($)</label>
                        <input className="form-input" type="number" name="precio" step="0.01" placeholder="0.00" value={form.precio} onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label>URL de la Imagen del Producto</label>
                        <input className="form-input" type="text" name="imagen_url" placeholder="https://ejemplo.com/zapato.jpg" value={form.imagen_url} onChange={handleChange} />
                    </div>

                </div>

                <div className="variantes-section">
                    <div className="variantes-header">
                        <h4 className="variantes-title">Inventario de Variantes del Calzado</h4>
                        <button type="button" className="btn-secondary" onClick={agregarFilaVariante}>
                            + Añadir Variante
                        </button>
                    </div>

                    {form.variantes.length === 0 ? (
                        <p style={{ color: "#888", fontSize: "13px", margin: "10px 0 0 0", textAlign: "center" }}>
                            No hay variantes añadidas. Presiona "+ Añadir Variante" para ingresar colores y tallas.
                        </p>
                    ) : (
                        form.variantes.map((variante, index) => (
                            <div key={index} className="variante-row">
                                <input 
                                    className="form-input"
                                    type="text" 
                                    name="color" 
                                    placeholder="Color (Ej. Negro)" 
                                    value={variante.color} 
                                    onChange={(e) => handleVarianteChange(index, e)}
                                    required 
                                />
                                <input 
                                    className="form-input"
                                    type="number" 
                                    name="talla" 
                                    placeholder="Talla (Ej. 40)" 
                                    value={variante.talla} 
                                    onChange={(e) => handleVarianteChange(index, e)}
                                    required 
                                />
                                <input 
                                    className="form-input"
                                    type="number" 
                                    name="stock" 
                                    placeholder="Unidades" 
                                    value={variante.stock} 
                                    onChange={(e) => handleVarianteChange(index, e)}
                                    required 
                                />
                                <button type="button" className="btn-danger-icon" onClick={() => eliminarFilaVariante(index)}>
                                    ✕
                                </button>
                            </div>
                        ))
                    )}
                </div>

                <div style={{ textAlign: "right", marginTop: "20px" }}>
                    <button type="submit" className="btn-primary">
                        {editandoId ? "💾 Guardar Cambios" : "➕ Crear Producto"}
                    </button>
                </div>
            </form>

            <h2 className="admin-subtitle">Listado General de Productos</h2>
            <div className="table-container">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Visualización</th>
                            <th>Nombre del Modelo</th>
                            <th>Línea / Categoría</th>
                            <th style={{ textAlign: "center" }}>Stock Global</th>
                            <th>Acciones de Control</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((prod) => (
                            <tr key={prod.id_producto}>
                                <td>
                                    {prod.imagen_url ? (
                                        <img src={prod.imagen_url} alt={prod.nombre} className="product-img-preview" />
                                    ) : (
                                        <span style={{ color: "#aaa", fontSize: "12px" }}>Sin foto</span>
                                    )}
                                </td>
                                <td style={{ fontWeight: "600", color: "#4e342e" }}>{prod.nombre}</td>
                                <td><span style={{ background: "#eaeaea", padding: "4px 8px", borderRadius: "4px", fontSize: "12px" }}>{prod.categoria}</span></td>
                                <td style={{ textAlign: "center", fontWeight: "bold" }}>{prod.stock_total ?? 0}</td>
                                <td>
                                    <button className="btn-action edit" onClick={() => handleEditar(prod)}>Editar</button>
                                    <button className="btn-action delete" onClick={() => handleEliminar(prod.id_producto)}>Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};