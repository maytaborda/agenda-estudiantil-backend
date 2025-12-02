const express = require('express');
const router = express.Router();
const Horario = require('../models/Horario');
const auth = require('../middleware/Auth');

//Obtener todo el horario del usuario
router.get('/', auth,async(req,res)=>{
    try{
        const horarios = await Horario.find({userId:req.userId});
        res.json(horarios)
    } catch (error){
        console.error('Error al obtener horarios',error)
        res.status(500).json({message:'Error al obtener horarios'})
    }
});

//Crear una nueva clase
router.post('/', auth, async (req,res)=>{
    try{
        const {dia, horaInicio, horaFin, materia} =req.body;

        if (!dia || !horaInicio || !horaFin || !materia) {
            return res.status(400).json({ 
                message: 'Todos los campos son obligatorios' 
            });
        }

        const nuevoHorario = new Horario({
            userId:req.userId,
            dia,
            horaInicio,
            horaFin,
            materia
        });

        await nuevoHorario.save();

        res.status(201).json({
            message: 'Clase agregada exitosamente',
            horario: nuevoHorario
        });
    } catch (error){
        console.error('Error al agregar horario',error)
        res.status(500).json({
            message:'Error al agregar horario',
            error: error.message
        });
    }
});

//Eliminar una clase del horario
router.delete('/:id', auth, async (req,res)=>{
    try{
        const horario = await Horario.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if(!horario){
            return res.status(404).json({message: 'Clase no encontrada'});
        }

        res.json({message: 'Clase eliminada exitosamente'});
    } catch (error){
        console.error('Error al eliminar horario:', error);
        res.status(500).json({ message: 'Error al eliminar horario' });
    }
})

module.exports = router;