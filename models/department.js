const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const DepartmentSchema = mongoose.Schema({
    floor: {
        type: Schema.Types.ObjectId,
        ref: 'Floor',
        required: [true, "El piso asociado es necesario"],
        index: true
    },
    number: {
        type: Number,
        required: [true, "El número de departamento es necesario"]
    },
    status: {
        type: Number
    },
    recordActive: {
        type: Boolean,
        default: true
    }
});

const Department = module.exports = mongoose.model('Department', DepartmentSchema);