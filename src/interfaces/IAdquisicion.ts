import { IProyecto } from './IProyecto';
import { ITarea } from './ITarea';
import { IEmpresaSubcontrata } from './IEmpresaSubcontrata';
export interface IAdquisicion {
    _id: string;
    tipo: string;
    nombre: string;
    empresaSubcontrata: string | IEmpresaSubcontrata;
    proyecto: IProyecto | String;
    tareas: [{ tarea: ITarea | String, factor: Number }];
    id_adquisicion: string;
    updated_for: string;
    precio: number;
    cantidad: number;
    unidad: string;
}
