import axios from 'axios';
import { API_URL } from '../config/config';
const AVISOS_URL = API_URL + '/avisos';

export const findToday = () => axios.get(AVISOS_URL + '/findToday');
export const findByProyecto = (idProyecto) => axios.get(AVISOS_URL + '/findByProyecto/' + idProyecto)
export const findAll = () => axios.get(AVISOS_URL + '/');
export const create = (aviso) => axios.post(AVISOS_URL, aviso);
export const marcarLeido = (avisoId) => axios.put(AVISOS_URL + '/marcarLeido/' + avisoId);
export const edit = (aviso) => axios.put(AVISOS_URL, aviso);