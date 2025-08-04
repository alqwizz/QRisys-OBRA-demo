import Rol from '../models/rol.model';
import { IRol } from '../interfaces/IRol';
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class RolService {
    constructor() { }

    public create = async (rol, user: IUsuarioDTO): Promise<IRol> => {
        try {
            var err, rolNew = await new Rol({ ...rol, updated_for: user._id }).save();
            if (err) throw err;

            return rolNew;
        } catch (e) {
            throw e;
        }
    }
    public edit = async (rol: IRol, user: IUsuarioDTO): Promise<IRol> => {
        try {
            var err, rolOld = await Rol.findById(rol._id);

            if (err) throw err;
            if (!rolOld) return null;

            rolOld.nombre = rol.nombre;
            rolOld.permisos = rol.permisos;
            rolOld.pantallaOrigen = rol.pantallaOrigen;
            rolOld.updated_for = user._id as string;

            var err, newRol = await rolOld.save();
            if (err) throw err;

            return newRol;
        } catch (e) {
            throw e;
        }
    }
    public delete = async (rolId: String): Promise<Boolean> => {
        try {
            var err, res = await Rol.findByIdAndDelete(rolId);
            if (err) throw err;
            return true;
        } catch (e) {
            throw e;
        }
    }
    public findAll = async (): Promise<[IRol]> => {
        try {
            var err, res = await Rol.find({});
            if (err) throw err;
            return res as unknown as [IRol];
        } catch (e) {
            throw e;
        }
    }
    public findByEmpresa = async (idEmpresa: string): Promise<[IRol]> => {
        try {
            var err, res = await Rol.find({ empresa: idEmpresa });
            if (err) throw err;
            return res as unknown as [IRol];
        } catch (e) {
            throw e;
        }
    }
    public findById = async (id: string): Promise<IRol> => {
        try {
            var err, res = await Rol.findById(id);
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
}