import { IAdquisicion } from "./IAdquisicion";
import { IEmpresaSubcontrata } from "./IEmpresaSubcontrata";
import { IProyecto } from "./IProyecto";

export interface IPedido {
  _id: string;
  adquisiciones: [any];
  proyecto: IProyecto | string;
  empresaSubcontrata: string | IEmpresaSubcontrata;
  precio: number;
  cantidad: number;
  fechaPedido: Date;
  fechaRecepcion: Date;
  ejecutado: Boolean;
  updated_for: string;
  estado: string;
  pagare: string;
  files: {
    rechazar: [string];
    recibir: [string];
    anular: [string];
    solicitar: [string];
  };
  fechaEsperada: Date;
  description: {
    rechazar: string;
    recibir: string;
    anular: string;
    solicitar: string;
  };
}
