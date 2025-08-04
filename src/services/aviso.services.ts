import Aviso from '../models/aviso.model';
import Usuario from '../models/usuario.model';
import { IAviso, IAvisoInput } from '../interfaces/IAviso';
import { IUsuarioDTO } from '../interfaces/IUsuario';

export default class AvisoService {
    constructor() { }

    public create = async (aviso: IAvisoInput, user: IUsuarioDTO): Promise<IAviso> => {
        try {
            var err, res = await new Aviso({ ...aviso, updated_for: user._id }).save();
            if (err) throw err;

            return res;
        } catch (e) {
            throw e;
        }
    }
    public edit = async (aviso: IAvisoInput, user: IUsuarioDTO): Promise<void> => {
        try {
            var err, res = await Aviso.findByIdAndUpdate(aviso._id, { ...aviso, updated_for: user._id });
            if (err) throw err;

        } catch (e) {
            throw e;
        }
    }
    public marcarLeido = async (idAviso: string, user: IUsuarioDTO): Promise<void> => {
        try {
            var err, res = await Aviso.findByIdAndUpdate(idAviso, {
                $set: {}, $addToSet: { usuarios: user._id }
            });
            if (err) throw err;
        } catch (e) {
            throw e;
        }
    }
    public findToday = async (user: IUsuarioDTO): Promise<IAviso[]> => {
        try {
            const yesterday = (new Date());
            yesterday.setDate(new Date().getDate() - 1);
            const yesterdayTime = yesterday.getTime();
            const ahora = new Date().getTime();

            //Se muestran aquellos que fecha<=ahora<=fecha+24
            //fecha <= ahora
            //fecha >= ahora - 24
            var err, usuario = await Usuario.findById(user._id);

            var err, res = await Aviso.find({ proyecto: { $in: usuario.proyectos }, fecha: { $lte: ahora, $gte: yesterdayTime }, usuarios: { $nin: usuario._id } });
            if (err) throw err;

            return res;
        } catch (e) {
            throw e;
        }
    }
    public findByProyecto = async (idProyecto: string): Promise<IAviso[]> => {
        try {

            var err, res = await Aviso.find({ proyecto: idProyecto });
            if (err) throw err;

            return res;
        } catch (e) {
            throw e;
        }
    }
    public findAll = async (): Promise<IAviso[]> => {
        try {
            var err, res = await Aviso.find({});
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
}
