import { useContext, useState } from "react";
import { ContextCart } from "../services/ContextCart.jsx";
import "../styles/Carrito.css";

export const Carrito = () => {
    const { carrito, eliminarDelCarrito, vaciarCarrito } = useContext(ContextCart);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(false);

    const total = carrito.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0);

    const handleRealizarPedido = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setMensaje("Debes iniciar sesión para finalizar tu pedido.");
            return;
        }

        // Validación preventiva antes de enviar la solicitud a Express
        const carritoInvalido = carrito.some(item => !item.id_variante);
        if (carritoInvalido) {
            setMensaje("Error: Algunos artículos no poseen una variante o SKU válido.");
            return;
        }

        setCargando(true);
        setMensaje("");

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/realizarPedido`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                // Enviamos la estructura exacta que tu pedidos_controller espera procesar
                body: JSON.stringify({ 
                    carrito: carrito, 
                    id_direccion: 1, // Id de prueba correspondiente a la dirección de Juan Pérez
                    metodo_pago: "Efectivo" 
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Error al procesar el pedido en el servidor.");
            } 

            console.log("Pedido Creado Exitosamente", data);
            vaciarCarrito();
            setMensaje("¡Tu pedido ha sido procesado con éxito! El inventario ha sido actualizado.");

        } catch (error) {
            console.error("Error al realizar el pedido:", error);
            setMensaje(error.message || "Hubo un error al procesar tu compra. Inténtalo de nuevo.");
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="cart-container">
            <h2 className="cart-title">Carrito de Compras</h2>
            {mensaje && (
                <div style={{ 
                    padding: '12px', 
                    marginBottom: '20px', 
                    borderRadius: '6px', 
                    background: mensaje.includes('éxito') ? '#e8f5e9' : '#ffebee', 
                    color: mensaje.includes('éxito') ? '#2e7d32' : '#c62828', 
                    fontWeight: '500' 
                }}>
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
                            const itemKey = `${item.id_producto}-${item.color || 'sin-color'}-${item.talla || 'sin-talla'}`;

                            return (
                        <li key={itemKey} className="cart-item">
                            <div className="item-info">
                                <span className="item-name">{item.nombre}</span>
                                <span className="item-meta">
                                    Color: {item.color || "N/A"} | Talla: {item.talla || "N/A"} — ${precioItem.toFixed(2)} x {item.cantidad}
                                </span>
                            </div>
                            
                            <span className="item-subtotal">
                                ${subtotalItem.toFixed(2)}
                            </span>

                            <button 
                                className="btn-remove"
                                // CAMBIO AQUÍ: Usamos item.id_producto
                                onClick={() => eliminarDelCarrito(item.id_producto, item.color, item.talla)}
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

                        <button 
                            className="btn-checkout" 
                            onClick={handleRealizarPedido}
                            disabled={cargando}
                            style={{ opacity: cargando ? 0.6 : 1, cursor: cargando ? 'not-allowed' : 'pointer' }}
                        >
                            {cargando ? "Procesando..." : "Finalizar la Compra"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};