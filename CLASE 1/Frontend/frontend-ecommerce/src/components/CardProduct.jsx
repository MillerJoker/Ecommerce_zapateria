import { Link } from "react-router-dom";
import { useContext } from "react";
import { ContextCart } from "../services/ContextCart";

export const CardProduct = ({ product }) => {
    const { agregarAlCarrito } = useContext(ContextCart);

    const precioNumerico = Number(product.precio) || 0;
    const tieneStock = product.stock_total > 0;

    const handleAgregarInmediato = () => {
        // Extraemos de forma segura el ID de la variante predeterminada entregada por el Backend
        const idVarianteValida = product.id_variante_predeterminada;

        if (!idVarianteValida) {
            alert("No se pudo determinar una variante válida con stock disponible para este producto.");
            return;
        }

        // Si el objeto del producto ya incluye su array de variantes (ej. desde una vista detallada), 
        // buscamos los atributos reales de esa variante específica.
        const varianteReal = product.variantes?.find(v => v.id_variante === idVarianteValida);

        const productoConVariante = {
            id_producto: product.id_producto,
            nombre: product.nombre,
            precio: precioNumerico,
            imagen_url: product.imagen_url,
            // Asignamos las propiedades exactas requeridas por Carrito.jsx y realizarPedido en Express
            id_variante: idVarianteValida, 
            color: varianteReal ? varianteReal.color : "Negro", // Fallback seguro basado en tus registros SQL
            talla: varianteReal ? varianteReal.talla : "40"    // Fallback seguro basado en tus registros SQL
        };
        
        agregarAlCarrito(productoConVariante);
    };

    return (
        <div className="card" style={{ position: 'relative' }}> 
            <div className="card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ede9', color: '#8d6e63', fontSize: '0.8rem', overflow: 'hidden' }}>
                {product.imagen_url ? (
                    <img 
                        src={product.imagen_url} 
                        alt={product.nombre} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                ) : (
                    product.categoria || "Calzado"
                )}
            </div>
            
            <h3 className="card-title">{product.nombre}</h3>
            <p className="card-price">${precioNumerico.toFixed(2)}</p>

            <div className="card-actions">
                <button 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    onClick={handleAgregarInmediato} 
                    disabled={!tieneStock}
                >
                    {tieneStock ? "Añadir" : "Agotado"}
                </button>
                <Link to={`/productos/${product.id_producto}`} className="btn btn-outline" style={{ width: '100%' }}>
                    Detalles
                </Link>
            </div>

            {product.onSale && (
                <span style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#c5a059',
                    color: 'white',
                    padding: '2px 8px',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase'
                }}>
                    Oferta
                </span>
            )}
        </div>
    );
};