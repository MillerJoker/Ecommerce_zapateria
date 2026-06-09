import { useState, useRef, useEffect } from "react";

export const FloatingChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [pregunta, setPregunta] = useState("");
    const [mensajes, setMensajes] = useState([
        { role: 'bot', text: '¡Hola! Soy el asistente de Dr. Pie. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [cargando, setCargando] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [mensajes, isOpen]);

    const enviarPregunta = async (e) => {
        e.preventDefault();
        if (!pregunta.trim()) return;

        const nuevaPregunta = pregunta;
        setPregunta("");
        setMensajes(prev => [...prev, { role: 'user', text: nuevaPregunta }]);
        setCargando(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/bot/preguntar`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pregunta: nuevaPregunta })
            });
            const data = await res.json();
            setMensajes(prev => [...prev, { role: 'bot', text: data.respuesta }]);
        } catch (error) {
            setMensajes(prev => [...prev, { role: 'bot', text: "Lo siento, tuve un problema al procesar tu consulta. Inténtalo de nuevo más tarde." }]);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className={`floating-chat ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="chat-toggle" onClick={() => setIsOpen(true)}>
                    <span className="chat-icon">💬</span>
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div>
                            <strong>Asistente Dr. Pie</strong>
                            <div className="status">En línea</div>
                        </div>
                        <button className="close-btn" onClick={() => setIsOpen(false)}>×</button>
                    </div>

                    <div className="chat-messages">
                        {mensajes.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-content">{msg.text}</div>
                            </div>
                        ))}
                        {cargando && (
                            <div className="message bot">
                                <div className="message-content typing">Escribiendo...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className="chat-input" onSubmit={enviarPregunta}>
                        <input
                            type="text"
                            placeholder="Escribe tu duda..."
                            value={pregunta}
                            onChange={(e) => setPregunta(e.target.value)}
                        />
                        <button type="submit" disabled={cargando}>
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};
