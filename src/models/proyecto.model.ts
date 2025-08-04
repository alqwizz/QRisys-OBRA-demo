import { IProyecto } from "../interfaces/IProyecto";
import mongoose from "mongoose";
import mongooseHistory from "mongoose-history";

var Schema = mongoose.Schema;
var proyectoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 200,
    },
    empresa: {
      type: Schema.Types.ObjectId,
      ref: "Empresa",
      required: true,
    },
    nombreContacto: {
      type: String,
      minlength: 2,
      trim: true,
    },
    direccion: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      match: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/,
      minlength: 3,
      trim: true,
    },
    estado: {
      type: String,
      enum: ["sin_iniciar", "iniciado", "completado", "cerrado", "cancelado"],
      default: "sin_iniciar",
      required: true,
    },
    fInicio: {
      type: Date,
    },
    fInicioReal: {
      type: Date,
    },
    fFin: {
      type: Date,
    },

    CTECI: {
      type: [{ type: Number }],
    },

    CC: {
      type: [{ type: Number }],
    },
    CI: {
      type: [{ type: Number }],
    },
    CO: {
      type: [{ type: Number }],
    },
    CM: {
      type: [{ type: Number }],
    },
    CD: {
      type: [{ type: Number }],
    },

    updated_for: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { versionKey: "_version" }
);
proyectoSchema.plugin(mongooseHistory);

export default mongoose.model<IProyecto & mongoose.Document>(
  "Proyecto",
  proyectoSchema
);
