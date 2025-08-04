import { Request, Response, NextFunction } from 'express';
import RolService from '../services/rol.services';
import Logger from '../loaders/logger'
import { IRol } from '../interfaces/IRol';
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class RolController {
    private rolService: RolService;
    constructor() {
        this.rolService = new RolService();
    }
    public create = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Creando nuevo rol con body: %o', req.body);
        try {
            const rol = await this.rolService.create(req.body as IRol, req.user as IUsuarioDTO);
            return res.status(rol ? 200 : 400).json({ status: rol ? 200 : 400, user: rol, message: rol ? 'Rol creado correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error creando una rol');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public edit = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Editando rol con body: %o', req.body);
        try {
            const rol = await this.rolService.edit(req.body as IRol, req.user as IUsuarioDTO);
            return res.status(rol ? 200 : 400).json({ status: rol ? 200 : 400, rol: rol, message: rol ? 'rol creada correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error editando una rol');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findById rols');
        try {
            const rol = await this.rolService.findById(req.params.id);
            return res.status(200).json({ status: 200, rol: rol });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo rols findById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findAll rols');
        try {
            const roles = await this.rolService.findAll();
            return res.status(200).json({ status: 200, roles: roles });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo rols findAll');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByEmpresa = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByEmpresa rols');
        try {
            const roles = await this.rolService.findByEmpresa(req.params.idEmpresa);
            return res.status(200).json({ status: 200, roles: roles });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo rols findByEmpresa');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

}