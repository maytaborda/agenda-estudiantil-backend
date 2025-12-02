const mongoose = require('mongoose');

const trabajoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    materia: {
        type: String,
        required: [true, 'La materia es obligatoria'],
        trim:true
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    descripcion: {
        type: String,
        required: [true, 'Descripción obligatoria'],
        trim: true
    }
},{
    timestamps: true
});

module.exports = mongoose.model('Trabajo', trabajoSchema);