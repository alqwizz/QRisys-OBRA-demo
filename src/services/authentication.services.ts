import Usuario from '../models/usuario.model';
import Rol from '../models/rol.model';
import Permiso from '../models/permiso.model';
import { IUsuario, IUsuarioDTO } from '../interfaces/IUsuario';

export default class AuthenticationService {
    constructor() { }

    public login = async (email: String, password: string): Promise<{ user: IUsuarioDTO, correct: Boolean }> => {
        var correct: Boolean = false;
        try {
            var err, user = await Usuario.findOne({ $or: [{ username: email }, { email: email }] }).select("+password +rol");
            if (err) throw err;

            if (user)
                correct = await user.validPassword(password);

            if (correct) {
                var err, rol = await Rol.findOne({ _id: user.rol });
                if (err) throw err;
                var err, permisos = await Permiso.find({ _id: { $in: rol.permisos } });
                if (err) throw err;
                return { user: { _id: user._id, permisos: permisos, username: user.username, nombre: user.nombre, apellidos: user.apellidos, telefono: user.telefono, email: user.email, pantallaOrigen: rol.pantallaOrigen, rol: user.rol, proyectos: user.proyectos as String[] }, correct: true };
            } else return { user: null, correct: false }
        } catch (e) {
            throw e;
        }
    }
}