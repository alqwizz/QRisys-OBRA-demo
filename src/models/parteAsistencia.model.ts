import { IParteAsistencia } from "../interfaces/IParteAsistencia";
import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'

var Schema = mongoose.Schema;
var parteAsistenciaSchema = new Schema({
    asistentes: [{
        nombre: {
            type: String,
            required: true
        },
        dni: {
            type: String,
            required: true
        },
        asiste: {
            type: Boolean,
            required: true
        },
        horas: {
            type: Number,
            required: true
        }
    }],
    proyecto: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
        required: true
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'EmpresaSubcontrata',
        required: true
    },
    fecha: Date,
    updated_for: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }
}, { versionKey: '_version' });

parteAsistenciaSchema.plugin(mongooseHistory);
export default mongoose.model<IParteAsistencia & mongoose.Document>('ParteAsistencia', parteAsistenciaSchema);
