import { IPermiso } from '../interfaces/IPermiso';
import mongoose from 'mongoose';
var Schema = mongoose.Schema;
var permisoSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    codigo: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    tipo: {
        type: String,
        trim: true,
        required: true
    }
}, { versionKey: '_version' });

export default mongoose.model<IPermiso & mongoose.Document>('Permiso', permisoSchema);