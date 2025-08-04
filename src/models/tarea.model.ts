import { ITarea } from "../interfaces/ITarea";
import Pedido from "../models/pedido.model";
import ReporteProduccion from "../models/reporteProduccion.model";
import mongoose from "mongoose";
import mongooseHistory from "mongoose-history";

var Schema = mongoose.Schema;
var tareaSchema = new Schema(
  {
    codigo: {
      type: String,
      required: true,
      trim: true,
    },
    idPlanificacion: {
      type: String,
      trim: true,
    },
    reportesProduccion: [
      {
        //Aqui se guardara,
        //en cada capitulo padre a primer nivel(raiz, root)
        //la informacion necesaria para ordenar, de los reportes que se les hagan
        //a sus partidas hijas, esto es, usuario, reportes y fecha.
        tarea: String,
        usuario: {
          type: Schema.Types.ObjectId,
          ref: "Usuario",
        },
        reporte: {
          type: Schema.Types.ObjectId,
          ref: "ReporteProduccion",
        },
        fechaCreacion: Date,
      },
    ],
    proyecto: {
      type: Schema.Types.ObjectId,
      ref: "Proyecto",
      required: true,
    },
    idPredecesora: {
      type: String,
      trim: true,
    },
    idPresupuesto: {
      type: String,
      trim: true,
    },
    idQrisys: {
      type: String,
      trim: true,
      required: true,
      index: true,
    },
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    unidad: {
      type: String,
      trim: true,
    },
    medicion: {
      type: Number,
      trim: true,
      required: true,
    },
    presupuesto: {
      type: Number,
      trim: true,
      required: true,
    },
    medicionActual: {
      type: Number,
      trim: true,
      default: 0,
    },
    porcentajeActual: {
      type: Number,
      trim: true,
      default: 0,
    },
    presupuestoActual: {
      type: Number,
      trim: true,
      default: 0,
    },
    fInicio: {
      type: Date,
    },
    fFin: {
      type: Date,
    },
    estado: {
      type: String,
      enum: ["sin_iniciar", "iniciado", "completado", "cerrado", "cancelado"],
      default: "sin_iniciar",
      required: true,
    },
    recursosAsociados: [
      {
        nombre: String,
        precio: Number,
        precioInicial: Number,
        cantidad: Number,
        factor: Number,
      },
    ],
    parent: {
      type: Schema.Types.Mixed,
    },
    childrens: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Tarea",
        },
      ],
    },
    updated_for: {
      type: Schema.Types.ObjectId,
      ref: "Usuario",
    },
  },
  { versionKey: "_version" }
);
function autoPopulateTareas(next) {
  this.populate("childrens");
  //this.populate({ path: 'parent', model: 'Tarea' });
  next();
}
tareaSchema.pre("find", autoPopulateTareas);
tareaSchema.pre("findOne", autoPopulateTareas);
tareaSchema.index({ codigo: 1, proyecto: 1 }, { unique: true });
tareaSchema.plugin(mongooseHistory);

export default mongoose.model<ITarea & mongoose.Document>("Tarea", tareaSchema);
