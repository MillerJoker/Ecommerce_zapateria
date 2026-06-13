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
                    item.producto_id === producto.id_producto && 
                    item.color === producto.color_elegido && 
                    item.talla === producto.talla_elegida
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }

            return [...prev, {
                producto_id: producto.id_producto,
                id_variante: producto.id_variante_elegida, // <-- IMPORTANTE: Guarda el ID de la variante aquí
                nombre: producto.nombre, 
                precio: producto.precio,
                color: producto.color_elegido, 
                talla: producto.talla_elegida, 
                cantidad: 1
            }];
        });
    };

    const eliminarDelCarrito = (producto_id, color, talla) => {
        setCarrito(prev => prev.filter(item => 
            !(item.producto_id === producto_id && item.color === color && item.talla === talla)
        ));
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