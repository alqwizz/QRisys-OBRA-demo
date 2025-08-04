import PedidoController from '../../controllers/pedido.controllers'
import { Router } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
const route = Router();

export default (app: Router) => {
    const pedidoController = new PedidoController;
    app.use('/pedidos', route);

    route.get('/',
        middlewares.hasPermission("VAR"),
        pedidoController.findAll);
    route.get('/findById/:id',
        pedidoController.findById);
    route.get('/findByTarea/:idTarea',
        middlewares.hasPermission("VTP"),
        pedidoController.findByTarea);
    route.get('/findByProyecto/:idProyecto/:search?',
        middlewares.hasPermission("VGCPE"),
        pedidoController.findByProyecto);
    route.get('/exportarExcel/:idProyecto',
        pedidoController.exportarExcel);
    route.get('/exportarData/:idProyecto',
        pedidoController.exportarData);
    route.post('/',
        celebrate({
            body: Joi.object({
                pedido: Joi.object({
                    adquisiciones: Joi.array().items(
                        Joi.object({
                            nombre: Joi.string(),
                            _id: Joi.string(),
                            tipo: Joi.string(),
                            precio: Joi.number(),
                            cantidad: Joi.number(),
                            unidad: Joi.string(),
                            estado: Joi.string()
                        })).required(),
                    empresaSubcontrata: Joi.string().required(),
                    proyecto: Joi.string().required(),
                    pagare: Joi.string().required(),
                    description: Joi.object({
                        solicitar: Joi.string().allow(null, ''),
                        recibir: Joi.string().allow(null, ''),
                        rechazar: Joi.string().allow(null, ''),
                        anular: Joi.string().allow(null, ''),
                    }),
                    fechaEsperada: Joi.date().allow(null, ''),
                    fechaRecepcion: Joi.date().allow(null, '')
                }),
                tarea: Joi.string().allow(null, '')
            }),
        }),
        middlewares.hasPermission("CP"),
        pedidoController.create);
    route.put('/',
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                adquisicion: Joi.string().required(),
                precio: Joi.number().required(),
                updated_for: Joi.string().required(),
                cantidad: Joi.number().required(),
                fechaRecepcion: Joi.date().allow(null, ''),
                _version: Joi.number().integer().required()
            }),
        }),
        middlewares.hasPermission("ER"),
        pedidoController.edit);
    route.post('/sendPhoto/:idPedido',
        pedidoController.sendPhoto);
    route.post('/deleteMany',
        celebrate({
            body: Joi.object({ pedidosId: Joi.array().items(Joi.string()) })
        }),
        middlewares.hasPermission("BR"),
        pedidoController.deleteMany);

    // route.put('/readQR/:id',
    //     pedidoController.readQR);

    route.put('/anular',
        celebrate({
            body: Joi.object({
                pedidoId: Joi.string().required(),
                comentario: Joi.string().allow(null, '')
            })
        }),
        middlewares.hasPermission("AP"),
        pedidoController.anular);
    route.put('/aceptar',
        celebrate({
            body: Joi.object({
                pedidoId: Joi.string().required(),
                comentario: Joi.string().allow(null, '')
            })
        }),
        middlewares.hasPermission("RRP"),
        pedidoController.aceptar);
    route.put('/rechazar',
        celebrate({
            body: Joi.object({
                pedidoId: Joi.string().required(),
                comentario: Joi.string().allow(null, '')
            })
        }),
        middlewares.hasPermission("RRP"),
        pedidoController.rechazar);
    route.put('/acopiar',
        celebrate({
            body: Joi.object({
                pedidoId: Joi.string().required()
            })
        }),
        pedidoController.acopiar);
    route.put('/usar',
        celebrate({
            body: Joi.object({
                pedidoId: Joi.string().required(),
                adquisicionId: Joi.string().required(),
                number: Joi.number().required(),
                geolocalizacion: Joi.object({
                    lat: Joi.number().required(),
                    lng: Joi.number().required()
                }).allow(null, '')
            })
        }),
        pedidoController.usar);
    route.put('/entregarMaquina',
        celebrate({
            body: Joi.object({
                pedidoId: Joi.string().required(),
                adquisicionId: Joi.string().required(),
                number: Joi.number().required(),
                geolocalizacion: Joi.object({
                    lat: Joi.number().required(),
                    lng: Joi.number().required()
                }).allow(null, '')
            })
        }),
        pedidoController.entregarMaquina);
    route.post('/solicitarPresupuesto',
        celebrate({
            body: Joi.object({
                empresaSubcontrata: Joi.string().required(),
                adquisiciones: Joi.array().items(
                    Joi.object({
                        nombre: Joi.string(),
                        _id: Joi.string(),
                        tipo: Joi.string(),
                        cantidad: Joi.number(),
                        unidad: Joi.string()
                    })).required()
            })
        }),
        middlewares.hasPermission("SP"),
        pedidoController.solicitarPresupuesto);
    route.put('/reportarProblemaMaquina',
        celebrate({
            body: Joi.object({
                pedidoId: Joi.string().required(),
                adquisicionId: Joi.string().required(),
                number: Joi.number().required(),
                geolocalizacion: Joi.object({
                    lat: Joi.number().required(),
                    lng: Joi.number().required()
                }),
                descripcion: Joi.string().allow('', null)
            })
        }),
        pedidoController.reportarProblemaMaquina);
    route.put('/qrAdquisicion/:idPedido/:idAdquisicion',
        pedidoController.qrAdquisicion);
    route.post('/sendPhotoProblemaAdquisicion/:idPedido/:idAdquisicion',
        pedidoController.sendPhotoProblemaAdquisicion);
    route.get('/getFiles/:idPedido',
        middlewares.hasPermission("DDPE"),
        pedidoController.downloadFiles);
    route.get('/generateExcel/:idPedido', pedidoController.generateExcel);

    route.post('/sendPhotoReporte/:idPedido/:tipo', pedidoController.sendPhotoReporte);

};
