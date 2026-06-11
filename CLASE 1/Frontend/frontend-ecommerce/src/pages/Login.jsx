import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mensajeExitoso, setMensajeExitoso] = useState("");
    const [mensajeIncorrecto, setMensajeIncorrecto] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeExitoso("");
        setMensajeIncorrecto("");

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token);
                setMensajeExitoso("Bienvenido de nuevo a Dr. Pie");
                setTimeout(() => {
                    navigate("/");
                }, 1500);
            } else {
                setMensajeIncorrecto("Credenciales inválidas. Por favor intente de nuevo.");
            }
        } catch (error) {
            setMensajeIncorrecto("Error de conexión al servidor.");
        }
    };

    return (
        <div className="container" style={{ textAlign: "center" }}>
            <div className="form-container">
                <h1 style={{ marginBottom: '0.5rem' }}>Dr. Pie</h1>
                <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Ingrese a su cuenta</p>

                {mensajeExitoso && <p style={{ color: "green", marginBottom: '1rem' }}>{mensajeExitoso}</p>}
                {mensajeIncorrecto && <p style={{ color: "red", marginBottom: '1rem' }}>{mensajeIncorrecto}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ textAlign: "left", marginBottom: "1rem" }}>
                        <label>Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="su@email.com"
                        />
                    </div>
                    <div className="form-group" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                        <label>Contraseña</label>
                        <input
                            type="password"
                            className="form-control"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>
                    
                    {/* CORRECCIÓN: Contenedor con distribución en columna (Flexbox vertical) */}
                    <div className="form-actions" style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "0.75rem", 
                        marginTop: "1.5rem",
                        alignItems: "stretch" 
                    }}>
                        
                        {/* El botón de Iniciar Sesión abarcará todo el ancho */}
                        <button 
                            type="submit" 
                            className="btn btn-primary" 
                            style={{ width: "100%", padding: "0.75rem", boxSizing: "border-box" }}
                        >
                            Iniciar Sesión
                        </button>

                        {/* El botón de Crear Cuenta abarcará todo el ancho ordenadamente justo abajo */}
                        <Link 
                            to="/Register" 
                            className="btn btn-outline" 
                            style={{ 
                                width: "100%", 
                                padding: "0.75rem", 
                                boxSizing: "border-box", 
                                textDecoration: "none", 
                                display: "inline-block",
                                textAlign: "center"
                            }}
                        >
                            Crear Cuenta
                        </Link>

                        {/* Enlace de regreso completamente centrado en la parte inferior */}
                        <Link 
                            to="/" 
                            style={{ 
                                fontSize: '0.85rem', 
                                marginTop: '0.5rem', 
                                color: 'gray', 
                                textDecoration: "none",
                                display: "block",
                                textAlign: "center"
                            }}
                        >
                            Regresar a la tienda
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};