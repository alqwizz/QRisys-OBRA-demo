import { Request, Response, NextFunction } from 'express';
import PedidoService from '../services/pedido.services';
import Logger from '../loaders/logger'
import { IPedido } from '../interfaces/IPedido';
import AdquisicionService from "../services/adquisicion.services";
import config from "../config";
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class PedidoController {
    private pedidoService: PedidoService;
    private adquisicionService: AdquisicionService;

    constructor() {
        this.pedidoService = new PedidoService();
        this.adquisicionService = new AdquisicionService();
    }
    public create = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Creando nuevo pedido con body: %o', req.body);
        try {
            const pedido = await this.pedidoService.create(req.body.pedido as IPedido, req.user as IUsuarioDTO);
            let promises = [];
            req.body.pedido.adquisiciones.forEach((adquisicionPedido, i) => {
                if (req.body.tarea) promises.push(this.adquisicionService.asociarTarea(adquisicionPedido.nombre, req.body.tarea));
                promises.push(this.adquisicionService.setPrecio(adquisicionPedido._id, adquisicionPedido.precio, req.user as IUsuarioDTO));
                promises.push(this.adquisicionService.setUnidad(adquisicionPedido._id, adquisicionPedido.unidad, req.user as IUsuarioDTO));
            });
            Promise.all(promises).then(() => {
                return res.status(pedido ? 200 : 400).json({ status: pedido ? 200 : 400, pedido: pedido, message: pedido ? 'Pedido creado correctamente' : 'Se ha producido un error.' });
            }).catch(err => {
                Logger.error(err);
                Logger.error("Se ha producido un error al asignar las tareas.");
                return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
            });
        } catch (e) {
            Logger.error('Se ha producido un error creando una pedido');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public edit = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Editando pedido con body: %o', req.body);
        try {
            const pedido = await this.pedidoService.edit(req.body as IPedido, req.user as IUsuarioDTO);
            return res.status(pedido ? 200 : 400).json({ status: pedido ? 200 : 400, pedido: pedido, message: pedido ? 'pedido creada correctamente' : 'Se ha producido un error.' });
        } catch (e) {
            Logger.error('Se ha producido un error editando una pedido');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findById = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findById pedidos');
        try {
            const pedido = await this.pedidoService.findById(req.params.id);
            return res.status(200).json({ status: 200, pedido: pedido });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo pedidos findById');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findByTarea = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findByTarea pedidos');
        try {
            const pedidos = await this.pedidoService.findByTarea(req.params.idTarea);
            return res.status(200).json({ status: 200, pedidos: pedidos });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo pedidos findByTarea');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public findAll = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo findAll pedidos');
        try {
            const pedidoes = await this.pedidoService.findAll();
            return res.status(200).json({ status: 200, pedidoes: pedidoes });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo pedidos findAll');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public deleteMany = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo deleteMany pedidos');
        try {
            await this.pedidoService.deleteMany(req.body.pedidosId);
            return res.status(200).json({ status: 200 });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo deleteMany');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }

    public findByProyecto = async (req: Request, res: Response) => {
        Logger.debug("Buscar pedidos por proyecto");
        try {
            const pedidos = await this.pedidoService.findByProyecto(req.params.idProyecto, req.params.search);
            return res.status(200).json({ status: 200, pedidos: pedidos });
        } catch (e) {
            Logger.error("Se ha producido un error al buscar por proyectos");
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    };
    /*
        public readQR = async (req: Request, res: Response) => {
            try {
                const pedido = await this.pedidoService.readQR(req.params.id, req.body.correcto);
                return res.status(200).json({ status: 200, pedido: pedido, message: 'Se ha ledio correctamente el QR' });
            } catch (e) {
                Logger.error("Se ha producido un error al leer el código QR.");
                Logger.error(e);
                return res.status(400).json({ status: 400, error: e });
            }
        }*/

    public anular = async (req: Request, res: Response) => {
        Logger.debug("anulando pedido");
        try {
            const pedido = await this.pedidoService.anular(req.body.pedidoId, req.body.comentario);
            return res.status(200).json({ status: 200, pedido: pedido, message: 'Pedido anulado correctamente' });
        } catch (e) {
            Logger.error("Se ha producido un error al anular el pedido.");
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    };

    public aceptar = async (req: Request, res: Response) => {
        Logger.debug("aceptar pedido");
        try {
            const pedido = await this.pedidoService.aceptar(req.body.pedidoId, req.body.comentario);
            return res.status(200).json({ status: 200, pedido: pedido, message: 'Pedido aceptado correctamente' });
        } catch (e) {
            Logger.error("Se ha producido un error al aceptar el pedido.");
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }
    public rechazar = async (req: Request, res: Response) => {
        Logger.debug("aceptar pedido");
        try {
            const pedido = await this.pedidoService.rechazar(req.body.pedidoId, req.body.comentario);
            return res.status(200).json({ status: 200, pedido: pedido, message: 'Pedido rechazado correctamente' });
        } catch (e) {
            Logger.error("Se ha producido un error al rechazar el pedido.");
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }
    public acopiar = async (req: Request, res: Response) => {
        Logger.debug("acopiar adquisiciones pedido");
        try {
            const pedido = await this.pedidoService.acopiar(req.body.pedidoId, req.body.geolocalizacion);
            return res.status(200).json({ status: 200, pedido: pedido, message: 'Adquisiciones acopiadas correctamente' });
        } catch (e) {
            Logger.error("Se ha producido un error al acopiar la adquisicion del pedido.");
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }
    public usar = async (req: Request, res: Response) => {
        Logger.debug("usar adquisicion pedido");
        try {
            const mensaje = await this.pedidoService.usar(req.body.pedidoId, req.body.adquisicionId, req.body.number, req.body.geolocalizacion);
            return res.status(200).json({ status: 200, mensaje: mensaje });
        } catch (e) {
            Logger.error("Se ha producido un error al usar la adquisicion del pedido.");
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }
    public entregarMaquina = async (req: Request, res: Response) => {
        Logger.debug("entregarMaquina adquisicion pedido");
        try {
            const mensaje = await this.pedidoService.entregarMaquina(req.body.pedidoId, req.body.adquisicionId, req.body.number, req.body.geolocalizacion);
            return res.status(200).json({ status: 200, mensaje: mensaje });
        } catch (e) {
            Logger.error("Se ha producido un error al entregarMaquina del pedido.");
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }
    public reportarProblemaMaquina = async (req: Request, res: Response) => {
        Logger.debug("reportarProblemaMaquina adquisicion pedido");
        try {
            const mensaje = await this.pedidoService.reportarProblemaMaquina(req.body.pedidoId, req.body.adquisicionId, req.body.geolocalizacion, req.body.number, req.body.descripcion);
            return res.status(200).json({ status: 200, mensaje: mensaje });
        } catch (e) {
            Logger.error("Se ha producido un error al reportarProblemaMaquina del pedido.");
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }
    public qrAdquisicion = async (req: Request, res: Response) => {
        Logger.debug("qrAdquisicion adquisicion pedido");
        try {
            const mensaje = await this.pedidoService.qrAdquisicion(req.params.idPedido, req.params.idAdquisicion, req.body.geolocalizacion);
            return res.status(200).json({ status: 200, mensaje });
        } catch (e) {
            Logger.error("Se ha producido un error al qrAdquisicion del pedido.");
            Logger.error(e);
            return res.status(400).json({ status: 400, error: e });
        }
    }
    public sendPhotoProblemaAdquisicion = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo sendPhotoProblemaAdquisicion')
        try {
            req.pipe(req.busboy);
            req.busboy.on('file', async function (fieldname, file, filename) {
                var pedidoService = new PedidoService();
                pedidoService.sendPhotoProblemaAdquisicion(req.params.idPedido, req.params.idAdquisicion, file, filename).then(value => {
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
        Logger.debug('Descargando zip de los ficheros del pedido');
        Logger.debug(req.params.idPedido);
        try {
            this.pedidoService.downloadFiles(req.params.idPedido, res);
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo downloadFiles del pedido');
            // Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public sendPhoto = async (req: Request, res: Response, next: NextFunction) => {
        Logger.debug('Metodo send photo pedido')
        try {
            req.pipe(req.busboy);
            req.busboy.on('file', async function (fieldname, file, filename) {
                var pedidoService = new PedidoService();
                pedidoService.sendPhoto(req.params.idPedido, file, filename, req.user).then(value => {
                    return res.status(200).json({ status: 200 });
                }).catch(e => {
                    Logger.error('Se ha producido un error en el metodo send photo pedido');
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

    public sendPhotoReporte = async (req: Request, res: Response) => {
        Logger.debug('Método para subir ficheros al reportar pedido');
        try {
            req.pipe(req.busboy);
            req.busboy.on('file', async (fieldname, file, filename) => {
                this.pedidoService.sendPhotoReporte(req.params.idPedido, file, filename, req.user, req.params.tipo).then(() => {
                    return res.status(200).json({ status: 200, message: 'Se ha subido correctamente el fichero' });
                }).catch(e => {
                    Logger.error('Se ha producido un error en el metodo send photo del reporte del pedido');
                    Logger.error(e);
                    return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
                });
            });
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo send photo del reporte del pedido');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public generateExcel = async (req: Request, res: Response) => {
        Logger.debug('generateExcel pedido');
        try {
            await this.pedidoService.generateExcel(req.params.idPedido, res);
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo generateExcel del pedido');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public solicitarPresupuesto = async (req: Request, res: Response) => {
        Logger.debug('solicitarPresupuesto');
        try {
            await this.pedidoService.solicitarPresupuesto(req.body.empresaSubcontrata, req.body.adquisiciones, res);
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo solicitarPresupuesto');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public exportarExcel = async (req: Request, res: Response) => {
        Logger.debug('exportarExcel pedidos');
        try {
            await this.pedidoService.exportarExcel(req.params.idProyecto, res);
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo exportarExcel pedidos');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
    public exportarData = async (req: Request, res: Response) => {
        Logger.debug('exportarData pedidos');
        try {
            await this.pedidoService.exportarData(req.params.idProyecto, res);
            //console.log(zipName)
            //res.download(`${config.upload_dir}/${req.params.idProyecto}/${zipName}`);
        } catch (e) {
            Logger.error('Se ha producido un error en el metodo exportarData pedidos');
            Logger.error(e);
            return res.status(400).json({ status: 400, message: "Se ha producido un error inesperado. Contacte con el administrador." });
        }
    }
}
