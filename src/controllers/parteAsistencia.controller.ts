import ParteAsistenciaService from "../services/parteAsistencia.services";
import { Request, Response } from 'express';
import Logger from "../loaders/logger";
import { IUsuarioDTO } from "../interfaces/IUsuario";
export default class ParteAsistenciaController {
    private parteAsistenciaService: ParteAsistenciaService;

    constructor() {
        this.parteAsistenciaService = new ParteAsistenciaService();
    }

    public create = async (req: Request, res: Response) => {
        Logger.debug('Creando nuevo parte de asistencia.');
        try {
            const parteAsistencia = await this.parteAsistenciaService.create(req.body, req.user as IUsuarioDTO);
            return res.status(parteAsistencia ? 200 : 400).json({ status: parteAsistencia ? 200 : 400, parteAsistencia: parteAsistencia, message: parteAsistencia ? 'parte creado correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error creando un parte de asiatencia diario.');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    };

    public findByProyecto = async (req: Request, res: Response) => {
        Logger.debug('Obteniendo todos los partes por proyecto');
        try {
            const partes = await this.parteAsistenciaService.findByProyecto(req.params.idProyecto);
            return res.status(200).json({ status: 200, partesAsistencia: partes });
        } catch (e) {
            Logger.error('Se ha producido un error creando un parte de asiatencia diario.');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

    public findByEmpresaAndDate = async (req: Request, res: Response) => {
        Logger.debug('Obteniendo los partes por empresa y fecha');
        try {
            const partes = await this.parteAsistenciaService.findByEmpresaAndDate(req.params.idEmpresa, req.query.fecha as string);
            return res.status(200).json({ status: 200, partesAsistencia: partes });
        } catch (e) {
            Logger.error('Se ha producido un error solicitando los partes por empresa y fecha.');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

    public exportarExcel = async (req: Request, res: Response) => {
        Logger.debug('exportarExcel parteAsistencia');
        try {
            await this.parteAsistenciaService.exportarExcel(req.params.idProyecto, res);
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo exportarExcel parteAsistencia');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
}
