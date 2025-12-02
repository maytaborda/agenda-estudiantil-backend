const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dia:{
        type: String,
        enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        required: [true,'El día es obligatorio']
    },
    horaInicio: {
    type: String,
    required: [true, 'La hora de inicio es obligatoria']
  },
  horaFin: {
    type: String,
    required: [true, 'La hora de fin es obligatoria']
  },
  materia: {
    type: String,
    required: [true, 'La materia es obligatoria'],
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Horario', horarioSchema);