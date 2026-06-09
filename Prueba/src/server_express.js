import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import librosRoutes from './routes/libros.js';
import sociosRoutes from './routes/socios.js';

const app = express();
const Port = process.env.PORT;

app.use(cors());
app.use(express.json());
app.get('/',(req,res) => {
    res.send('<h1>Hola Mundo con express </h1>');
});

app.use("/api/v1/libros",librosRoutes);
app.use("/api/v1/socios",sociosRoutes);

app.listen(Port,()=>{
console.log(`Servidor en http://localhost:${Port}`);
});