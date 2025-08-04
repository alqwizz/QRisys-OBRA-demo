import { Request, Response, NextFunction } from 'express';
import UsuarioService from '../services/usuario.services';
import Logger from '../loaders/logger'
import { IUsuario, IUsuarioInputDTO, IUsuarioDTO } from '../interfaces/IUsuario';
import xlsx from 'xlsx';

export default class UsuarioController {
    private usuarioService: UsuarioService;
    constructor() {
        this.usuarioService = new UsuarioService();
    }
    public findUserData = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Using findUserData endpoint with body: %o', req.body)
        try {
            var userData = await this.usuarioService.findUserData((<IUsuario>req.user)._id)
            if (!userData) {
                req.logout();
                return res.status(401).json({ status: 401, message: "Se ha producido un error. Inicie sesión de nuevo." });
            }
            return res.status(200).json({ status: 200, user: userData, message: "Datos del usuario" });

        } catch (e) {
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public createUser = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Creando nuevo usuario con body: %o', req.body);
        try {
            const user = await this.usuarioService.create(req.body as IUsuarioInputDTO, req.user as IUsuarioDTO);
            return res.status(user ? 200 : 400).json({ status: user ? 200 : 400, user: user, message: user ? 'Usuario creado correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error creando un usuario');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public editUser = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Editando usuario con body: %o', req.body);
        try {
            const user = await this.usuarioService.edit(req.body, req.user as IUsuarioDTO);
            return res.status(user ? 200 : 400).json({ status: user ? 200 : 400, user: user, message: user ? 'Usuario creado correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error editando un usuario');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public editCredentials = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('editCredentials');
        try {
            await this.usuarioService.editCredentials(req.body.password, req.params.idUsuario, req.user as IUsuarioDTO);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error editCredentials');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findAll usuarios');
        try {
            const users = await this.usuarioService.findAll();
            return res.status(200).json({ status: 200, users: users });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findAll');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByEmpresa = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByEmpresa usuarios');
        try {
            const users = await this.usuarioService.findByEmpresa(req.params.idEmpresa);
            return res.status(200).json({ status: 200, users: users });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findByEmpresa');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyecto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyecto usuarios');
        try {
            const users = await this.usuarioService.findByProyecto(req.params.idProyecto);
            return res.status(200).json({ status: 200, users: users });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findByProyecto');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByEmpresaNoProyecto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByEmpresaNoProyecto usuarios');
        try {
            const users = await this.usuarioService.findByEmpresaNoProyecto(req.params.idProyecto);
            return res.status(200).json({ status: 200, users: users });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findByEmpresaNoProyecto');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyectoNoTarea = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyectoNoTarea usuarios');
        try {
            const users = await this.usuarioService.findByProyectoNoTarea(req.params.idTarea);
            return res.status(200).json({ status: 200, users: users });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findByProyectoNoTarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findUserUserById usuarios');
        try {
            const user = await this.usuarioService.findById(req.params.id);
            return res.status(200).json({ status: 200, user: user });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findUserUserById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public deleteMany = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo deleteMany usuarios');
        try {
            await this.usuarioService.deleteMany(req.body.usersId);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo deleteMany');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

    public asignarProyecto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo asignarUsuario proyectos');
        try {
            await this.usuarioService.asignarProyecto(req.params.idProyecto, req.params.idUsuario);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo proyectos asignarUsuario');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public quitarProyecto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo quitarUsuario proyectos');
        try {
            await this.usuarioService.quitarProyecto(req.params.idProyecto, req.params.idUsuario);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo proyectos quitarUsuario');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public asignarTarea = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo asignarTarea usuario');
        try {
            await this.usuarioService.asignarTarea(req.params.idUsuario, req.params.idTarea);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo asignarTarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public quitarTarea = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo quitarTarea usuario');
        try {
            await this.usuarioService.quitarTarea(req.params.idUsuario, req.params.idTarea);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo quitarTarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
}