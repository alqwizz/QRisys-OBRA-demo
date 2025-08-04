import { IEmpresa } from '../interfaces/IEmpresa';
import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'

var Schema = mongoose.Schema;
var empresaSchema = new Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    minLength: 3,
    maxlength: 150
  },
  cif: {
    type: String,
    required: true,
    maxlength: 25,
    trim: true
  },
  nombreContacto: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 150,
    trim: true
  },
  direccion: {
    type: String,
    maxlength: 250,
    trim: true
  },
  email: {
    type: String,
    match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    unique: true,
    trim: true,
    required: true
  },
  telefono: {
    type: String,
  },
  logo: {
    type: String
  },
  updated_for: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  }
}, { versionKey: '_version' });
empresaSchema.plugin(mongooseHistory);

export default mongoose.model<IEmpresa & mongoose.Document>('Empresa', empresaSchema);
