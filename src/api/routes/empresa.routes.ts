import EmpresaController from '../../controllers/empresa.controllers'
import { Router } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
const route = Router();

export default (app: Router) => {
    const empresaController = new EmpresaController;
    app.use('/empresas', route);

    route.get('/findById/:id',
        middlewares.hasPermission(["VEP", "VEPU"]),
        empresaController.findById);
    route.get('/findAll',
        middlewares.hasPermission(["VEP", "VEPU"]),
        empresaController.findAll);

    route.post('/',
        celebrate({
            body: Joi.object({
                nombre: Joi.string().required(),
                nombreContacto: Joi.string().required(),
                cif: Joi.string().required(),
                telefono: Joi.string().allow(""),
                email: Joi.string().required(),
                direccion: Joi.string().allow("")
            }),
        }),
        middlewares.hasPermission("CE"),
        empresaController.create);
    route.put('/',
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                nombre: Joi.string().required(),
                nombreContacto: Joi.string().required(),
                cif: Joi.string().required(),
                logo: Joi.string().allow("", null),
                telefono: Joi.string().allow(""),
                email: Joi.string().required(),
                direccion: Joi.string().allow(""),
                updated_for: Joi.string().required(),
                _version: Joi.number().integer().required()
            }),
        }),
        middlewares.hasPermission("EE"),
        empresaController.edit);
    route.post('/sendLogo/:idEmpresa',
        middlewares.hasPermission(["CE", "EE"]),
        empresaController.sendLogo);
};