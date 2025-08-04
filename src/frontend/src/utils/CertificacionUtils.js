import axios from 'axios';
import { API_URL } from '../config/config';
const CERTIFICACION_URL = '/certificacion';

export const getAllCertificaciones = (idProyecto) => axios.get(API_URL + CERTIFICACION_URL + '/' + idProyecto);
export const validateCert = (idCert) => axios.put(API_URL + CERTIFICACION_URL + '/validate', { idCertificacion: idCert });
export const createCert = (certificacion) => axios.post(API_URL + CERTIFICACION_URL, certificacion);
export const generateCertificacion = (fechaInicio, fechaFin, sobreCoste, proyecto) => axios.get(API_URL + CERTIFICACION_URL + '/generate/' + proyecto, { params: { fechaInicio: fechaInicio, fechaFin: fechaFin, sobreCoste: sobreCoste } });
export const exportCertificacion = (certificacion) => axios.post(API_URL + CERTIFICACION_URL + '/exportarExcel', certificacion, { responseType: 'blob' });
