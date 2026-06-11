import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:3000/api/v1/auth/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: name,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Ocurrió un error al registrarse");
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            alert("¡Bienvenido al club Dr. Pie!");
            navigate("/productos");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="container" style={{ textAlign: "center" }}>
            <div className="form-container">
                <h1 style={{ marginBottom: '0.5rem' }}>Únase a Dr. Pie</h1>
                <p style={{ marginBottom: '2rem', opacity: 0.7 }}>Forme parte de nuestra distinguida clientela</p>

                {error && <p style={{ color: "red", marginBottom: '1rem' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ textAlign: "left", marginBottom: "1rem" }}>
                        <label>Nombre Completo</label>
                        <input
                            type="text"
                            className="form-control"
                            value={name}
                            required
                            onChange={(e) => setName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </div>
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

                    {/* SOLUCIÓN AL DESBORDAMIENTO: Estructura vertical limpia con Flexbox */}
                    <div className="form-actions" style={{ 
                        display: "flex", 
                        flexDirection: "column", 
                        gap: "0.8rem", 
                        marginTop: "1.5rem",
                        alignItems: "stretch" 
                    }}>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            style={{ width: "100%", padding: "0.75rem", boxSizing: "border-box" }}
                        >
                            Registrarse
                        </button>
                        
                        <Link 
                            to="/Login" 
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
                            ¿Ya tiene cuenta? Inicie sesión
                        </Link>
                        
                        <Link 
                            to="/productos" 
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