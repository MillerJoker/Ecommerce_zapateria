import { Outlet, Link, useNavigate } from "react-router-dom";
import { ContextCart } from "../services/ContextCart";
import { useContext, useState, useEffect } from "react";
import { FloatingChatBot } from "../components/FloatingChatBot";

export const MainLayout = () => {
    const { carrito } = useContext(ContextCart);
    const cantidadItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const navigate = useNavigate();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    const checkAuth = () => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const payload = JSON.parse(window.atob(base64));
        
                setUserName(payload.nombre || "Cliente"); 
            } catch (error) {
                const savedName = localStorage.getItem("userName");
                setUserName(savedName || "Cliente");
            }
        } else {
            setIsLoggedIn(false);
            setUserName("");
        }
    };

    useEffect(() => {
        checkAuth();
        window.addEventListener("storage", checkAuth);
        return () => {
            window.removeEventListener("storage", checkAuth);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        setIsLoggedIn(false);
        setUserName("");
        navigate("/");
    };

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

                    {isLoggedIn ? (
                        <div className="nav-auth-container" style={{ display: "flex", alignItems: "center", gap: "1rem", marginLeft: "10px" }}>
                            <span className="nav-user-welcome" style={{ color: "#c5a059", fontWeight: "600", fontSize: "0.9rem", textTransform: "uppercase" }}>
                                ¡Hola, {userName}!
                            </span>
                            <button 
                                onClick={handleLogout}
                                className="nav-link"
                                style={{
                                    background: "transparent",
                                    border: "1px solid #c5a059",
                                    color: "#c5a059",
                                    padding: "0.3rem 0.7rem",
                                    cursor: "pointer",
                                    borderRadius: "4px",
                                    fontSize: "0.8rem",
                                    fontWeight: "bold",
                                    transition: "all 0.3s ease"
                                }}
                            >
                                Salir
                            </button>
                        </div>
                    ) : (
                        <Link to="/Login" className="nav-link nav-auth">
                            Ingresar
                        </Link>
                    )}
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