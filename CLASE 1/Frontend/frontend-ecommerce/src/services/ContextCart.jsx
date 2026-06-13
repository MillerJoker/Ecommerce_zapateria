import { createContext, useState } from "react";

export const ContextCart = createContext();

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState([]);

    const agregarAlCarrito = (producto) => {
        setCarrito((prev) => {
            // Evaluamos existencia usando la estructura limpia y simétrica
            const existe = prev.find((item) => 
                item.id_producto === producto.id_producto && 
                item.id_variante === producto.id_variante &&
                item.color === producto.color && 
                item.talla === producto.talla
            );

            if (existe) {
                return prev.map((item) =>
                    item.id_producto === producto.id_producto && 
                    item.id_variante === producto.id_variante &&
                    item.color === producto.color && 
                    item.talla === producto.talla
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
            }

            // Insertamos el nuevo objeto garantizando las propiedades esperadas por Carrito.jsx
            return [...prev, {
                id_producto: producto.id_producto,
                id_variante: producto.id_variante,
                nombre: producto.nombre, 
                precio: producto.precio,
                imagen_url: producto.imagen_url,
                color: producto.color, 
                talla: producto.talla, 
                cantidad: 1
            }];
        });
    };

    const eliminarDelCarrito = (id_producto, color, talla) => {
        setCarrito(prev => prev.filter(item => 
            !(item.id_producto === id_producto && item.color === color && item.talla === talla)
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