import Permiso from '../models/permiso.model';
import { IPermiso } from '../interfaces/IPermiso';

export default class PermisoService {
    constructor() { }

    public findById = async (id: string): Promise<IPermiso> => {
        try {
            var err, res = await Permiso.findById(id);
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
    public findAll = async (): Promise<[IPermiso]> => {
        try {
            var err, res = await Permiso.find({});
            if (err) throw err;
            return res as unknown as [IPermiso];
        } catch (e) {
            throw e;
        }
    }
}