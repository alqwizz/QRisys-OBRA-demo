import { IEmpresa } from "./IEmpresa";
export interface IProyecto {
  _id: string;
  nombre: string;
  nombreContacto: string;
  direccion: string;
  telefono: string;
  email: string;
  lat: string;
  lng: string;
  empresa: IEmpresa | String;
  estado: string;
  fInicio: Date;
  fInicioReal: Date;
  fFin: Date;
  CTECI: Array<number>;
  CC: Array<number>;
  CI: Array<number>;
  CO: Array<number>;
  CM: Array<number>;
  CD: Array<number>;
  updated_for: string;
}
