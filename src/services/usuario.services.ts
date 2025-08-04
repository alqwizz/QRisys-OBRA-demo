import Usuario from '../models/usuario.model';
import Proyecto from '../models/proyecto.model';
import Tarea from '../models/tarea.model';
import TareaService from '../services/tarea.services';
import Rol from '../models/rol.model';
import { IUsuarioInputDTO, IUsuarioDTO } from '../interfaces/IUsuario';
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import Logger from '../loaders/logger'

export default class UsuarioService {
    constructor() { }

    public findUserData = async (userId) => {
        try {
            var err, userRes = await Usuario.findById(userId);
            if (err) throw err
            if (!userRes) return null;
            const user = userRes.toObject();
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');
            Reflect.deleteProperty(user, 'rol');
            return user;
        } catch (e) {
            // Log Errors
            throw e;
        }
    }
    public create = async (user: IUsuarioInputDTO, userContext: IUsuarioDTO): Promise<any> => {
        try {
            var userNew = new Usuario({ ...user, updated_for: userContext._id });
            const { salt, hashedPassword } = await userNew.encryptPassword(userNew.password);
            userNew.salt = salt;
            userNew.password = hashedPassword;

            var err, userCreated = await userNew.save();
            if (err) throw err;

            userCreated = userCreated.toObject();

            Reflect.deleteProperty(userCreated, 'password');
            Reflect.deleteProperty(userCreated, 'salt');

            return userCreated;
        } catch (e) {
            throw e;
        }
    }
    public edit = async (user: IUsuarioDTO, userContext: IUsuarioDTO): Promise<any> => {
        try {
            var err, userOld = await Usuario.findById(user._id);

            if (err) throw err;
            if (!userOld) return null;

            userOld.nombre = user.nombre;
            userOld.apellidos = user.apellidos;
            userOld.telefono = user.telefono;
            userOld.email = user.email;
            userOld.rol = user.rol;
            userOld.username = user.username;

            userOld.updated_for = userContext._id as string;

            var err, userNew = await userOld.save();
            userNew = userNew.toObject();


            Reflect.deleteProperty(userNew, 'password');
            Reflect.deleteProperty(userNew, 'salt');
            return userNew;
        } catch (e) {
            throw e;
        }
    }
    public editCredentials = async (password: string, idUsuario: string, userContext: IUsuarioDTO): Promise<void> => {
        try {
            var err, user = await Usuario.findById(idUsuario);

            if (err) throw err;

            const { salt, hashedPassword } = await user.encryptPassword(password);
            user.salt = salt;
            user.password = hashedPassword;


            user.updated_for = userContext._id as string;

            var err, userNew = await user.save();
            if (err) throw err;

        } catch (e) {
            throw e;
        }
    }
    public delete = async (userId: String): Promise<Boolean> => {
        try {
            var err, res = await Usuario.findByIdAndDelete(userId);
            if (err) throw err;
            return true;
        } catch (e) {
            throw e;
        }
    }
    public deleteMany = async (usersId: [string]): Promise<void> => {
        try {
            var err, res = await Usuario.deleteMany({ _id: { $in: usersId } });
            if (err) throw err;

        } catch (e) {
            throw e;
        }
    }
    public findAll = async (): Promise<[IUsuarioDTO]> => {
        try {
            var err, res = await Usuario.find();
            if (err) throw err;
            return res as unknown as [IUsuarioDTO];
        } catch (e) {
            throw e;
        }
    }
    public findByEmpresa = async (idEmpresa): Promise<any> => {
        try {
            var err, res = await Usuario.find({ empresas: { $in: idEmpresa } });
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
    public findByProyecto = async (idProyecto): Promise<[IUsuarioDTO]> => {
        try {
            var err, res = await Usuario.find({ proyectos: { $in: idProyecto } });
            if (err) throw err;
            return res as unknown as [IUsuarioDTO];
        } catch (e) {
            throw e;
        }
    }
    public findByEmpresaNoProyecto = async (idProyecto): Promise<[IUsuarioDTO]> => {
        try {
            var err, proyecto = await Proyecto.findById(idProyecto);
            if (err) throw err;
            if (!proyecto) throw new Error('No se encuentra ningun proyecto, usuario.services line 127');
            var err, res = await Usuario.find({ proyectos: { $nin: idProyecto }, empresas: proyecto.empresa });
            if (err) throw err;
            return res as unknown as [IUsuarioDTO];
        } catch (e) {
            throw e;
        }
    }
    public asignarProyecto = async (idProyecto: string, idUsuario: string): Promise<void> => {
        try {
            var err, res = await Usuario.findById(idUsuario);
            if (err) throw err;

            if (!(res.proyectos as [String]).includes(idProyecto)) {
                (res.proyectos as [String]).push(idProyecto);
                res.save();
            }
        } catch (e) {
            throw e;
        }
    }
    public quitarProyecto = async (idProyecto: string, idUsuario: string): Promise<void> => {
        try {
            var err, res = await Usuario.findById(idUsuario);
            if (err) throw err;
            if ((res.proyectos as [String]).includes(idProyecto)) {
                res.proyectos.splice((res.proyectos as [String]).indexOf(idProyecto), 1);
                res.save();
            }
        } catch (e) {
            throw e;
        }
    }
    public asignarTarea = async (idUsuario: string, idTarea: string): Promise<void> => {
        try {
            var err, res = await Usuario.findById(idUsuario);
            if (err) throw err;
            if (!(res.tareas as [String]).includes(idTarea)) {
                (res.tareas as [String]).push(idTarea)
                res.save()
            }
        } catch (e) {
            throw e;
        }
    }
    public quitarTarea = async (idUsuario: string, idTarea: string): Promise<void> => {
        try {
            var err, res = await Usuario.findById(idUsuario);
            if (err) throw err;

            if ((res.tareas as [String]).includes(idTarea)) {
                res.tareas.splice((res.tareas as [String]).indexOf(idTarea), 1);
                res.save()
            }
        } catch (e) {
            throw e;
        }
    }
    public findByProyectoNoTarea = async (idTarea): Promise<[IUsuarioDTO]> => {
        try {
            var err, tarea = await Tarea.findById(idTarea);
            if (err) throw err;
            if (!tarea) throw new Error('No se encuentra ninguna tarea');
            var err, res = await Usuario.find({ proyectos: tarea.proyecto, tareas: tarea });
            if (err) throw err;
            return res as unknown as [IUsuarioDTO];
        } catch (e) {
            throw e;
        }
    }
    public findById = async (id: string): Promise<any> => {
        try {
            var err, res = await Usuario.findById(id).select("+rol");;
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
    private calculaTareas(tareas, tareasRes, tareasIds, sonHijos = false) {
        for (let i = 0; i < tareas.length; i++) {
            const tar = tareas[i];
            if (sonHijos) {
                tareasRes.push(tar._id)
                if (tar.childrens && tar.childrens.length > 0) {
                    this.calculaTareas(tar.childrens, tareasRes, tareasIds, true);
                }
            } else if (tareasIds.includes(tar.idQrisys)) {
                tareasRes.push(tar._id)
                if (tar.childrens && tar.childrens.length > 0) {
                    this.calculaTareas(tar.childrens, tareasRes, tareasIds, true);
                }
            } else if (tar.childrens && tar.childrens.length > 0) {
                this.calculaTareas(tar.childrens, tareasRes, tareasIds);
            }
        }
    }
    public import = async (usuarios: unknown[], idProyecto: string, user: IUsuarioDTO, idEmpresa: string): Promise<void> => {
        try {
            Logger.debug("Importando " + usuarios.length + " usuarios")
            let startTime = new Date()
            for (let i = 0; i < usuarios.length; i++) {

                const u = usuarios[i];
                let error, rol = await Rol.findOne({ nombre: { $regex: u['PERFIL USUARIO'], $options: 'i' } });
                if (error) throw error;
                const salt = randomBytes(32);
                const hashedPassword = await argon2.hash(u['PASSWORD'] || u['USERNAME'], { salt: salt });
                let idTareas = u['PARTICIPA TAREAS/CAPITULOS'] ? u['PARTICIPA TAREAS/CAPITULOS'].split(';') : null;
                let idTareasFinal = [];
                if (idTareas) {
                    const tareaService = new TareaService();
                    let err, result = await tareaService.findByProyectoDesordenadas(idProyecto);
                    if (err) throw err;
                    this.calculaTareas(result.tareas, idTareasFinal, idTareas);
                }
                if (idTareasFinal.length === 0 && !idTareas) {
                    let err, tareas = await Tarea.find({ proyecto: idProyecto })
                    if (err) throw err;
                    idTareasFinal = tareas.map(tar => { return tar._id });
                }
                let us = {
                    proyectos: [idProyecto],
                    username: u['USERNAME'],
                    nombre: u['NOMBRE'],
                    apellidos: u['APELLIDOS'],
                    password: hashedPassword,
                    salt: salt,
                    email: u['EMAIL'],
                    telefono: u['TELEFONO'],
                    tareas: idTareasFinal,
                    rol: rol ? rol._id : null,
                    updated_for: user._id
                };
                let err, res = await Usuario.findOne({ username: us.username });
                if (err) throw err;
                if (!res) {
                    let err, res = await new Usuario({ ...us, empresas: [idEmpresa] }).save()
                    if (err) throw err
                } else {
                    if (!(res.proyectos as [String]).includes(idProyecto)) (res.proyectos as [String]).push(idProyecto);
                    if (!(res.empresas as [String]).includes(idEmpresa)) (res.empresas as [String]).push(idEmpresa);
                    for (let i = 0; i < idTareasFinal.length; i++) {
                        if (!(res.tareas as [String]).includes(idTareasFinal[i])) res.tareas.push(idTareasFinal[i])
                    }
                    res.password = us.password;
                    res.email = us.email;
                    res.telefono = us.telefono;
                    res.salt = us.salt;
                    res.nombre = us.nombre;
                    res.apellidos = us.apellidos;
                    res.rol = us.rol;
                    let err, r = res.save()
                    if (err) throw err;
                }
            }
            let endTime = new Date();
            var timeDiff = +endTime - +startTime; //in ms
            // strip the ms
            timeDiff /= 1000;
            // get seconds 
            var seconds = Math.round(timeDiff);
            Logger.debug('Usuarios time: ' + seconds + " seconds")
        } catch (e) {
            throw e;
        }
    }
}