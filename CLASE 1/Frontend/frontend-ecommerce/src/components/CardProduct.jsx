import { Link } from "react-router-dom";
import { useContext } from "react";
import { ContextCart } from "../services/ContextCart";

export const CardProduct = ({ product }) => {
    const { agregarAlCarrito } = useContext(ContextCart);

    return (
        <div className="card">
            {/* Si tuviéramos imágenes reales usaríamos product.imagen, aquí simulamos una caja de producto */}
            <div className="card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0ede9', color: '#8d6e63', fontSize: '0.8rem' }}>
                {product.categoria || "Calzado"}
            </div>
            
            <h3 className="card-title">{product.nombre}</h3>
            <p className="card-price">${product.precio.toFixed(2)}</p>

            <div className="card-actions">
                <button 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    onClick={() => agregarAlCarrito(product)}
                    disabled={product.stock === 0}
                >
                    {product.stock === 0 ? "Agotado" : "Añadir"}
                </button>
                <Link to={`/productos/${product.id}`} className="btn btn-outline" style={{ width: '100%' }}>
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
