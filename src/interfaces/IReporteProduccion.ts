import { ITarea } from "./ITarea";
import { IUsuario } from "./IUsuario";
export interface IReporteProduccion {
  _id: string;
  tarea: ITarea | String;
  porcentajeTarea: number;
  numero: number;
  total: number;
  tipo: string;
  unidad: boolean;
  usuario: string | IUsuario;
  orden: number;
  porcentaje: boolean;
  precioTotal: number;
  completar: boolean;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  files: [String];
  descripcion?: String;
  updated_for: string;
}
