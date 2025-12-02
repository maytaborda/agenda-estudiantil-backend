const express = require('express');
const router = express.Router();
const Trabajo = require('../models/trabajo');
const auth = require('../middleware/Auth');

//Obtener todos los trabajos del usuario
router.get('/', auth, async (req, res) =>{
    try{
        const trabajos = await Trabajo.find({userId: req.userId})
            .sort({fecha:1});

        res.json(trabajos);
    } catch (error){
        console.error('Error al obtener trabajos:', error);
        res.status(500).json({message: 'Error al obtener trabajos'});
    }
});

//Crear un nuevo trabajo
router.post('/', auth, async (req, res) =>{
    try{
        const {materia,fecha,descripcion} =req.body;

        if(!materia || !fecha || !descripcion){
            return res.status(400).json({message: 'Todos los campos son obligatorios'});
        }

        const nuevoTrabajo = new Trabajo({
            userId: req.userId,
            materia,
            fecha,
            descripcion
        });

        await nuevoTrabajo.save();

        res.status(201).json({
            message: 'Trabajo creado exitosamente',
            trabajo: nuevoTrabajo
        });
    } catch (error){
        console.error('Error al crear el trabajo:', error);
        res.status(500).json({
            message: 'Error al crear el trabajo',
            error: error.message
        });
    }
});

//Eliminar un trabajo
router.delete('/:id', auth, async (req, res) => {
    try {
        const trabajo = await Trabajo.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if(!trabajo){
            return res.status(404).json({message:'Trabajo no encontrado'})
        }
        res.json({message: 'Trabajo eliminado exitosamente'})
    } catch (error){
        console.error('Error al eliminar trabajo:', error);
        res.status(500).json({message: 'Error al eliminar trabajo'})
    }
});

// Actualizar un trabajo
router.put('/:id', auth, async (req, res) => {
  try {
    const { materia, fecha, descripcion } = req.body;

    if (!materia || !fecha || !descripcion) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios' 
      });
    }

    const trabajo = await Trabajo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { materia, fecha, descripcion },
      { new: true }
    );

    if (!trabajo) {
      return res.status(404).json({ message: 'Trabajo no encontrado' });
    }

    res.json({
      message: 'Trabajo actualizado exitosamente',
      trabajo
    });
  } catch (error) {
    console.error('❌ ERROR al actualizar trabajo:', error);
    res.status(500).json({ message: 'Error al actualizar trabajo' });
  }
});

module.exports = router;