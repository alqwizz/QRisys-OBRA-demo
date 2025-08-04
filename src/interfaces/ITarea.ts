import { IProyecto } from "./IProyecto";
import { IReporteProduccion } from "./IReporteProduccion";
import { IUsuario } from "./IUsuario";

export interface ITarea {
  _id: string;
  codigo: string;
  idPlanificacion: string;
  idPresupuesto: string;
  idPredecesora: string;
  estado: string;
  proyecto: IProyecto | string;
  reportesProduccion: [
    {
      tarea: string;
      usuario: IUsuario | string;
      reporte: IReporteProduccion | string;
      fechaCreacion: Date;
    }
  ];
  nombre: string;
  unidad: string;
  medicion: number;
  presupuesto: number;
  coordenadasGPS: string;
  medicionActual: number;
  porcentajeActual: number;
  presupuestoActual: number;
  idQrisys: string;
  fInicio: Date;
  fFin: Date;
  recursosAsociados: [
    {
      nombre: string;
      precio: number;
      precioInicial: number;
      cantidad: number;
      factor: number;
    }
  ];
  updated_for: string;
  parent: string | ITarea;
  childrens: [string | ITarea];
  P_ORDEN?: number;
  PF?: number;
}
