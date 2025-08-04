import axios from 'axios';
import { API_URL } from '../config/config';
const PARTE_ASISTENCIA_URL = '/parteAsistencia';

export const create = (parte) => axios.post(API_URL + PARTE_ASISTENCIA_URL, parte);
export const findByProyecto = (idProyecto) => axios.get(API_URL + PARTE_ASISTENCIA_URL + '/findByProyecto/' + idProyecto);
export const exportarExcel = (idProyecto) => axios.get(API_URL + PARTE_ASISTENCIA_URL + '/exportarExcel/' + idProyecto, { responseType: 'blob' });
export const findByEmpresaAndDate = (idEmpresa, fecha) => axios.get(API_URL + PARTE_ASISTENCIA_URL + '/findByEmpresa/' + idEmpresa, { params: { fecha: fecha } });
