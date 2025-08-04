import passport from 'passport';
import Usuario from '../models/usuario.model'
import Permiso from '../models/permiso.model'
import Rol from '../models/rol.model'
import { IUsuario, IUsuarioDTO } from '../interfaces/IUsuario';

export default async () => {
    passport.serializeUser(function (user: IUsuarioDTO, done) {
        done(null, user._id);
    })
    passport.deserializeUser(function (id, done) {
        Usuario.findById(id, '+rol', function (err, user: IUsuario) {
            //console.log(user)
            if (err) throw err;
            if (user) {
                Rol.findById(user.rol, (err, rol) => {
                    if (err) throw err;
                    if (rol) {
                        Permiso.find({ _id: { $in: rol.permisos } }, (err, permisos) => {
                            if (err) throw err;
                            done(err, {
                                empresas: user.empresas,
                                proyectos: user.proyectos,
                                tareas: user.tareas,
                                _id: user._id,
                                email: user.email,
                                nombre: user.nombre,
                                apellidos: user.apellidos,
                                telefono: user.telefono,
                                rol: user.rol,
                                pantallaOrigen: rol.pantallaOrigen,
                                permisos: permisos
                            });
                        });
                    } else {
                        done(err, {
                            empresas: user.empresas,
                            proyectos: user.proyectos,
                            tareas: user.tareas,
                            _id: user._id,
                            email: user.email,
                            nombre: user.nombre,
                            apellidos: user.apellidos,
                            telefono: user.telefono,
                            rol: user.rol
                        });
                    }
                });
            } else done(err, null);

        });
    })
}
