const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err=> console.error('Error de conexión a MONGODB.', err));

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/examenes',require('./routes/examenes'));
app.use('/api/trabajos', require('./routes/trabajos'));
app.use('/api/horarios', require('./routes/horarios'));

//Ruta de prueba
app.get('/', (req,res) =>{
    res.json({message: 'API de Agenda Estudiantil funcionando'})
});

//Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
})