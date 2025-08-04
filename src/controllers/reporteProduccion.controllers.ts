import { Request, Response, NextFunction } from 'express';
import ReporteProduccionService from '../services/reporteProduccion.services';
import Logger from '../loaders/logger'
import config from '../config';
import { IReporteProduccion } from '../interfaces/IReporteProduccion';
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class ReporteProduccionContreporteProduccionler {
    private reporteProduccionService: ReporteProduccionService;
    constructor() {
        this.reporteProduccionService = new ReporteProduccionService();
    }
    public create = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Creando nuevo reporteProduccion con body: %o', req.body);
        try {
            const reporteProduccion = await this.reporteProduccionService.create(req.body as IReporteProduccion, req.user as IUsuarioDTO);
            return res.status(reporteProduccion ? 200 : 400).json({ status: reporteProduccion ? 200 : 400, reporteProduccion: reporteProduccion, message: reporteProduccion ? 'ReporteProduccion creado correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error creando una reporteProduccion');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public edit = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Editando reporteProduccion con body: %o', req.body);
        try {
            const reporteProduccion = await this.reporteProduccionService.edit(req.body as IReporteProduccion, req.user as IUsuarioDTO);
            return res.status(reporteProduccion ? 200 : 400).json({ status: reporteProduccion ? 200 : 400, reporteProduccion: reporteProduccion, message: reporteProduccion ? 'reporteProduccion creada correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error editando una reporteProduccion');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findById reporteProduccions');
        try {
            const reporteProduccion = await this.reporteProduccionService.findById(req.params.id);
            return res.status(200).json({ status: 200, reporteProduccion: reporteProduccion });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo reporteProduccions findById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByTarea = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByTarea reporteProduccions');
        try {
            const reportesProduccion = await this.reporteProduccionService.findByTarea(req.params.idTarea);
            return res.status(200).json({ status: 200, reportesProduccion: reportesProduccion });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo reporteProduccions findByTarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findLast3ByTarea = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findLast3ByTarea reporteProduccions');
        try {
            const reportesProduccion = await this.reporteProduccionService.findLast3ByTarea(req.params.idTarea);
            return res.status(200).json({ status: 200, reportesProduccion: reportesProduccion });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo reporteProduccions findLast3ByTarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public sendPhoto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo importar')
        try {
            req.pipe(req.busboy);
            req.busboy.on('file', async function (fieldname, file, filename) {
                var reporteProduccionService = new ReporteProduccionService();
                reporteProduccionService.sendPhoto(req.params.idReporteProduccion, file, filename, req.user).then(value => {
                    return res.status(200).json({ status: 200 });
                }).catch(e => {
                    Logger.error('Se ha producido un error en el metodo send photo reporte tarea');
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
    public downloadFiles = async (req: Request, res: Response) => {
        Logger.debug('Descargando zip de los ficheros del reporte');
        try {
            /*await this.reporteProduccionService.downloadFiles(req.params.reporteProduccion).then((zipName) => {
                // return res.status(200).json({url:`${config.upload_dir}/${req.params.reporteProduccion}/${zipName}`});
                // return res.status(200).download(`${config.upload_dir}/${req.params.reporteProduccion}/${zipName}`,zipName);
                res.download(`${config.upload_dir}/${req.params.reporteProduccion}/${zipName}`, zipName);
            });*/
            this.reporteProduccionService.downloadFiles(req.params.reporteProduccion, res);
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo downloadFiles del reporte');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public exportarArchivosProyecto = async (req: Request, res: Response) => {
        Logger.debug('Descargando exportarArchivosProyecto');
        try {

            await this.reporteProduccionService.exportarArchivosProyecto(req.params.idProyecto, res);

        } catch (e) {
            Logger.error('Se ha producido un error en el metodo exportarArchivosProyecto');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

}
