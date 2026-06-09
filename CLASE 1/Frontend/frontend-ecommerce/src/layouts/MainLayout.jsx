import { Outlet, Link } from "react-router-dom";
import { ContextCart } from "../services/ContextCart";
import { useContext } from "react";
import { FloatingChatBot } from "../components/FloatingChatBot";

export const MainLayout = () => {
    const { carrito } = useContext(ContextCart);
    const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

    return (
        <div className="layout-wrapper">
            <nav className="navbar">
                <div className="brand">
                    <Link to="/">Dr. Pie</Link>
                </div>
                <div className="nav-links">
                    <Link to="/" className="nav-link">Inicio</Link>
                    <Link to="/productos" className="nav-link">Zapatos</Link>
                    <Link to="/categorias" className="nav-link">Colecciones</Link>
                    <Link to="/contacto" className="nav-link">Contacto</Link>
                    <Link to="/adminProductos" className="nav-link">Admin</Link>
                    <Link to="/carrito" className="nav-link">
                        Carrito ({cantidadItems})
                    </Link>
                    <Link to="/Login" className="nav-link nav-auth">
                        Ingresar
                    </Link>
                </div>
            </nav>

            <main className="main-content">
                <Outlet />
            </main>

            <FloatingChatBot />

            <footer>
                <div className="footer-content">
                    <div className="footer-brand">Dr. Pie - Calzado de Excelencia</div>
                    <p>Diseño sobrio, comodidad inigualable.</p>
                    <div className="footer-links">
                        <Link to="/">Sobre nosotros</Link>
                        <Link to="/contacto">Soporte</Link>
                        <Link to="/productos">Tienda</Link>
                        <Link to="/Register">Únete al club</Link>
                    </div>
                    <p style={{ fontSize: '0.7rem', opacity: 0.5 }}>
                        © {new Date().getFullYear()} Dr. Pie. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
};
