import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ContextCart } from "../services/ContextCart.jsx";
import "../styles/DetailProduct.css";

export const DetailProduct = () => {
    const { id } = useParams(); 
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    
    const [colorSeleccionado, setColorSeleccionado] = useState(null);
    const [tallaSeleccionada, setTallaSeleccionada] = useState(null);

    const { agregarAlCarrito } = useContext(ContextCart);

    useEffect(() => {
        const fetchProductoIndividual = async () => {
            try {
                setCargando(true);
                setError("");
                const URL_API = import.meta.env.VITE_PUBLIC_URL;
                const response = await fetch(`${URL_API}/productos/${id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || "No se pudo cargar el detalle del producto.");
                }

                setProducto(data.producto || data);
            } catch (err) {
                console.error("Error al traer detalles del producto:", err);
                setError(err.message);
            } finally {
                setCargando(false);
            }
        };

        fetchProductoIndividual();
    }, [id]);

    if (cargando) return <div style={{ textAlign: "center", padding: "100px" }}><h3>Cargando detalles del calzado...</h3></div>;
    if (error || !producto) return <div style={{ textAlign: "center", padding: "100px" }}><p style={{ color: "red", fontWeight: "bold" }}>{error || "Producto no encontrado"}</p></div>;

    const tieneStockGlobal = Number(producto.stock_total) > 0;

    const coloresDisponibles = producto.variantes 
        ? [...new Set(producto.variantes.map(v => v.color))] 
        : [];

    const variantesDelColorElegido = producto.variantes && colorSeleccionado
        ? producto.variantes.filter(v => v.color === colorSeleccionado)
        : [];

    const handleAgregarAlCarrito = () => {
        if (!colorSeleccionado || !tallaSeleccionada) return;
        const productoEspecifico = {
            ...producto,
            color_elegido: colorSeleccionado,
            talla_elegida: tallaSeleccionada
        };
        agregarAlCarrito(productoEspecifico);
    };

    return (
        <div className="product-detail-page">
            <div className="product-detail-card">
                
                {producto.imagen_url && (
                    <div className="product-image-wrapper">
                        <img src={producto.imagen_url} alt={producto.nombre} />
                    </div>
                )}

                <div className="product-info-wrapper">
                    <span className="product-category">{producto.categoria || "Calzado"}</span>
                    <h1 className="product-title">{producto.nombre}</h1>
                    
                    <p className="product-stock-status" style={{ color: tieneStockGlobal ? "#2e7d32" : "#d32f2f" }}>
                        {tieneStockGlobal ? `✓ Stock disponible: ${producto.stock_total} unidades` : "✗ Producto Agotado"}
                    </p>

                    <p className="product-price-tag">${Number(producto.precio).toFixed(2)}</p>

                    {tieneStockGlobal && coloresDisponibles.length > 0 && (
                        <div className="colores-container">
                            <label className="colores-label">1. Selecciona Color:</label>
                            <div className="colores-grid">
                                {coloresDisponibles.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        className={`color-boton ${colorSeleccionado === color ? 'seleccionado' : ''}`}
                                        onClick={() => {
                                            setColorSeleccionado(color);
                                            setTallaSeleccionada(null);
                                        }}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {tieneStockGlobal && colorSeleccionado && (
                        <div className="tallas-container">
                            <label className="tallas-label">2. Selecciona Talla (Para color {colorSeleccionado}):</label>
                            <div className="tallas-grid">
                                {variantesDelColorElegido.map((variante) => {
                                    const tieneStockVariante = Number(variante.stock) > 0;
                                    const esLaTallaSeleccionada = tallaSeleccionada === variante.talla;

                                    return (
                                        <button
                                            key={variante.id_variante}
                                            type="button"
                                            disabled={!tieneStockVariante}
                                            className={`talla-boton ${esLaTallaSeleccionada ? 'seleccionada' : ''}`}
                                            onClick={() => setTallaSeleccionada(variante.talla)}
                                        >
                                            {variante.talla}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="product-description-box">
                        <h3>Descripción:</h3>
                        <p>{producto.descripcion}</p>
                    </div>

                    <div className="product-actions-group">
                        <button
                            onClick={handleAgregarAlCarrito}
                            disabled={!tieneStockGlobal || !colorSeleccionado || !tallaSeleccionada}
                            className="btn-add-cart"
                            style={{
                                cursor: (tieneStockGlobal && colorSeleccionado && tallaSeleccionada) ? "pointer" : "not-allowed",
                                background: (tieneStockGlobal && colorSeleccionado && tallaSeleccionada) ? "#2e7d32" : "#e0e0e0",
                                color: (tieneStockGlobal && colorSeleccionado && tallaSeleccionada) ? "white" : "#9e9e9e"
                            }}
                        >
                            {!tieneStockGlobal 
                                ? "Agotado" 
                                : !colorSeleccionado 
                                    ? "Elige un Color" 
                                    : !tallaSeleccionada 
                                        ? "Elige una Talla" 
                                        : "Añadir al Carrito"
                            }
                        </button>

                        <Link to="/productos" className="btn-back-store">
                            Volver
                        </Link>
                    </div>
                </div> 
            </div>
        </div>
    );
};