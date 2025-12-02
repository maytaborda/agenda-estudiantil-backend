const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//RUTA: POST /api/auth/register
router.post('/register', async (req,res)=>{
    try {
        const { nombre, email, password} = req.body;

        //Validar que todos los campos esten presentes
        if (!nombre || !email || !password){
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        //verificar si el usuario ya existe
        const existeUsuario = await User.findOne({email});
        if (existeUsuario){
            return res.status(400).json({
                message: 'El email ya esta registrado'
            });
        }

        //encriptar constraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        //crear nuevo usuario
        const nuevoUsuario = new User ({
            nombre,
            email,
            password: passwordHash
        });

        await nuevoUsuario.save();

        //crear token JWT
        const token = jwt.sign(
            {id: nuevoUsuario._id},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            token,
            user: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });
    } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
}
});

//RUTA: POST /api/auth/login
router.post('/login', async (req,res)=>{
    try{
        const {email,password} = req.body;

        //Validar campos
        if (!email || !password){
            return res.status(400).json({
                message: 'Email y contraseña obligatorios'
            });
        }
        
        //Buscar usuario
        const usuario = await User.findOne({email});
        if (!usuario){
            return res.status(400).json({
                message: 'Credenciales inválidas'
            });
        }

        //Verificar contraseña
        const passwordValid =await bcrypt.compare(password, usuario.password);
        if (!passwordValid){
            return res.status(400).json({
                message: 'Credenciales inválidas'
            });
        }

        //crear token
        const token = jwt.sign(
            {id: usuario._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );

        res.json({
            message: 'Login exitoso',
            token,
            user: {
                id: usuario._id,
                nombre: usuario.nombre,
                email:usuario.email
            }
        });
    } catch (error){
        console.error(error);
        res.status(500).json({message:'Error en el servidor'})
    }
});

module.exports = router;

