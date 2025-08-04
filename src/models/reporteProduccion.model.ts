import { IReporteProduccion } from "../interfaces/IReporteProduccion";
import mongoose from "mongoose";
import mongooseHistory from "mongoose-history";

var Schema = mongoose.Schema;
var reporteProduccionSchema = new Schema(
  {
    tarea: {
      type: Schema.Types.ObjectId,
      ref: "Tarea",
      required: true,
    },
    porcentajeTarea: {
      type: Number,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    orden: {
      type: Number,
    },
    tipo: {
      type: String,
      enum: ["tajo", "problema"],
      required: true,
    },
    numero: {
      type: Number,
    },
    total: {
      type: Number,
    },
    unidad: {
      type: Boolean,
    },
    porcentaje: {
      type: Boolean,
    },
    precioTotal: {
      type: Number,
    },
    fechaActualizacion: {
      type: Date,
      required: true,
    },
    fechaCreacion: {
      type: Date,
      default: new Date(),
    },
    descripcion: {
      type: String,
    },
    files: {
      type: [String],
    },
    completar: {
      type: Boolean,
      default: false,
    },
    updated_for: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { versionKey: "_version" }
);
reporteProduccionSchema.plugin(mongooseHistory);

export default mongoose.model<IReporteProduccion & mongoose.Document>(
  "ReporteProduccion",
  reporteProduccionSchema
);
