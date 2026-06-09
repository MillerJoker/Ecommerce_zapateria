import { useState, useEffect } from "react";

export const MisPedidos = () => {
    const [pedidos, setPedidos] = useState([]);

    const obtenerPedidos = async () => {

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/pedidos/obtenerPedidos`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                });
            const data = await res.json();
            setPedidos(data.data);
            console.log(data.data);

        } catch (error) {
            console.log("Error en el servidor", error);
        }
    };
    useEffect(() => {
        obtenerPedidos();
    }, []);

    return (
        <div>
            Bienvenido a Tu Lista de Pedidos

            <table border="1">
                <thead>
                    <tr>
                        <th>ID Pedido</th>
                        <th>Total</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map(p => (
                        <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>${p.total}</td>
                            <td>{p.estado}</td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    )
}