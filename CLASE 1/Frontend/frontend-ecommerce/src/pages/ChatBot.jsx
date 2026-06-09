import { useState } from "react"


export const ChatBot = () => {
    const [pregunta, setPregunta] = useState("");
    const [respuesta, setRespuesta] = useState("");
    const [cargando, setCargando] = useState(false);

    const enviarPregunta = async (e) => {
        e.preventDefault();
        setCargando(true);
        setRespuesta("");

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/bot/preguntar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ pregunta })
            });
            const data = await res.json();
            setRespuesta(data.respuesta);

        } catch (error) {
            setRespuesta("Error al contactar con el asistente");
        }finally{
            setCargando(false);
        }
    };



    return (
        <div>
            <h1>Aqui tendremos nuestro Chat Bot</h1>
            <form onSubmit={enviarPregunta}>
                <input 
                type="text"
                value={pregunta}
                placeholder="Ej: Cuanto cuesta el envio"
                onChange={(e) =>setPregunta(e.target.value)}
                required
                style={{width:"70%",padding:"10px"}}
                >
                </input>
                <button type="submit" disabled={cargando}  style={{width:"20%",padding:"10px",marginLeft:"10px",borderRadius:"50px"}}>
                    {cargando ? "Pensando..." : "Preguntar"}

                </button>
            </form>

            {respuesta && (
                <div style={{marginTop:"20px", padding:"15px",backgroundColor:"gray"}}>
                    <strong><p>{respuesta}</p></strong>
                </div>    
            )

            }
        </div>
    )
}