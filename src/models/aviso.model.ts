import { IAviso } from '../interfaces/IAviso';
import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'

var Schema = mongoose.Schema;
var avisoSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    minLength: 3,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
  },
  fecha: {
    type: Number,
    required: true,
  },
  proyecto: {
    type: Schema.Types.ObjectId,
    ref: 'Proyecto',
  },
  usuarios: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
    }]
  }
}, { versionKey: '_version' });
avisoSchema.plugin(mongooseHistory);

export default mongoose.model<IAviso & mongoose.Document>('Aviso', avisoSchema);
