import { Router } from "express";
import {eventos } from "../events/sistemaEventos.js"
import { validarCampos, asynHandler } from "../middlewares/avanzado.js";
import pool from '../db/connection.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

router.post("/registro",
    validarCampos(["nombre", "apellido", "email", "password", "telefono"]),
    asynHandler(async (req, res) => {
        const { nombre, apellido, email, password, telefono } = req.body;

        const [usuariosPrevios] = await pool.query("SELECT 1 FROM usuarios WHERE email = ?", [email]);
        if (usuariosPrevios.length > 0) {
            return res.status(409).json({
                error: 'Email ya esta registrado'
            });
        }

        const hashPassword = await bcrypt.hash(password, 12);

        const [resultado] = await pool.query(
            "INSERT INTO usuarios(id_rol, nombre, apellido, email, password, telefono) VALUES (?,?,?,?,?,?)",
            [2, nombre, apellido, email, hashPassword, telefono]
        );

        const nuevoUsuario = { id_usuario: resultado.insertId, nombre, email };
        eventos.emit("usuario:registrado", nuevoUsuario);

        const token = jwt.sign(
            { id: nuevoUsuario.id_usuario, email: nuevoUsuario.email, nombre: nuevoUsuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(201).json({
            mensaje: "Registro exitoso",
            token: token,
            datos: nuevoUsuario
        });
    })
);

router.post("/login",
validarCampos(["email","password"]),
asynHandler(async (req,res) => {
    const {email,password} = req.body;
    const[rows] = await pool.query("SELECT * FROM usuarios WHERE email = ? ",[email]);
    if(rows.length === 0){
        return res.status(401).json({error: "Credenciales son invalidas o no existe el usuario creado"});

    }
    const usuario = rows[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if(!passwordValido){
         return res.status(401).json({error: "Credenciales son invalidas o no existe el usuario creado"});
    }
    const token = jwt.sign(
        {id:usuario.id_usuario,email:usuario.email,nombre:usuario.nombre},
        process.env.JWT_SECRET,
        {expiresIn: '2h'}
    );
     
   eventos.emit("usuarios:login",{usuario: usuario.email});

   res.json({mensaje:"Login Exitoso",token:token});

}));

router.get("/perfil",verifyToken,asynHandler(async(req,res) =>{
        const [ rows] = await pool.query("SELECT id_usuario,nombre,apellido,email,telefono,fecha_registro FROM usuarios WHERE id_usuario = ?",[req.usuario.id]);
        if(rows.length === 0){
            return res.status(404).json({
                error:"USUARIO NO ENCONTRADO"
            });

        }

        res.json({perfil:rows[0]});


    }));

export default router;