import AdquisicionController from '../../controllers/adquisicion.controllers'
import { Router } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
const route = Router();

export default (app: Router) => {
    const adquisicionController = new AdquisicionController;
    app.use('/adquisiciones', route);

    route.get('/findByProyecto/:idProyecto/:search?',
        middlewares.hasPermission("SP"),
        adquisicionController.findByProyecto);
    route.get('/findByProyectoNombre/:idProyecto',
        adquisicionController.findByProyectoNombre);
    route.get('/findByNombre/:idProyecto/:idEmpresa',
        adquisicionController.findByProyectoNombreEmpresa);
    route.get('/findAllByNombre/:idProyecto',
        adquisicionController.findAllByNombre);
    route.get('/findByEmpresaSub/:idEmpresa/',
        adquisicionController.findByEmpresaSub);
    route.get('/findByTarea/:idTarea', adquisicionController.findByTarea);
    route.get('/',
        middlewares.hasPermission("VAR"),
        adquisicionController.findAll);
    route.get('/findById/:id',
        middlewares.hasPermission("VR"),
        adquisicionController.findById);
    route.post('/generarComparativo',
        celebrate({
            body: Joi.array().items(
                Joi.object({
                    recurso: Joi.string().required(),
                    unidad: Joi.string().required(),
                    costeEmpresa: Joi.array().items(
                        Joi.object({
                            coste: Joi.number(),
                            medicion: Joi.number(),
                            nombreEmpresa: Joi.string().required()
                        })
                    ).required()
                })
            ).required()
        }),
        adquisicionController.generarComparativo);
    route.post('/',
        celebrate({
            body: Joi.object({
                idAdquisicion: Joi.string().allow(null),
                nombre: Joi.string().required(),
                tipo: Joi.string().required(),
                unidad: Joi.string().required(),
                proyecto: Joi.string().required(),
                tareas: Joi.array().items(Joi.object({ tarea: Joi.string().required(), factor: Joi.number() })).allow(null),
                precio: Joi.number(),
                empresaSubcontrata: Joi.string().required()
            }),
        }),
        middlewares.hasPermission("CR"),
        adquisicionController.create);
    route.put('/',
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                idAdquisicion: Joi.string().required(),
                nombre: Joi.string().required(),
                tipo: Joi.string().required(),
                unidad: Joi.string().required(),
                proyecto: Joi.string().required(),
                empresas: Joi.string().required(),
                tareas: Joi.array().items(Joi.string()).allow(null),
                updated_for: Joi.string().required(),
                _version: Joi.number().integer().required()
            }),
        }),
        middlewares.hasPermission("ER"),
        adquisicionController.edit);
    route.post('/deleteMany',
        celebrate({
            body: Joi.object({ adquisicionsId: Joi.array().items(Joi.string()) })
        }),
        middlewares.hasPermission("BR"),
        adquisicionController.deleteMany);
    route.put('/asociarTarea/:idAdquisicion/:idTarea', adquisicionController.asociarTarea);
    route.get('/findTareasByWord/:word/:idProyecto', adquisicionController.findTareasByWord);
    route.get('/findMaquinasByProyecto/:idProyecto', adquisicionController.findMaquinasByProyecto);
    route.get('/findMaterialesByProyecto/:idProyecto', adquisicionController.findMaterialesByProyecto);
};
