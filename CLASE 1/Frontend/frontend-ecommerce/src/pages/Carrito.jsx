import { useContext,useState } from "react";
import { ContextCart } from "../services/ContextCart.jsx";


export const Carrito = () => {
    const {carrito,eliminarDelCarrito,vaciarCarrito} = useContext(ContextCart);
    const {mensaje,setMensaje} =useState("");

    const total = carrito.reduce((acc, item) => acc +(item.precio * item.cantidad),0);

    const handleRealizarPedido = async () => {
        const token = localStorage.getItem("token");

        if(!token){
            console.log("Debes iniciar sesion");
            return;
        }

         try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/realizarPedido`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization" : `Bearer ${token}`
                
                },
                    body: JSON.stringify({ carrito})
            });
            

            if (!res.ok) {
                throw new Error(`Error HTTP: ${res.status}. No se encontro la ruta en el servidor`);

            } 

            const data = await res.json();
            console.log("Pedido Creado Exitosamente");
            vaciarCarrito();

        } catch (error) {
            console.log("Error al inciar sesion", error);
        }



    };

    return(
        <div>
            <h2>Carrito de Compras</h2>

            {carrito.length === 0 ? (
                <p>El carrito esta vacio</p>
            ) : (
                <div>
                    <ul>
                    {carrito.map((item) => (
                        <li key={item.producto_id}>
                            {item.nombre} - ${item.precio} x {item.cantidad} = ${item.precio * item.cantidad}

                            <button 
                            onClick={() => eliminarDelCarrito(item.producto_id)}
                            >
                                Quitar

                            </button>
                        </li>
                    ))}
                    </ul>
                    <h3>Total: ${total.toFixed(2)}</h3>

                    <button
                    onClick={handleRealizarPedido}
                    >
                        Finalizar la Compra
                    </button>
                </div>
            )}
        </div>
    )
} 