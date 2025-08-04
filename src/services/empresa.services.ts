import Empresa from '../models/empresa.model';
import Usuario from '../models/usuario.model';
import { IEmpresa } from '../interfaces/IEmpresa';
import Utils from './utils/utils';
import { IUsuarioDTO } from '../interfaces/IUsuario';
import fs from 'fs';
import mkdirp from 'mkdirp';
import config from '../config'

export default class EmpresaService {
    constructor() { }

    public create = async (empresa, user: IUsuarioDTO): Promise<IEmpresa> => {
        try {
            var err, empresaNew = await new Empresa({ ...empresa, updated_for: user._id }).save();
            if (err) throw err;

            return empresaNew;
        } catch (e) {
            throw e;
        }
    }
    public edit = async (empresa: IEmpresa, user: IUsuarioDTO): Promise<IEmpresa> => {
        try {
            var err, empresaOld = await Empresa.findById(empresa._id);

            if (err) throw err;
            if (!empresaOld) return null;

            empresaOld.nombre = empresa.nombre;
            empresaOld.nombreContacto = empresa.nombreContacto;
            empresaOld.cif = empresa.cif;
            empresaOld.telefono = empresa.telefono;
            empresaOld.logo = empresa.logo;
            empresaOld.email = empresa.email;
            empresaOld.direccion = empresa.direccion;
            empresaOld.updated_for = user._id as string;

            var err, newEmpresa = await empresaOld.save();
            if (err) throw err;

            return newEmpresa;
        } catch (e) {
            throw e;
        }
    }
    public sendLogo = async (idEmpresa, file, filename, user): Promise<void> => {
        try {
            var err, res = await Empresa.findById(idEmpresa);
            if (err) throw err;
            const path = config.upload_dir + '/' + res._id;
            mkdirp.sync(path);
            const fullpath = path + '/' + filename
            const fstream = fs.createWriteStream(fullpath);
            file.pipe(fstream);
            await new Promise(fulfill => fstream.on("close", fulfill));
            res.logo = res._id + '/' + filename;
            res.save();
        } catch (e) {
            throw e;
        }
    }
    public delete = async (empresaId: String): Promise<Boolean> => {
        try {
            var err, res = await Empresa.findByIdAndDelete(empresaId);
            if (err) throw err;
            return true;
        } catch (e) {
            throw e;
        }
    }
    public findAll = async (): Promise<IEmpresa[]> => {
        try {
            var err, res = await Empresa.find().lean();
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
    public findByUser = async (userId: string): Promise<IEmpresa[]> => {
        try {
            var err, user = await Usuario.findById(userId).populate('empresas').lean();
            if (err) throw err;
            if (!user) throw Error("El usuario no se ha encontrado.");
            return user.empresas as IEmpresa[];
        } catch (e) {
            throw e;
        }
    }
    public findById = async (id: string, userId?: string): Promise<IEmpresa> => {
        try {
            let empresaId = null;
            if (userId) {
                var err, user = await Usuario.findById(userId);
                if (err) throw err;
                if (!user) throw Error("El usuario no se ha encontrado.")
                const find = user.empresas.find(x => x + '' === id);
                if (find) empresaId = id;
            } else {
                empresaId = id;
            }
            var err, res = await Empresa.findById(empresaId);
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
}
