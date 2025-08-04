import UsuarioController from '../../controllers/usuario.controllers'
import { Router } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
const route = Router();

export default (app: Router) => {
    const usuarioController = new UsuarioController;
    app.use('/usuarios', route);
    /*route.get('/', (req: Request, res: Response, next: NextFunction) => {
        console.log('eeee')
        return res.status(200).json({ hola: 'hola' });
    })*/
    route.get('/findById/:id',
        middlewares.hasPermission("VU"),
        usuarioController.findById);
    route.get('/findAll',
        middlewares.hasPermission("VAU"),
        usuarioController.findAll);
    route.get('/findByEmpresa/:idEmpresa',
        middlewares.hasPermission("GU"),
        usuarioController.findByEmpresa);
    route.get('/findByProyecto/:idProyecto',
        middlewares.hasPermission("VAUP"),
        usuarioController.findByProyecto);
    route.get('/findByEmpresaNoProyecto/:idProyecto',
        middlewares.hasPermission("VAUE"),
        usuarioController.findByEmpresaNoProyecto);
    route.get('/findByProyectoNoTarea/:idTarea',
        middlewares.hasPermission("VAUP"),
        usuarioController.findByProyectoNoTarea);
    route.get('/',
        middlewares.isAuth,
        usuarioController.findUserData);

    route.post('/',
        middlewares.hasPermission("GU"),
        celebrate({
            body: Joi.object({
                nombre: Joi.string().required(),
                username: Joi.string().required(),
                apellidos: Joi.string().required(),
                telefono: Joi.string().required(),
                email: Joi.string().required(),
                password: Joi.string().required(),
                empresas: Joi.array().items(Joi.string()),
                proyectos: Joi.array().items(Joi.string()),
                tareas: Joi.array().items(Joi.string()),
                rol: Joi.string()
            }),
        }),
        usuarioController.createUser);
    route.put('/',
        middlewares.hasPermission("GU"),
        celebrate({
            body: Joi.object({
                _id: Joi.string().required(),
                username: Joi.string().required(),
                nombre: Joi.string().required(),
                apellidos: Joi.string().required(),
                telefono: Joi.string().required(),
                email: Joi.string().required(),
                empresas: Joi.array().items(Joi.string()),
                proyectos: Joi.array().items(Joi.string()),
                tareas: Joi.array().items(Joi.string()),
                rol: Joi.string(),
                updated_for: Joi.string().required(),
                _version: Joi.number().integer().required()
            }),
        }),
        usuarioController.editUser);
    route.put('/editCredentials/:idUsuario',
        middlewares.hasPermission("GU"),
        celebrate({
            body: Joi.object({ password: Joi.string().required(), })
        }),
        usuarioController.editCredentials);
    route.put('/asignarProyecto/:idProyecto/:idUsuario',
        usuarioController.asignarProyecto);
    route.put('/quitarProyecto/:idProyecto/:idUsuario',
        usuarioController.quitarProyecto);
    route.put('/asignarTarea/:idUsuario/:idTarea',
        middlewares.hasPermission("AT"),
        usuarioController.asignarTarea);
    route.put('/quitarTarea/:idUsuario/:idTarea',
        middlewares.hasPermission("AT"),
        usuarioController.quitarTarea);
};