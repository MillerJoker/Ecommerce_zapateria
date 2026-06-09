import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { ContextCart } from "../services/ContextCart.jsx";

export const DetailProduct = () => {
    const { id } = useParams(); // Obtiene el ID del producto desde la URL activa
    const [producto, setProducto] = useState(null);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    
    const { agregarAlCarrito } = useContext(ContextCart);

    useEffect(() => {
        const fetchProductoIndividual = async () => {
            try {
                setCargando(true);
                setError("");
                const URL_API = import.meta.env.VITE_PUBLIC_URL || "http://localhost:3000/api/v1";
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

    if (cargando) {
        return <div style={{ textAlign: "center", padding: "50px" }}><h3>Cargando detalles del producto...</h3></div>;
    }

    if (error || !producto) {
        return (
            <div style={{ textAlign: "center", padding: "50px" }}>
                <p role="alert" style={{ color: "red", fontWeight: "bold" }}>{error || "Producto no encontrado"}</p>
                <Link to="/productos" style={{ color: "blue", textDecoration: "underline" }}>Volver al catálogo</Link>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ border: "1px solid #eaeaea", padding: "30px", borderRadius: "12px", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" }}>
                
                {/* Categoría accesible */}
                <span style={{ fontSize: "12px", textTransform: "uppercase", color: "blue", fontWeight: "bold", display: "block", marginBottom: "10px" }}>
                    {producto.categoria}
                </span>

                <h1 style={{ marginBottom: "15px" }}>{producto.nombre}</h1>
                
                {/* Control de stock visualmente descriptivo */}
                <p style={{ fontSize: "14px", color: producto.stock > 0 ? "green" : "red", fontWeight: "600" }}>
                    {producto.stock > 0 ? `Unidades disponibles: ${producto.stock}` : "Producto Agotado"}
                </p>

                <p style={{ fontSize: "28px", fontWeight: "bold", margin: "20px 0" }}>
                    ${Number(producto.precio).toFixed(2)}
                </p>

                <div style={{ backgroundColor: "#f9f9f9", padding: "15px", borderRadius: "8px", marginBottom: "25px", textAlign: "left" }}>
                    <h3 style={{ fontSize: "16px", margin: "0 0 5px 0" }}>Descripción del artículo:</h3>
                    <p style={{ color: "#555", fontSize: "14px", lineHeight: "1.5", margin: 0 }}>{producto.descripcion}</p>
                </div>

                {/* Contenedor de acciones */}
                <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
                    <button
                        onClick={() => agregarAlCarrito(producto)}
                        disabled={producto.stock === 0}
                        style={{
                            padding: "12px 24px",
                            fontSize: "15px",
                            fontWeight: "bold",
                            cursor: producto.stock > 0 ? "pointer" : "not-allowed",
                            background: producto.stock > 0 ? "green" : "lightgray",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            transition: "background 0.2s"
                        }}
                    >
                        {producto.stock === 0 ? "Agotado" : "Añadir al Carrito"}
                    </button>

                    {/* Enlace semánticamente correcto sin botones anidados */}
                    <Link
                        to="/productos"
                        style={{
                            padding: "12px 24px",
                            fontSize: "15px",
                            background: "gray",
                            color: "white",
                            borderRadius: "6px",
                            textDecoration: "none",
                            display: "inline-block",
                            fontWeight: "500"
                        }}
                    >
                        Volver a la Tienda
                    </Link>
                </div>

            </div>
        </div>
    );
};