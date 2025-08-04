import axios from 'axios';
import { API_URL } from '../config/config';
const ADQUISICIONES_URL = '/adquisiciones';

export const findById = (id) => axios.get(API_URL + ADQUISICIONES_URL + '/findById/' + id);
export const findAll = () => axios.get(API_URL + ADQUISICIONES_URL)
export const findByTarea = (idTarea) => axios.get(API_URL + ADQUISICIONES_URL + '/findByTarea/' + idTarea);
export const findByProyecto = (idProyecto) => axios.get(API_URL + ADQUISICIONES_URL + '/findByProyecto/' + idProyecto);
export const findByEmpresaSub = (idEmpresa) => axios.get(API_URL + ADQUISICIONES_URL + '/findByEmpresaSub/' + idEmpresa);
export const findByProyectoNombre = (idProyecto) => axios.get(API_URL + ADQUISICIONES_URL + '/findByProyectoNombre/' + idProyecto);
export const findAllByNombre = (idProyecto, nombre) => axios.get(API_URL + ADQUISICIONES_URL + '/findAllByNombre/' + idProyecto, { params: { nombre: nombre } });
export const findByNombre = (idProyecto, idEmpresa, nombre) => axios.get(API_URL + ADQUISICIONES_URL + '/findByNombre/' + idProyecto + '/' + idEmpresa, { params: { nombre: nombre } });
export const create = (adq) => axios.post(API_URL + ADQUISICIONES_URL, adq);
export const edit = (adq) => axios.put(API_URL + ADQUISICIONES_URL, adq);
export const deleteMany = (rolId) => axios.post(API_URL + ADQUISICIONES_URL + '/deleteMany', rolId);
export const findTareasByWord = (word, idProyecto) => axios.get(API_URL + ADQUISICIONES_URL + '/findTareasByWord/' + word + '/' + idProyecto);
export const asociarTarea = (idAdquisicion, idTarea) => axios.put(API_URL + ADQUISICIONES_URL + '/asociarTarea/' + idAdquisicion + '/' + idTarea)
export const generarComparativo = (comparativos) => axios.post(API_URL + ADQUISICIONES_URL + '/generarComparativo/', comparativos, { responseType: 'blob' });
export const findMaquinasByProyecto = (idProyecto) => axios.get(API_URL + ADQUISICIONES_URL + '/findMaquinasByProyecto/' + idProyecto)
export const findMaterialesByProyecto = (idProyecto) => axios.get(API_URL + ADQUISICIONES_URL + '/findMaterialesByProyecto/' + idProyecto)