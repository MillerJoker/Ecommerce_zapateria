import { useState } from "react";
import "../styles/Contact.css";

export const Contact = () => {
    const [formData, setFormData] = useState({
        nombre_completo: "",
        email: "",
        telefono: "",
        comentario: ""
    });

    const [mensajeEstado, setMensajeEstado] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensajeEstado("");
        
        try {
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/contacto/crearContacto`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setMensajeEstado("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
                setFormData({ nombre_completo: "", email: "", telefono: "", comentario: "" });
            } else {
                setMensajeEstado(data.error || "Hubo un error al procesar tu solicitud.");
            }
        } catch (error) {
            console.error("Error en la conexión con el servidor:", error);
            setMensajeEstado("No se pudo establecer conexión con el servidor.");
        }
    };

    return (
        <div className="contact-container">
            <h1 className="contact-title">Contáctanos</h1>
            <p className="contact-subtitle">
                Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nosotros.
            </p>

            <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-group">
                    <label className="contact-label">Nombre Completo *</label>
                    <input
                        type="text"
                        name="nombre_completo"
                        value={formData.nombre_completo}
                        onChange={handleChange}
                        required
                        className="contact-input"
                        placeholder="Ej. Maria Benavides"
                    />
                </div>

                <div className="contact-group">
                    <label className="contact-label">Correo Electrónico *</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="contact-input"
                        placeholder="ejemplo@correo.com"
                    />
                </div>

                <div className="contact-group">
                    <label className="contact-label">Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="contact-input"
                        placeholder="Ej. 0999999999"
                    />
                </div>

                <div className="contact-group">
                    <label className="contact-label">Comentario o Mensaje *</label>
                    <textarea
                        name="comentario"
                        value={formData.comentario}
                        onChange={handleChange}
                        required
                        className="contact-textarea"
                        placeholder="Escribe los detalles de tu consulta aquí..."
                    ></textarea>
                </div>

                <button type="submit" className="contact-button">
                    Enviar Mensaje
                </button>
            </form>

            {mensajeEstado && (
                <p className="contact-status">
                    {mensajeEstado}
                </p>
            )}
        </div>
    );
};