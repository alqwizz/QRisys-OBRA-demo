import EmpresaSubcontrataController from '../../controllers/empresaSubcontrata.controllers'
import { Router } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
const route = Router();

export default (app: Router) => {
    const empresaSubcontrataController = new EmpresaSubcontrataController;
    app.use('/empresasSubcontrata', route);

    route.get('/findById/:id',
        middlewares.hasPermission("UNACTIVE"),
        empresaSubcontrataController.findById);
    route.get('/findByAdquisicion/:idAdquisicion',
        middlewares.hasPermission("VPm"),
        empresaSubcontrataController.findByAdquisicion);
    route.get('/findByProyectoAdquisicionNombre/:idProyecto',
        empresaSubcontrataController.findByProyectoAdquisicionNombre);
    route.get('/findByProyecto/:idProyecto/:search?',
        empresaSubcontrataController.findByProyecto);

    route.post('/',
        celebrate({
            body: Joi.object({
                nombre: Joi.string().required(),
                cif: Joi.string().required(),
                nombreContacto: Joi.string().required(),
                email: Joi.string().allow(null, ''),
                proyecto: Joi.string().required(),
                telefono: Joi.string().allow(null, ''),
                adquisiciones: Joi.array().items(Joi.object({
                    nombre: Joi.string().required(),
                    _id: Joi.string(),
                    tareas: Joi.array().items(Joi.string()),
                    tipo: Joi.string().required(),
                    precio: Joi.number().required(),
                    unidad: Joi.string().required(),
                })).required(),
            }),
        }),
        middlewares.hasPermission("CPV"),
        empresaSubcontrataController.create);
    route.put('/',
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                nombre: Joi.string().required(),
                cif: Joi.string().required(),
                nombreContacto: Joi.string().required(),
                email: Joi.string().allow(null, ''),
                proyecto: Joi.string().required(),
                telefono: Joi.string().allow(null, ''),
                adquisiciones: Joi.array().items(Joi.object({
                    nombre: Joi.string().required(),
                    _id: Joi.string(),
                    tipo: Joi.string().required(),
                    precio: Joi.number().required(),
                    unidad: Joi.string().required(),
                    tareas: Joi.array().items(Joi.object())
                })).required(),
                updated_for: Joi.string().required(),
            }),
        }),
        middlewares.hasPermission("EPR"),
        empresaSubcontrataController.edit);

    route.get('/findByProyecto/:idProyecto', empresaSubcontrataController.findByProyecto);

    route.get('/findByPersonal/:idProyecto/:search?',
        middlewares.hasPermission("VGPE"),
        empresaSubcontrataController.findByPersonal);
    route.post('/addPersonal',
        middlewares.hasPermission("CTB"),
        empresaSubcontrataController.addPersonal);

};
