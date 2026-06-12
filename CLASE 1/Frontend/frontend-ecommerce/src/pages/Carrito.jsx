import { useContext,useState } from "react";
import { ContextCart } from "../services/ContextCart.jsx";
import "../styles/Carrito.css";

export const Carrito = () => {
    const { carrito, eliminarDelCarrito, vaciarCarrito } = useContext(ContextCart);
    const [mensaje, setMensaje] = useState("");
    const total = carrito.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0);

    const handleRealizarPedido = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMensaje("Debes iniciar sesión para finalizar tu pedido.");
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/realizarPedido`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ carrito })
            });

            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}. No se encontró la ruta en el servidor`);
            } 

            const data = await res.json();
            console.log("Pedido Creado Exitosamente", data);
            vaciarCarrito();
            setMensaje("¡Tu pedido ha sido procesado con éxito!");

        } catch (error) {
            console.error("Error al realizar el pedido:", error);
            setMensaje("Hubo un error al procesar tu compra. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="cart-container">
            <h2 className="cart-title">Carrito de Compras</h2>
            {mensaje && (
                <div style={{ padding: '12px', marginBottom: '20px', borderRadius: '6px', background: mensaje.includes('éxito') ? '#e8f5e9' : '#ffebee', color: mensaje.includes('éxito') ? '#2e7d32' : '#c62828', fontWeight: '500' }}>
                    {mensaje}
                </div>
            )}

            {carrito.length === 0 ? (
                <div className="cart-empty">
                    <p style={{ fontSize: '1.2rem', margin: 0 }}>Tu carrito está vacío actualmente.</p>
                </div>
            ) : (
                <div>
                    <ul className="cart-list">
                        {carrito.map((item) => {
                            const precioItem = Number(item.precio) || 0;
                            const subtotalItem = precioItem * item.cantidad;

                            return (
                                <li key={item.producto_id} className="cart-item">
                                    <div className="item-info">
                                        <span className="item-name">{item.nombre}</span>
                                        <span className="item-meta">
                                                Color: {item.color} | Talla: {item.talla} — ${precioItem.toFixed(2)} x {item.cantidad}
                                        </span>
                                    </div>
                                    
                                    <span className="item-subtotal">
                                        ${subtotalItem.toFixed(2)}
                                    </span>

                                    <button 
                                        className="btn-remove"
                                        onClick={() => eliminarDelCarrito(item.producto_id)}
                                    >
                                        Quitar
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="cart-summary">
                        <div>
                            <span className="total-label">Total estimado:</span>
                            <span className="total-price">${total.toFixed(2)}</span>
                        </div>

                        <button className="btn-checkout" onClick={handleRealizarPedido}>
                            Finalizar la Compra
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};