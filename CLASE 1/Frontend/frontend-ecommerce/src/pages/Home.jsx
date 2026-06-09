import { Link } from "react-router-dom";

export const Home = () => {
    return (
        <div className="home-page">
            <section className="hero-section">
                <h1>Elegancia a cada paso</h1>
                <p>Descubre nuestra colección exclusiva de calzado artesanal. Piel de la más alta calidad y diseño pensado para el caballero moderno.</p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link to="/productos" className="btn btn-primary">Ver Colección</Link>
                    <Link to="/mispedidos" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Mis Pedidos</Link>
                </div>
            </section>

            <section className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Artesanía y Comodidad</h2>
                <p style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem', color: '#666' }}>
                    En Dr. Pie creemos que un zapato no es solo un accesorio, es una declaración de intenciones. 
                    Nuestros maestros zapateros seleccionan las mejores pieles para garantizar durabilidad y un confort excepcional desde el primer día.
                </p>
            </section>
        </div>
    );
};
