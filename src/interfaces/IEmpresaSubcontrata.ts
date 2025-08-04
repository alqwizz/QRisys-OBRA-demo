import { IAdquisicion } from "./IAdquisicion";
import { IProyecto } from "./IProyecto";

export interface IEmpresaSubcontrata {
    _id: string;
    nombre: string;
    nombreContacto: string;
    telefono: string;
    email: string;
    adquisiciones: [string | IAdquisicion];
    proyecto: [string | IProyecto];
    personal:[any];
}
