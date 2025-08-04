import Permiso from "../models/permiso.model";
import { IPermiso } from "./IPermiso";
import { IProyecto } from "./IProyecto";
import { IEmpresa } from "./IEmpresa";
import { ITarea } from "./ITarea";

export interface IUsuario {
    _id: String;
    nombre: String;
    apellidos: String;
    telefono: String;
    email: String;
    username: String;
    empresas: (IEmpresa | String)[];
    proyectos: (IProyecto | String)[];
    tareas: (ITarea | String)[];
    password: String;
    salt: Buffer;
    rol: string;
    updated_for: string;
    validPassword(password: String): Promise<Boolean>;
    encryptPassword(password: String): Promise<{ salt: Buffer, hashedPassword: String, err: Error }>;
}

export interface IUsuarioDTO {
    _id: string;
    nombre: String;
    apellidos: String;
    username: String;
    telefono: String;
    email: String;
    proyectos?: String[]
    pantallaOrigen?: string;
    rol: string;
    password?: String;
    permisos?: (IPermiso & Document)[];
}

export interface IUsuarioInputDTO {
    nombre: string;
    apellidos: string;
    telefono: string;
    username: string;
    empresa: string;
    email: string;
    password: string;
}
