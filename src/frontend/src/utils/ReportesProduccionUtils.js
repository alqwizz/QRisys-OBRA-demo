import axios from 'axios';
import { API_URL } from '../config/config';
const REPORTES_URL = '/reportesProduccion';

export const fileURL = (id, filename) => API_URL + '/' + id + '/' + filename;

export const findById = (id) => axios.get(API_URL + REPORTES_URL + '/findById/' + id);
export const findAll = () => axios.get(API_URL + REPORTES_URL)
export const findByTarea = (idTarea) => axios.get(API_URL + REPORTES_URL + '/' + idTarea)
export const findLast3ByTarea = (idTarea) => axios.get(API_URL + REPORTES_URL + '/last3/' + idTarea)
export const create = (reporteTarea) => axios.post(API_URL + REPORTES_URL, reporteTarea);
export const edit = (reporteTarea) => axios.put(API_URL + REPORTES_URL, reporteTarea);
export const deleteMany = (reporteTareaId) => axios.post(API_URL + REPORTES_URL + '/deleteMany', reporteTareaId);
export const sendPhoto = (reporteTareaId, photo) => axios.post(API_URL + REPORTES_URL + '/sendPhoto/' + reporteTareaId, photo);
export const downloadFiles = (reporteProduccionId) => axios.get(API_URL + REPORTES_URL + '/getFiles/' + reporteProduccionId);
export const exportarArchivosProyecto = (idProyecto) => axios.get(API_URL + REPORTES_URL + '/exportarArchivosProyecto/' + idProyecto, { responseType: 'blob' });
