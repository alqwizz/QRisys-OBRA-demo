import { ICertificacion } from "../interfaces/ICertificacion";
import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'

var Schema = mongoose.Schema;
var certificacionSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        minLength: 3,
        trim: true
    },
    fInicio: {
        type: Date,
        required: true,
    },
    fFin: {
        type: Date,
        required: true,
    },
    sobreCoste: Number,
    costeCert: { type: Number, required: true },
    costeTotal: { type: Number, required: true },
    perCert: { type: Number, required: true },
    perTotal: { type: Number, required: true },
    validada: { type: Boolean, required: true },
    updated_for: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    },
    proyecto: {
        type: Schema.Types.ObjectId,
        ref: 'Proyecto',
    },
}, { versionKey: '_version' });
certificacionSchema.plugin(mongooseHistory);

export default mongoose.model<ICertificacion & mongoose.Document>('Certificacion', certificacionSchema);
