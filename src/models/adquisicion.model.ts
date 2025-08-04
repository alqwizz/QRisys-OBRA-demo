import { IAdquisicion } from '../interfaces/IAdquisicion';
import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'

var Schema = mongoose.Schema;
var adquisicionSchema = new Schema({
    idAdquisicion: {
        type: String
    },
    tipo: {
        type: String,
        enum: ['MATERIAL', 'MANO DE OBRA', 'MAQUINA', 'OTROS'],
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    precio: Number,
    unidad: String,
    proyecto: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
        required: true
    },
    empresaSubcontrata: {
        type: Schema.Types.ObjectId,
        ref: 'EmpresaSubcontrata',
        required: true
    },
    tareas: {
        type: [{ tarea: { type: Schema.Types.ObjectId, ref: 'Tarea' }, factor: { type: Number, default: 1 } }]
    },
    updated_for: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }
}, { versionKey: '_version' });
adquisicionSchema.plugin(mongooseHistory);
adquisicionSchema.index({ nombre: 1, empresaSubcontrata: 1 }, { unique: true });
adquisicionSchema.index({ empresaSubcontrata: 1 });

export default mongoose.model<IAdquisicion & mongoose.Document>('Adquisicion', adquisicionSchema);
