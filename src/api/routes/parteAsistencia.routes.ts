import ParteAsistenciaController from '../../controllers/parteAsistencia.controller';
import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import middlewares from '../middlewares';
const route = Router();

export default (app: Router) => {
    const parteAsistenciaController = new ParteAsistenciaController();
    app.use('/parteAsistencia', route);

    route.get('/findByProyecto/:idProyecto',
        middlewares.hasPermission("VGPPT"),
        parteAsistenciaController.findByProyecto);
    route.get('/exportarExcel/:idProyecto',
        parteAsistenciaController.exportarExcel);

    route.post('/', celebrate({
        body: Joi.object({
            asistentes: Joi.array().items(Joi.object({
                nombre: Joi.string().required(),
                dni: Joi.string().required(),
                asiste: Joi.boolean().required(),
                horas: Joi.number().required()
            })),
            fecha: Joi.date().required(),
            proyecto: Joi.string(),
            empresa: Joi.string()
        }),
    }),
        middlewares.hasPermission("CPT"),
        parteAsistenciaController.create);

    route.get('/findByEmpresa/:idEmpresa',
        middlewares.hasPermission("VPT"),
        parteAsistenciaController.findByEmpresaAndDate);

};
