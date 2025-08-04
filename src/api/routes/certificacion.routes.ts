import { Router } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
import CertificacionController from "../../controllers/certificacion.controllers";
const route = Router();

export default (app: Router) => {
    const certificacionController = new CertificacionController;
    app.use('/certificacion', route);

    route.get('/:idProyecto', certificacionController.findAll);
    route.post('/', celebrate({
        body: Joi.object({
            nombre: Joi.string().required(),
            fInicio: Joi.date().required(),
            fFin: Joi.date().required(),
            sobreCoste: Joi.number().required(),
            costeCert: Joi.number().required(),
            costeTotal: Joi.number().required(),
            perCert: Joi.number().required(),
            perTotal: Joi.number().required(),
            validada: Joi.boolean().required(),
            proyecto: Joi.string().required()
        })
    }), certificacionController.create);

    route.get('/generate/:idProyecto', certificacionController.generateCertificacion);
    route.post('/exportarExcel', celebrate({
        body: Joi.object({
            nombre: Joi.string().required().allow(""),
            fInicio: Joi.date().required(),
            fFin: Joi.date().required(),
            sobreCoste: Joi.number().required(),
            costeCert: Joi.number().required(),
            costeTotal: Joi.number().required(),
            perCert: Joi.number().required(),
            perTotal: Joi.number().required(),
            validada: Joi.boolean().required(),
            proyecto: Joi.string().required(),
            tareas: Joi.array()
        })
    }),
        certificacionController.exportarExcel);
    route.put('/validate', certificacionController.validateCertificacion);
};
