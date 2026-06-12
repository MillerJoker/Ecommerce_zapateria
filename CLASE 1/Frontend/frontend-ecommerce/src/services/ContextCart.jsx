import { createContext, useState } from "react";

export const ContextCart = createContext();

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);

    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            const existe = prev.find((item) => 
                item.producto_id === producto.id_producto && 
                item.color === producto.color_elegido && 
                item.talla === producto.talla_elegida
            );

            if (existe) {
                return prev.map((item) =>
                    item.producto_id === producto.id 
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }

            
            return [...prev, {
                producto_id: producto.id_producto,
                nombre: producto.nombre, 
                precio: producto.precio,
                color: producto.color_elegido, 
                talla: producto.talla_elegida, 
                cantidad: 1
            }];
        });
    };

    const eliminarDelCarrito = (producto_id) => {
        setCarrito(carrito.filter(item => item.producto_id !== producto_id));
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    return (
        
        <ContextCart.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito }}>
            {children}
        </ContextCart.Provider>
    );
};