import 'dotenv/config'
import express from 'express';
import authRoutes from './routes/auth.js';
import { loggerDetallado } from './middlewares/avanzado.js';
import sistemEventos from './events/sistemaEventos.js';
import productoRoutes from './routes/producto.js';
import categoriasRoutes from './routes/categoria.js'
import pedidosRoutes from './routes/pedidos.js';
import botRoutes from './routes/bot.js';
import cors from 'cors';
import contactoRoutes from './routes/contacto.js';


const app = express();

const Port = process.env.PORT;


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET','POST','PUT','DELETE'],
    allowedHeaders: ['Content-Type','Authorization']
}));
app.use(express.json());
app.use(loggerDetallado);

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/productos", productoRoutes);
app.use("/api/v1/categorias",categoriasRoutes);
app.use("/api/v1/pedidos",pedidosRoutes);
app.use("/api/v1/bot", botRoutes);
app.use("/api/v1/contacto",contactoRoutes);

app.use((err,req,res,next) => {
    console.error(`${err.message}`);
    res.status(500).json({error:"Algo salio mal"});
})

app.get('/',(req,res) => {
    res.send('<h1>Hola Mundo con express </h1>');
});

app.listen(Port,()=>{
console.log(`Servidor en http://localhost:${Port}`);
});