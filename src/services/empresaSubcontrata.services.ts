import EmpresaSubcontrata from '../models/empresaSubcontrata.model';
import Adquisicion from '../models/adquisicion.model';
import { IEmpresaSubcontrata } from '../interfaces/IEmpresaSubcontrata';
import { IUsuarioDTO } from '../interfaces/IUsuario';
import AdquisicionService from './adquisicion.services';
import { IAdquisicion } from '../interfaces/IAdquisicion';
import e from 'express';
import Pedido from '../models/pedido.model';

export default class EmpresaSubcontrataService {
    constructor() { }

    public create = async (empresaSubcontrata, user: IUsuarioDTO): Promise<IEmpresaSubcontrata> => {
        try {
            const adquisiciones: [IAdquisicion] = empresaSubcontrata.adquisiciones;
            var err, empresaSubcontrataNew = await new EmpresaSubcontrata({ ...empresaSubcontrata, updated_for: user._id }).save();
            if (err) throw err;
            for (let i = 0; i < adquisiciones.length; i++) {
                const adquisicion = adquisiciones[i];
                let errorTareas, tareasOriginal = await Adquisicion.findOne({ nombre: adquisicion.nombre }, 'tareas', { lean: true });
                var err, adqSaved = await new Adquisicion({
                    nombre: adquisicion.nombre,
                    tipo: adquisicion.tipo,
                    precio: adquisicion.precio,
                    tareas: tareasOriginal ? tareasOriginal.tareas : [],
                    unidad: adquisicion.unidad,
                    proyecto: empresaSubcontrataNew.proyecto,
                    empresaSubcontrata: empresaSubcontrataNew._id,
                    updated_for: user._id
                }).save()
                if (err) throw err;
                if (!adqSaved) throw Error("No se ha guardado la adquisicion.")
            }

            return empresaSubcontrataNew;
        } catch (e) {
            throw e;
        }
    };
    private operation = (list1: [any], list2: [any], isUnion: boolean = false) =>
        list1.filter(
            (set => a => isUnion === set.has(a._id + ''))(new Set(list2.map(b => b._id + '')))
        );

    // Following functions are to be used:
    private inBoth = (list1: [any], list2: [any]) => this.operation(list1, list2, true);
    private inFirstOnly = this.operation;
    private inSecondOnly = (list1: [any], list2: [any]) => this.inFirstOnly(list2, list1);

    public edit = async (empresaSubcontrata: IEmpresaSubcontrata, user: IUsuarioDTO): Promise<IEmpresaSubcontrata> => {
        try {
            const adquisiciones: [IAdquisicion] = empresaSubcontrata.adquisiciones as [IAdquisicion];
            var err, res = await EmpresaSubcontrata.findByIdAndUpdate(empresaSubcontrata._id, { ...empresaSubcontrata, updated_for: user._id })
            if (err) throw err;
            await Adquisicion.deleteMany({ empresaSubcontrata: empresaSubcontrata._id });
            for (let i = 0; i < adquisiciones.length; i++) {
                const adquisicion = adquisiciones[i];
                /*-- VOY APROVECHAR AQUI PARA METER LAS TAREAS DE LA ADQUISICION CON EL MISMO NOMBRE SI ES QUE HAY ALGUNA*/
                //let errorTareas, tareasOriginal = await Adquisicion.findOne({nombre:adquisicion.nombre},'tareas',{ lean: true });
                // console.log(tareasOriginal);

                var err, adqSaved = await new Adquisicion({
                    nombre: adquisicion.nombre,
                    tipo: adquisicion.tipo,
                    tareas: adquisicion.tareas ? adquisicion.tareas : [],
                    precio: adquisicion.precio,
                    unidad: adquisicion.unidad,
                    proyecto: empresaSubcontrata.proyecto,
                    empresaSubcontrata: res._id,
                    updated_for: user._id
                }).save()
                if (err) throw err;
                if (!adqSaved) throw Error("No se ha guardado la adquisicion.")
            }
            return res;
        } catch (e) {
            throw e;
        }
    };
    public delete = async (empresaSubcontrataId: String): Promise<Boolean> => {
        try {
            var err, res = await EmpresaSubcontrata.findByIdAndDelete(empresaSubcontrataId);
            if (err) throw err;
            return true;
        } catch (e) {
            throw e;
        }
    };
    public findById = async (id: string): Promise<IEmpresaSubcontrata> => {
        try {
            var err, res = await EmpresaSubcontrata.findById(id);
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    };
    public findByAdquisicion = async (idAdquisicion: string): Promise<IEmpresaSubcontrata[]> => {
        try {
            var err, res = await EmpresaSubcontrata.find({ adquisiciones: idAdquisicion });
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
    public findByProyectoAdquisicionNombre = async (idProyecto: string, nombre: string): Promise<IEmpresaSubcontrata[]> => {
        try {
            var err, adquisiciones = await Adquisicion.find({ proyecto: idProyecto, nombre: nombre })
            if (err) throw err;
            const empresasIds: string[] = adquisiciones.map(x => x.empresaSubcontrata as string);
            var err, res = await EmpresaSubcontrata.find({ _id: { $in: empresasIds } })
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
    private diacriticSensitiveRegex = (string: string = ''): string => {
        return string.replace(/a/g, '[a,á,à,ä]')
            .replace(/e/g, '[e,é,ë]')
            .replace(/i/g, '[i,í,ï]')
            .replace(/o/g, '[o,ó,ö,ò]')
            .replace(/u/g, '[u,ü,ú,ù]');
    }

    public findByProyecto = async (idProyecto: string, search?: string): Promise<IEmpresaSubcontrata[]> => {
        try {
            let query = { proyecto: idProyecto };
            if (search) {
                search = this.diacriticSensitiveRegex(search.normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
                const adquisicionService = new AdquisicionService();
                let adquisiciones = await adquisicionService.findByProyecto(idProyecto, search);
                const empresasIds = adquisiciones.map(x => (x.empresaSubcontrata as IEmpresaSubcontrata)._id ? (x.empresaSubcontrata as IEmpresaSubcontrata)._id : x.empresaSubcontrata);
                query = {
                    ...query, ...{
                        $or: [
                            { nombre: { $regex: search, $options: 'i' } },
                            { nombreContacto: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { cif: { $regex: search, $options: 'i' } },
                            { telefono: { $regex: search, $options: 'i' } },
                            { _id: { $in: empresasIds } }]
                    }
                }
            }
            let err, empresas = await EmpresaSubcontrata.find(query).sort({ nombre: 1 }).lean();
            if (err) throw err;
            return empresas;
        } catch (e) {
            throw e;
        }
    }

    public findByPersonal = async (idProyecto: string, search?: string): Promise<IEmpresaSubcontrata[]> => {
        try {
            let err, empresasIds = await Pedido.find({ 'adquisiciones.tipo': 'MANO DE OBRA' }, 'empresaSubcontrata').distinct('empresaSubcontrata');
            if (err) throw err;
            // const empresasIds = pedidos.map(x => x.empresaSubcontrata);
            let query = { proyecto: idProyecto, _id: { $in: empresasIds } };
            if (search) {
                search = this.diacriticSensitiveRegex(search.normalize('NFD').replace(/[\u0300-\u036f]/g, ""));
                query = {
                    ...query, ...{
                        $or: [
                            { nombre: { $regex: search, $options: 'i' } },
                            { nombreContacto: { $regex: search, $options: 'i' } },
                            { email: { $regex: search, $options: 'i' } },
                            { cif: { $regex: search, $options: 'i' } },
                            { telefono: { $regex: search, $options: 'i' } },]
                    }
                }
            }

            let error, empresas = await EmpresaSubcontrata.find(query).sort({ nombre: 1 }).lean();
            if (error) throw error;
            return empresas;
        } catch (e) {
            throw e;
        }
    }

    public addPersonal = async (idEmpresa: string, personal: [any]): Promise<IEmpresaSubcontrata> => {
        try {
            let err, res = await EmpresaSubcontrata.findByIdAndUpdate(idEmpresa, { personal: personal });
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
}
