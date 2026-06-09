import { Link } from "react-router-dom";
import { useContext } from "react";
import { ContextCart } from "../services/ContextCart";

export const CardProduct = ({ product }) => {
    const { agregarAlCarrito } = useContext(ContextCart);

    // 1. Aseguramos que el precio sea un número válido antes de usar toFixed
    const precioNumerico = Number(product.precio) || 0;

    // 2. Mapeamos el stock_total que viene de tu consulta SQL en el Backend
    const tieneStock = product.stock_total > 0;

    return (
        <div className="card" style={{ position: 'relative' }}> {/* Añadido position relative para que la etiqueta "Oferta" se posicione bien */}
            {/* Si tuviéramos imágenes reales usaríamos product.imagen, aquí simulamos una caja de producto */}
            <div className="card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ede9', color: '#8d6e63', fontSize: '0.8rem' }}>
                {product.categoria || "Calzado"}
            </div>
            
            <h3 className="card-title">{product.nombre}</h3>
            {/* CORRECCIÓN DEL ERROR CRÍTICO: Usamos la variable casteada a Número */}
            <p className="card-price">${precioNumerico.toFixed(2)}</p>

            <div className="card-actions">
                <button 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    onClick={() => agregarAlCarrito(product)}
                    /* CORRECCIÓN: Tu backend devuelve 'stock_total', no 'stock' */
                    disabled={!tieneStock}
                >
                    {tieneStock ? "Añadir" : "Agotado"}
                </button>
                {/* CORRECCIÓN: Cambiado product.id por product.id_producto */}
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