import AvisoController from '../../controllers/aviso.controllers'
import { Router } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
const route = Router();

export default (app: Router) => {
    const avisoController = new AvisoController;
    app.use('/avisos', route);
    route.post('/',
        middlewares.hasPermission('CA'),
        celebrate({
            body: Joi.object({
                titulo: Joi.string().required(),
                descripcion: Joi.string().required(),
                fecha: Joi.number().required(),
                proyecto: Joi.string().required()
            }),
        }),
        avisoController.create);
    route.put('/',
        middlewares.hasPermission('CA'),
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                titulo: Joi.string().required(),
                descripcion: Joi.string().required(),
                fecha: Joi.number().required(),
                updated_for: Joi.string(),
                proyecto: Joi.string().required(),
                _version: Joi.number().integer().required()
            }),
        }),
        avisoController.edit);
    route.put('/marcarLeido/:idAviso',
        avisoController.marcarLeido);
    route.get('/findToday',
        avisoController.findToday);
    route.get('/findByProyecto/:idProyecto',
        avisoController.findByProyecto);
    route.get('/',
        avisoController.findAll);
};
