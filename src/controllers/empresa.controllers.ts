import { Request, Response, NextFunction } from 'express';
import EmpresaService from '../services/empresa.services';
import Logger from '../loaders/logger'
import { IEmpresa } from '../interfaces/IEmpresa';
import ProyectoService from "../services/proyecto.services";
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class EmpresaController {
    private empresaService: EmpresaService;
    private proyectoService: ProyectoService;
    constructor() {
        this.empresaService = new EmpresaService();
        this.proyectoService = new ProyectoService();
    }
    public create = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Creando nueva empresa con body: %o', req.body);
        try {
            const empresa = await this.empresaService.create(req.body as IEmpresa, req.user as IUsuarioDTO);
            return res.status(empresa ? 200 : 400).json({ status: empresa ? 200 : 400, empresa: empresa, message: empresa ? 'Empresa creada correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error creando una empresa.');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error creando una empresa. Compruebe que no inserta información duplicada o en conflicto con otras empresas del sistema." });
        }
    }
    public edit = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Editando empresa con body: ', req.body);
        try {
            const empresa = await this.empresaService.edit(req.body as IEmpresa, req.user as IUsuarioDTO);
            return res.status(empresa ? 200 : 400).json({ status: empresa ? 200 : 400, empresa: empresa, message: empresa ? 'Empresa editada correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error editando una empresa');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error editando la empresa. Compruebe que no inserta información duplicada o en conflicto con otras empresas del sistema." });
        }
    }
    public sendLogo = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo sendLogo')
        try {
            req.pipe(req.busboy);
            req.busboy.on('file', async function (fieldname, file, filename) {
                var empresaService = new EmpresaService();
                empresaService.sendLogo(req.params.idEmpresa, file, filename, req.user).then(value => {
                    return res.status(200).json({ status: 200 });
                }).catch(e => {
                    Logger.error('Se ha producido un error en el metodo sendLogo empresa');
                    Logger.error(e);
                    return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
                });

            });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo send photo reporte tarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findAll empresas');
        try {
            const user = req.user as IUsuarioDTO;
            let empresas = []
            if (user.permisos.find(x => x.codigo === "VEP"))
                empresas = await this.empresaService.findAll();
            else
                empresas = await this.empresaService.findByUser(user._id);
            let promises = [];
            empresas.forEach((empresa, i) => {
                if (user.permisos.find(x => x.codigo === "VEP"))
                    promises.push(this.proyectoService.findByEmpresa(empresa._id));
                else
                    promises.push(this.proyectoService.findByEmpresaAndUser(empresa._id, user._id));
            });
            Promise.all(promises).then(values => {
                empresas.forEach((empresa, i) => {
                    empresa.proyectos = values[i];
                });
                return res.status(200).json({ status: 200, empresas: empresas });
            }).catch(err => console.error(err));
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo findAll');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findById empresas');
        try {
            const user = req.user as IUsuarioDTO
            const canSeeAll = user.permisos.find(x => x.codigo === "VEP") ? true : false;
            const empresa = await this.empresaService.findById(req.params.id, canSeeAll ? null : user._id);
            const proyectos = await this.proyectoService.findByEmpresa(empresa._id);
            return res.status(200).json({ status: 200, empresa: empresa, proyectos: proyectos });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo empresas findById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
}
