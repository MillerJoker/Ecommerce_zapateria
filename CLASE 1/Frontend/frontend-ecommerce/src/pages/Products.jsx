import { Link } from "react-router-dom";
import { CardProduct } from "../components/CardProduct.jsx";
import { useContext, useState, useEffect } from "react";
import { ContextCart } from "../services/ContextCart.jsx";

export const Productos = () => {
    const [buscar, setBuscar] = useState("");
    const [productos, setProductos] = useState([]);
    const { agregarAlCarrito } = useContext(ContextCart);

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos`);
                const data = await response.json();
                setProductos(data.productos || []);
            } catch (error) {
                console.error("Error fetching productos:", error);
            }
        };

        fetchProductos();
    }, []);

    const productosFiltrados = productos.filter((prod) =>
        prod.nombre.toLowerCase().includes(buscar.toLowerCase())
    );

    return (
        <div className="container" style={{ textAlign: "center" }}>
            <h1 style={{ marginBottom: '1rem', marginTop: '2rem' }}>Nuestra Colección</h1>
            <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Calzado diseñado para durar, con el estilo de Dr. Pie.</p>
            
            <input
                type="text"
                placeholder="Buscar calzado..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                className="search-input"
            />

            <div className="card-grid">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map((prod) => (
                        <CardProduct key={prod.id} product={prod} />
                    ))
                ) : (
                    <p style={{ gridColumn: '1/-1' }}>Cargando productos...</p>
                )}
            </div>
        </div>
    );
};
