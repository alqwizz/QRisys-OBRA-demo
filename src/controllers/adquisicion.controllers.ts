import { Request, Response, NextFunction } from 'express';
import AdquisicionService from '../services/adquisicion.services';
import Logger from '../loaders/logger'
import { IAdquisicion } from '../interfaces/IAdquisicion';
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class AdquisicionController {
    private adquisicionService: AdquisicionService;
    constructor() {
        this.adquisicionService = new AdquisicionService();
    }
    public create = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Creando nuevo adquisicion con body: %o', req.body);
        try {
            const adquisicion = await this.adquisicionService.create(req.body as IAdquisicion, req.user as IUsuarioDTO);
            return res.status(adquisicion ? 200 : 400).json({ status: adquisicion ? 200 : 400, adquisicion: adquisicion, message: adquisicion ? 'Adquisicion creado correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error creando una adquisicion');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public edit = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Editando adquisicion con body: %o', req.body);
        try {
            const adquisicion = await this.adquisicionService.edit(req.body as IAdquisicion, req.user as IUsuarioDTO);
            return res.status(adquisicion ? 200 : 400).json({ status: adquisicion ? 200 : 400, adquisicion: adquisicion, message: adquisicion ? 'adquisicion creada correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error editando una adquisicion');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findById adquisicions');
        try {
            const adquisicion = await this.adquisicionService.findById(req.params.id);
            return res.status(200).json({ status: 200, adquisicion: adquisicion });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo adquisicions findById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findAll adquisicions');
        try {
            const adquisiciones = await this.adquisicionService.findAll();
            return res.status(200).json({ status: 200, adquisiciones: adquisiciones });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo adquisicions findAll');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyecto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyecto adquisicions');
        try {
            const adquisiciones = await this.adquisicionService.findByProyecto(req.params.idProyecto, req.params.search);
            return res.status(200).json({ status: 200, adquisiciones: adquisiciones });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo adquisicions findByProyecto');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findMaquinasByProyecto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findMaquinasByProyecto adquisicions');
        try {
            const adquisiciones = await this.adquisicionService.findMaquinasByProyecto(req.params.idProyecto);
            return res.status(200).json({ status: 200, adquisiciones: adquisiciones });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo adquisicions findMaquinasByProyecto');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findMaterialesByProyecto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findMaterialesByProyecto adquisicions');
        try {
            const adquisiciones = await this.adquisicionService.findMaterialesByProyecto(req.params.idProyecto);
            return res.status(200).json({ status: 200, adquisiciones: adquisiciones });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo adquisicions findMaterialesByProyecto');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyectoNombreEmpresa = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyectoNombreEmpresa adquisicions');
        try {
            const adquisicion = await this.adquisicionService.findByProyectoNombreEmpresa(req.params.idProyecto, req.params.idEmpresa, req.query.nombre as string);
            return res.status(200).json({ status: 200, adquisicion: adquisicion });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo adquisicions findByProyectoNombreEmpresa');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findAllByNombre = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findAllByNombre adquisicions');
        try {
            const adquisiciones = await this.adquisicionService.findAllByNombre(req.params.idProyecto, req.query.nombre as string);
            return res.status(200).json({ status: 200, adquisiciones: adquisiciones });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo adquisicions findAllByNombre');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyectoNombre = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyectoNombre adquisicions');
        try {
            const adquisiciones = await this.adquisicionService.findByProyectoNombre(req.params.idProyecto);
            return res.status(200).json({ status: 200, adquisiciones: adquisiciones });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo adquisicions findByProyectoNombre');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByEmpresaSub = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByEmpresaSub adquisicions');
        try {
            const adquisiciones = await this.adquisicionService.findByEmpresaSub(req.params.idEmpresa);
            return res.status(200).json({ status: 200, adquisiciones: adquisiciones });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo adquisicions findByEmpresaSub');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public deleteMany = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo deleteMany adquisicions');
        try {
            await this.adquisicionService.deleteMany(req.body.adquisicionsId);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo deleteMany');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

    public findTareasByWord = async (req: Request, res: Response) => {
        Logger.debug('Metodo encontrar tareas de las adquisicones por palabra');
        try {
            const tareas = await this.adquisicionService.findTareasByWord(req.params.word, req.params.idProyecto);
            return res.status(200).json({ tareas: tareas });
        } catch (e) {
            Logger.error('Error al encontrar las tareas de las adquisiciones por una palabra');
            Logger.error(e);
            return res.status(400).json({ error: e });
        }
    }
    public generarComparativo = async (req: Request, res: Response) => {
        Logger.debug('generarComparativo');
        try {
            await this.adquisicionService.generarComparativo(req.body, res);
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo generarComparativo');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public asociarTarea = async (req: Request, res: Response) => {
        Logger.debug('Metodo asociar tareas a adquisicion');
        try {
            await this.adquisicionService.asociarTarea(req.params.idAdquisicion, req.params.idTarea);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Error al asociar tareas a adquisicion');
            Logger.error(e);
            return res.status(400).json({ error: e });
        }
    }
    public findByTarea = async (req: Request, res: Response) => {
        Logger.debug('Obteniendo adquisicion por tarea');
        try {
            const adquisiciones = await this.adquisicionService.findByTarea(req.params.idTarea);
            return res.status(200).json({ status: 200, adquisiciones: adquisiciones });
        } catch (e) {
            Logger.error('Error al obtener las adquisiciones de una tarea');
            Logger.error(e);
            return res.status(400).json({ error: e });
        }
    }
}
