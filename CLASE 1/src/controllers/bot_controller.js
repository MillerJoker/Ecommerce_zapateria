import { GoogleGenAI } from "@google/genai";
import pool from "../db/connection.js";

const ai = new GoogleGenAI({});

export const consultarBot = async (req, res) => {

    const { pregunta } = req.body;
    if (!pregunta) {
        return res.status(400).json({ error: "Hazme una pregunta" });
    }

    try {
        const[row]= await pool.query(`
            SELECT p.id_producto, p.nombre, p.descripcion, p.marca, p.precio, c.nombre_categoria AS categoria, 
            (SELECT SUM(stock) FROM variantes_producto WHERE id_producto = p.id_producto) AS stock
            FROM productos p 
            INNER JOIN categorias c ON p.id_categoria = c.id_categoria`    
        );
        //Convertir los productos a un formato legible para el bot
        const catalagoTexto = row.map(p => `Producto: ${p.nombre},
            Marca: ${p.marca},
            Descripcion: ${p.descripcion},
            Precio: ${p.precio},
            Stock: ${p.stock || 0},  
            Categoria: ${p.categoria}`).join("\n");

        const prompt = `
        Eres el asistente virtual de nuestra Tienda E-commerce de Zapatos (Zapateria) de Ecuador.
        Reglas:
        1. "Eres amable,cordial con los usuarios, ademas se breve y habla español"
        2.Envios:"Enviamos a todo el pais por ServiEntrega ($5 adicionales)"
        3.Pagos: "Aceptamos transferencias del banco pichincha,produbanco,pacifico son los unicos que aceptamos y tarjetas de credito"
        4.Si te preguntan algo fuera de la tienda,responde que solo ayudas con compras

        INVENTARIO DE PRODUCTOS
        ${catalagoTexto}

        Reglas sobre el inventario:
        1. Si te preguntan por un producto, responde con su descripcion, precio y stock
        2. Si el producto no esta en el inventario, responde que no lo tenemos disponible
        3. Si te preguntan por categorias, responde con los productos de esa categoria
        4. Si te preguntan por precios, responde con el precio del producto
        5. Si te preguntan por stock, responde con el stock del producto
        6. Si te preguntan por stock y es igual o menor a 0, responde que el producto esta agotado

        Pregunta del cliente: ${pregunta}`;
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
        });

        res.json({respuesta:response.text})



    } catch (error) {
        console.log("Error en el bot", error);
    }
  
}