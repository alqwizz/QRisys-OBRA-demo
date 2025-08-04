import PermisoController from '../../controllers/permiso.controllers'
import { Router } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
const route = Router();

export default (app: Router) => {
    const permisoController = new PermisoController;
    app.use('/permisos', route);

    route.get('/findById/:id',
        middlewares.hasPermission("GR"),
        permisoController.findById);
    route.get('/',
        middlewares.hasPermission("GR"),
        permisoController.findAll);

};