import { Request, Response, NextFunction } from 'express';
import EmpresaSubcontrataService from '../services/empresaSubcontrata.services';
import Logger from '../loaders/logger'
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class EmpresaSubcontrataController {
    private empresaSubcontrataService: EmpresaSubcontrataService;
    constructor() {
        this.empresaSubcontrataService = new EmpresaSubcontrataService();
    }
    public create = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Creando nueva empresa subcontrata');
        try {
            const empresaSubcontrata = await this.empresaSubcontrataService.create(req.body, req.user as IUsuarioDTO);
            return res.status(empresaSubcontrata ? 200 : 400).json({ status: empresaSubcontrata ? 200 : 400, empresaSubcontrata: empresaSubcontrata, message: empresaSubcontrata ? 'Empresa creada correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error creando una empresa subcontrata');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public edit = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Editando empresa con body: %o', req.body);
        try {
            const empresaSubcontrata = await this.empresaSubcontrataService.edit(req.body, req.user as IUsuarioDTO);
            return res.status(empresaSubcontrata ? 200 : 400).json({ status: empresaSubcontrata ? 200 : 400, empresaSubcontrata: empresaSubcontrata, message: empresaSubcontrata ? 'Empresa editada correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error editando una empresa subcontrata');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findById empresaSubcontratas');
        try {
            const empresaSubcontrata = await this.empresaSubcontrataService.findById(req.params.id);
            return res.status(200).json({ status: 200, empresaSubcontrata: empresaSubcontrata });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo empresaSubcontratas findById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByAdquisicion = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByAdquisicion empresaSubcontratas');
        try {
            const empresaSubcontratas = await this.empresaSubcontrataService.findByAdquisicion(req.params.idAdquisicion);
            return res.status(200).json({ status: 200, empresasSubcontratas: empresaSubcontratas });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo empresaSubcontratas findByAdquisicion');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByProyectoAdquisicionNombre = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByProyectoAdquisicionNombre empresaSubcontratas');
        try {
            const empresaSubcontratas = await this.empresaSubcontrataService.findByProyectoAdquisicionNombre(req.params.idProyecto, req.query.nombre as string);
            return res.status(200).json({ status: 200, empresasSubcontratas: empresaSubcontratas });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo empresaSubcontratas findByProyectoAdquisicionNombre');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

    public findByProyecto = async (req: Request, res: Response) => {
        Logger.debug('encontrar empresas subcontratas por proyecto');
        try {
            const empresasSubContrata = await this.empresaSubcontrataService.findByProyecto(req.params.idProyecto, req.params.search);
            return res.status(200).json({ status: 200, empresasSubcontratas: empresasSubContrata });
        } catch (e) {
            Logger.error('Error al conseguir las empresas subcontratas por proyecto');
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }

    public findByPersonal = async (req: Request, res: Response) => {
        Logger.debug('encontrar empresas subcontratas con personal');
        try {
            const empresasSubContrata = await this.empresaSubcontrataService.findByPersonal(req.params.idProyecto, req.params.search);
            return res.status(200).json({ status: 200, empresasSubcontratas: empresasSubContrata });
        } catch (e) {
            Logger.error('Error al conseguir las empresas subcontratas por personal');
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }

    public addPersonal = async (req: Request, res: Response) => {
        Logger.debug('Añadir personal a la empresa subcontrata');
        try {
            const empresasSubContrata = await this.empresaSubcontrataService.addPersonal(req.body.idEmpresa, req.body.personal);
            return res.status(200).json({ status: 200, empresasSubcontrata: empresasSubContrata });
        } catch (e) {
            Logger.error('Error al añadir personal a la empresa subcontrata');
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }

}
