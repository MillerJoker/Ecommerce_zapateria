import { useState, useEffect } from "react"

export const AdminProductos = () => {
    const [productos, setProductos] = useState([]);
    const [categorias, setCategoria] = useState([]);
    const [mensaje,setMensaje]=useState("");

    const [form,setForm] = useState({
        categoria_id :"",
        nombre:"",
        descripcion:"",
        precio:"",
        stock:""
        });
    
    const [editandoId,setEditandoId]=useState(null);

    useEffect(() => {
        listarProductos();
        obtenerCategorias();
    }, []);
    const listarProductos = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos`);
            const data = await response.json();
            setProductos(data.productos);
            console.log("Productos obtenidos:", data.productos);
        } catch (error) {
            console.error("Error fetching productos:", error);
        }
    };
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

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]:e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje("");

        const metodo = editandoId ? "PUT" : "POST";
        const url = editandoId
        ? `${import.meta.env.VITE_PUBLIC_URL}/productos/${editandoId}`
        : `${import.meta.env.VITE_PUBLIC_URL}/productos/`
        const token = localStorage.getItem("token");

        try{
            const res = await fetch(url,{
                method:metodo,
                headers:{
                    "Content-Type":"application/json",
                    "Authorization": `Bearer ${token}`
                },
                body:JSON.stringify(form)
            });
            const data = await res.json();

            if(res.ok){
                setMensaje(`Producto ${editandoId} ? 'actualizado' : 'creado'} con exito `);
                setForm({ categoria_id :"",nombre:"", descripcion:"", precio:"", stock:""});
                setEditandoId(null);
                listarProductos();
            }else{
                setMensaje("Error"+data.error);
            }

        }catch(error){
            console.error("error guardando producto",error);
            setMensaje("Error de conexion al guardar");

        }

    };

    const handleEditar = (prod) => {
        setEditandoId(prod.id);
        const CategoriaEncontrada = categorias.find(c => c.nombre === prod.categoria);

        setForm({
            categoria_id: CategoriaEncontrada ? CategoriaEncontrada.id : "",
            nombre:prod.nombre,
            descripcion:prod.descripcion,
            precio:prod.precio,
            stock:prod.stock
        });
    };

    const handleEliminar = async (id) =>{
        if(!window.confirm("Seguro que deseas eliminar este prodicto")) return;

        try{
             const res = await fetch(`${import.meta.env.VITE_PUBLIC_URL}/productos/${id}`,{
                method:"DELETE"
             });
            
             if(res.ok){
                setMensaje("Producto Eliminado");
                listarProductos();
             }
             else{
                const data = await res.json();
                setMensaje("Error" + data.error);
             }

        }catch(error){
            console.error("Error al eliminar",error);
        }
    };



    return (
        <div>
            <h1>Gestion De Productos</h1>
            {mensaje && <p>{mensaje}</p>}
          

            <form onSubmit={handleSubmit}>
              <select name="categoria_id" value={form.categoria_id} onChange={handleChange} required>
                <option value="">------Selecciona una Categoria---------</option>
                {categorias.map (cat => (
                    <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
            </select>

            <br />
            <br />
            <input type="text" name="nombre" placeholder="Nombre del Producto" value={form.nombre} onChange={handleChange}  required/>
            <br />
            <br />
            <input type="text" name="descripcion" placeholder="Ingresa la Descripcion" value={form.descripcion} onChange={handleChange} required/>
            <br />
            <br />
            <input type="number" name="precio" step="0.01" placeholder="Ingresa el precio" value={form.precio} onChange={handleChange} required/>
            <br />
            <br />
            <input type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required/>
            <br />
            <br />

            <button type="submit">
                {editandoId ? "Actualizar Producto" : "Guardar Producto"}
            </button>

            </form>

            <h2>Listado de Productos</h2>
            <table border="1">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Categoria</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map((prod) => (
                    <tr key={prod.id} style={{ width: "200px" }}>
                         <td>{prod.nombre}</td>
                        <td>{prod.categoria}</td>
                        <td>{prod.stock}</td>
                        <td>
                         <button onClick={() => handleEditar(prod)}>
                            Editar

                         </button>
                         <button onClick={() => handleEliminar(prod.id)}>
                            Eliminar
                         </button>
                        </td>
                    
                    </tr>
                ))}

                </tbody>

            </table>
        </div>
    )
}