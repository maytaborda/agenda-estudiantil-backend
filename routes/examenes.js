const express = require('express');
const router = express.Router();
const Examen = require('../models/Examen');
const auth = require('../middleware/auth');

//Obtener todos los examenes del usuario
router.get('/', auth, async (req, res) =>{
    try {
        const examenes = await Examen.find({ userId: req.userId})
            .sort({fecha:1}); //Ordernar por fecha ascendente (proximos primero)

        res.json(examenes);
    } catch (error){
        console.error('Error al obtener exámenes: ', error);
        res.status(500).json({message: 'Error al obtener exámenes'});
    }
});

//Crear nuevo examen
router.post('/', auth, async (req,res)=>{
    try{
        const {materia,fecha,temas} = req.body;

        if (!materia || !fecha || !temas){
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        const nuevoExamen = new Examen({
            userId: req.userId,
            materia,
            fecha,
            temas
        });

        await nuevoExamen.save();

        res.status(201).json({
            message:'Examen creado exitosamente',
            examen: nuevoExamen
        });
    } catch (error){
        console.error('Error al crear examen: ', error);
        res.status(500).json({
            message: 'Error al crear examen',
            error: error.message
        });
    }
});

//Eliminar un examen
router.delete('/:id', auth, async (req,res)=>{
    try{
        const examen = await Examen.findOneAndDelete({
            _id: req.params.id,
            userId:req.userId
        });

        if (!examen){
            return res.status(404).json({message:'Examen no encontrado'});
        }
        res.json({message: 'Examen eliminado exitosamente'});
    } catch (error){
        console.error('Error al eliminar examen:', error);
        res.status(500).json({message:'Error al eliminar examen'});
    }
});

// Actualizar un examen
router.put('/:id', auth, async (req, res) => {
  try {
    const { materia, fecha, temas } = req.body;

    if (!materia || !fecha || !temas) {
      return res.status(400).json({ 
        message: 'Todos los campos son obligatorios' 
      });
    }

    const examen = await Examen.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { materia, fecha, temas },
      { new: true }
    );

    if (!examen) {
      return res.status(404).json({ message: 'Examen no encontrado' });
    }

    res.json({
      message: 'Examen actualizado exitosamente',
      examen
    });
  } catch (error) {
    console.error('❌ ERROR al actualizar examen:', error);
    res.status(500).json({ message: 'Error al actualizar examen' });
  }
});

module.exports = router;

