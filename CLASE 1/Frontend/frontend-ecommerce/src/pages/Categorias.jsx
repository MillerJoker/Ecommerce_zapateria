import { useState, useEffect } from "react";
import { data, Link } from "react-router-dom";


export const Categorias = () => {
    const [categorias, setCategoria] = useState([]);
    const [nuevaCategoria, setNuevaCategoria] = useState("");

    const obtenerCategorias = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/obtenerCategorias`);
            const data = await res.json();
            if (res.ok) {
                setCategoria(data.categorias);
                console.log(data.categorias);


            } else {
                console.error("Error al cargar categorias", data.error);

            }

        } catch (error) {
            console.log("Error en el servidor", error);
        }


    };

    useEffect(() => {
        obtenerCategorias();
    }, []);


    const handleCrear = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/crearCategoria`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ nombre: nuevaCategoria })
                });
            const data = await res.json();
            if (res.ok) {
                console.log("Categoria creada existosamente");
                obtenerCategorias();
            }else{
                console.log("Error al crear categoria",data.error);
            }


        }catch(error){
            console.error("Error en el servidor",error);
        }

    }
     const handleEliminar = async (id) => {
        if(!window.confirm("Estas seguro de eliminar esta categoria")) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/categorias/eliminarCategoria/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({ nombre: nuevaCategoria })
                });
            const data = await res.json();
            if (res.ok) {
                console.log("Categoria Eliminada");
                obtenerCategorias();
            }else{
                console.log("Error al crear categoria",data.error);
            }


        }catch(error){
            console.error("Error en el servidor",error);
        }

    }


    return (
        <div>
            <h1>Bienvenido a Categorias</h1>
            <div>
                <form onSubmit={handleCrear}>
                    <label >Nombre de la categoria:</label>
                    <input type="text"
                    value={nuevaCategoria}
                    onChange={(e) => setNuevaCategoria(e.target.value)}
                    required
                    />

                    <button type="submmit">Guardar</button>
                </form>
            </div>

            <h3>Listado de Categorias</h3>
            <ul>
                {categorias.map((cat) => (
                    <li key={cat.id}>
                        <h3>{cat.nombre}</h3>
                        <button 
                        onClick={() => handleEliminar(cat.id)}
                        >ELIMINAR</button>
                    </li>
                ))}
            </ul>
        </div>
    )

}