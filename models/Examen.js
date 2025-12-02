const mongoose = require('mongoose');

const examenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    materia: {
        type: String,
        required: [true, 'La materia es obligatoria'],
        trim: true
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    temas: {
        type: String,
        required: [true, 'Los temas son obligatorios'],
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Examen', examenSchema);