import RolController from '../../controllers/rol.controllers'
import { Router } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import { join } from 'path';
const route = Router();

export default (app: Router) => {
    const rolController = new RolController;
    app.use('/roles', route);

    route.get('/',
        middlewares.hasPermission("GR"),
        rolController.findAll);
    route.get('/findById/:id',
        middlewares.hasPermission("VR"),
        rolController.findById);
    route.get('/findByEmpresa/:idEmpresa',
        middlewares.hasPermission("VR"),
        rolController.findByEmpresa);
    route.post('/',
        celebrate({
            body: Joi.object({
                permisos: Joi.array().items(Joi.string()),
                nombre: Joi.string().required(),
                pantallaOrigen: Joi.string()
            }),
        }, {
            allowUnknown: true
        }),
        middlewares.hasPermission("GR"),
        rolController.create);
    route.put('/',
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                nombre: Joi.string().required(),
                permisos: Joi.array().items(Joi.string()),
                updated_for: Joi.string().required().allow(null),
                pantallaOrigen: Joi.string(),
                _version: Joi.number().integer().required()
            }),
        }),
        middlewares.hasPermission("GR"),
        rolController.edit);
};