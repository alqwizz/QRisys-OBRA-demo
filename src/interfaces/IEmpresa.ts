import { IProyecto } from "./IProyecto";

export interface IEmpresa {
    _id: string;
    nombre: string;
    cif: string;
    nombreContacto: string;
    direccion: string;
    proyectos: (string | IProyecto)[]
    telefono: string;
    email: string;
    logo?: string;
    updated_for: string;
}
