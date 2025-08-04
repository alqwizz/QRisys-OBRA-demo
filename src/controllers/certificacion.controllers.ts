import CertificacionService from "../services/certificacion.services";
import { Request, Response } from 'express';
import Logger from "../loaders/logger";
import { IUsuarioDTO } from "../interfaces/IUsuario";
import { ICertificacion } from "../interfaces/ICertificacion";

export default class CertificacionController {
    private certificacionService: CertificacionService;
    constructor() {
        this.certificacionService = new CertificacionService();
    }

    public create = async (req: Request, res: Response) => {
        Logger.debug('Creando nueva certificacion');
        try {
            let user = req.user as IUsuarioDTO;
            let cert = { ...req.body, updated_for: user._id };
            const certificacion = await this.certificacionService.create(cert as ICertificacion);
            return res.status(200).json({ status: 200, certificacion: certificacion });
        } catch (e) {
            Logger.error('Se ha producido un error creando una certificacion');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    };

    public findAll = async (req: Request, res: Response) => {
        Logger.debug('Obteniendo certificaciones');
        try {
            let proyecto = req.params.idProyecto;
            console.log(proyecto);
            const certificaciones = await this.certificacionService.findAll(proyecto);
            return res.status(200).json({ status: 200, certificaciones: certificaciones });
        } catch (e) {
            Logger.error('Se ha producido un error obtenieendo las certificaciones');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    };

    public validateCertificacion = async (req: Request, res: Response) => {
        Logger.debug('Validando una certificacion');
        try {
            const cert = await this.certificacionService.validate(req.body.idCertificacion);
            return res.status(200).json({ status: 200, certificacion: cert });
        } catch (e) {
            Logger.error('Se ha producido un error validando una certificacion');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    };

    public generateCertificacion = async (req: Request, res: Response) => {
        Logger.debug('Generando una certificacion');
        try {
            const { fechaInicio, fechaFin, sobreCoste } = req.query;
            const idProyecto = req.params.idProyecto;
            const certificacionInfo = await this.certificacionService.generateCertificacion(fechaInicio as string, fechaFin as string, Number(sobreCoste), idProyecto);
            return res.status(200).json({ status: 200, certificacion: certificacionInfo });
        } catch (e) {
            Logger.error('Se ha producido un error generando una certificacion');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    };
    public exportarExcel = async (req: Request, res: Response) => {
        Logger.debug('Generando una certificacion');
        try {
            await this.certificacionService.exportarExcel(req.body, res);
        } catch (e) {
            Logger.error('Se ha producido un error generando una certificacion');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    };

}
