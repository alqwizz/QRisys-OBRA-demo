import { Request, Response, NextFunction } from 'express';
import PermisoService from '../services/permiso.services';
import Logger from '../loaders/logger'
import { IPermiso } from '../interfaces/IPermiso';

export default class PermisoController {
    private permisoService;
    constructor() {
        this.permisoService = new PermisoService();
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findById permisos');
        try {
            const permiso = await this.permisoService.findById(req.params.id);
            return res.status(200).json({ status: 200, permiso: permiso });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo permisos findById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findAll permisos');
        try {
            const permisos = await this.permisoService.findAll();
            return res.status(200).json({ status: 200, permisos: permisos });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo permisos findById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

}