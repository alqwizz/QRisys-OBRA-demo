import { Request, Response, NextFunction } from 'express';
import AvisoService from '../services/aviso.services';
import Logger from '../loaders/logger'
import { IAviso } from '../interfaces/IAviso';
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class AvisoController {
    private avisoService: AvisoService;
    constructor() {
        this.avisoService = new AvisoService();
    }
    public create = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Creando nuevo aviso');
        try {
            const aviso = await this.avisoService.create(req.body, req.user as IUsuarioDTO);
            return res.status(200).json({ status: 200, aviso: aviso, message: 'Aviso creado correctamente' });
        } catch (e) {
            Logger.error('Se ha producido un error creando un aviso');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public edit = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Editando aviso.');
        try {
            await this.avisoService.edit(req.body, req.user as IUsuarioDTO);
            return res.status(200).json({ status: 200, message: 'Aviso editado correctamente' });
        } catch (e) {
            Logger.error('Se ha producido un error editando un aviso');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public marcarLeido = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('marcarLeido aviso.');
        try {
            await this.avisoService.marcarLeido(req.params.idAviso, req.user as IUsuarioDTO);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error marcarLeido un aviso');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findToday = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Avisos findToday');
        try {
            const avisos = await this.avisoService.findToday(req.user as IUsuarioDTO);
            return res.status(200).json({ status: 200, avisos: avisos, message: 'Avisos del día de hoy' });
        } catch (e) {
            Logger.error('Se ha producido un error findToday avisos');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyecto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Avisos findByProyecto');
        try {
            const avisos = await this.avisoService.findByProyecto(req.params.idProyecto);
            return res.status(200).json({ status: 200, avisos: avisos });
        } catch (e) {
            Logger.error('Se ha producido un error findToday avisos');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Avisos findAll');
        try {
            const avisos = await this.avisoService.findAll();
            return res.status(200).json({ status: 200, avisos: avisos, message: 'Avisos del día de hoy' });
        } catch (e) {
            Logger.error('Se ha producido un error findAll avisos');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
}
