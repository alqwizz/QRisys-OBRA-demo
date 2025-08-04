import { Request, Response, NextFunction } from 'express';
import TareaService from '../services/tarea.services';
import Logger from '../loaders/logger'
import { ITarea } from '../interfaces/ITarea';
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class TareaController {
    private tareaService: TareaService;
    constructor() {
        this.tareaService = new TareaService();
    }
    public create = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Creando nuevo tarea con body: %o', req.body);
        try {
            const tarea = await this.tareaService.create(req.body as ITarea, req.user as IUsuarioDTO);
            return res.status(tarea ? 200 : 400).json({ status: tarea ? 200 : 400, user: tarea, message: tarea ? 'Tarea creado correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error creando una tarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public edit = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Editando tarea con body: %o', req.body);
        try {
            await this.tareaService.edit(req.body as ITarea, req.user as IUsuarioDTO);
            return res.status(200).json({ status: 200, message: 'tarea editada correctamente' });
        } catch (e) {
            Logger.error('Se ha producido un error editando una tarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyecto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyecto tareas');
        try {
            const { tareas, pages } = await this.tareaService.findByProyecto(req.params.idProyecto, req.user as IUsuarioDTO, +req.params.page, +req.params.limit, req.params.search);
            return res.status(200).json({ status: 200, tareas: tareas, pages: pages });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findByProyecto');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyectoLista = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyectoLista tareas');
        try {
            const { tareas, pages } = await this.tareaService.findByProyectoLista(req.params.idProyecto, req.user as IUsuarioDTO, +req.params.page, +req.params.limit, req.params.search);
            return res.status(200).json({ status: 200, tareas: tareas, pages: pages });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findByProyectoLista');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyectoDesordenadas = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyectoDesordenadas tareas');
        try {
            const { tareas, pages } = await this.tareaService.findByProyectoDesordenadas(req.params.idProyecto, +req.params.page, +req.params.limit, req.params.search);
            return res.status(200).json({ status: 200, tareas: tareas, pages: pages });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findByProyectoDesordenadas');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyectoAndUsuario = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyectoAndUsuario tareas');
        try {
            const tareas = await this.tareaService.findByProyectoAndUsuario(req.params.idProyecto, req.params.idUsuario);
            return res.status(200).json({ status: 200, tareas: tareas });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findByProyectoAndUsuario');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyectoArray = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyectoArray tareas');
        try {
            const tareas = await this.tareaService.findByProyectoArray(req.params.idProyecto, req.user);
            return res.status(200).json({ status: 200, tareas: tareas });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findAll');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByEmpresa = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findAll tareas');
        try {
            const tareas = await this.tareaService.findByEmpresa(req.params.idEmpresa, req.user);
            return res.status(200).json({ status: 200, tareas: tareas });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findAll');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByUser = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByUser tareas');
        try {
            const tareas = await this.tareaService.findByUser(req.user);
            return res.status(200).json({ status: 200, tareas: tareas });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findByUser');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findById tareas');
        try {
            const tarea = await this.tareaService.findById(req.params.id);
            return res.status(200).json({ status: 200, tarea: tarea });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo tareas findById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public history = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo history');
        try {
            const history = await this.tareaService.history();
            return res.status(200).json({ status: 200, history: history });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo history');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public cancelarTarea = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo cancelarTarea');
        try {
            await this.tareaService.cancelarTarea(req.params.idTarea, req.user as IUsuarioDTO);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo cancelarTarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

    public findByWord = async (req: Request, res: Response) => {
        Logger.debug('Metodo encontrar por palabra');
        try {
            const tareas = await this.tareaService.findByWord(req.params.word, req.params.idProyecto);
            return res.status(200).json({ tareas: tareas });
        } catch (e) {
            Logger.error('Error al buscar por palabras');
            Logger.error(e);
            return res.status(400).json({ error: e });
        }
    }
    public exportarExcel = async (req: Request, res: Response) => {
        Logger.debug('exportarExcel tareas');
        try {
            await this.tareaService.exportarExcel(req.params.idProyecto, res);
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo exportarExcel tareas');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
}
