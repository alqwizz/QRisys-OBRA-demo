import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import { IUsuario } from '../interfaces/IUsuario';
import mongoose from 'mongoose';
import mongooseHistory from 'mongoose-history'

var Schema = mongoose.Schema;
var usuarioSchema = new Schema({
  empresas: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Empresa',
    }]
  },
  proyectos: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Proyecto',
    }]
  },
  tareas: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Tarea',
    }]
  },
  nombre: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  apellidos: {
    type: String,
    required: true,
    minlength: 2,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    trim: true,
    select: false
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
    required: true,
    unique: true,
    minlength: 3,
    trim: true
  },
  telefono: {
    type: String
  },
  salt: {
    type: Buffer,
    required: true,
    select: false
  },
  rol: {
    type: String
  },
  updated_for: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario',
  }
}, { versionKey: '_version' });

usuarioSchema.plugin(mongooseHistory);

usuarioSchema.methods.encryptPassword = async function (password: string): Promise<{ salt: Buffer, hashedPassword: string }> {
  try {
    const salt = randomBytes(32);
    const hashedPassword = await argon2.hash(password, { salt })

    return { salt, hashedPassword };
  } catch (err) {
    throw err;
  }

};

usuarioSchema.methods.validPassword = async function (password: string): Promise<Boolean> {
  return await argon2.verify(this.password, password);
};
export default mongoose.model<IUsuario & mongoose.Document>('Usuario', usuarioSchema);