import { IRol } from '../interfaces/IRol';
import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'

var Schema = mongoose.Schema;
var rolSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: true
    },
    permisos: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Permiso'
        }]
    },
    pantallaOrigen: {
        type: String,
        default: '/empresas'
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa'
    },
    updated_for: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }
}, { versionKey: '_version' });
rolSchema.index({ nombre: 1, empresa: 1 }, { unique: true });
rolSchema.plugin(mongooseHistory);

export default mongoose.model<IRol & mongoose.Document>('Rol', rolSchema);