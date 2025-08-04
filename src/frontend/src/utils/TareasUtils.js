import axios from 'axios';
import { API_URL } from '../config/config';
const TAREAS_URL = '/tareas';

export const findById = (id) => axios.get(API_URL + TAREAS_URL + '/findById/' + id);
export const findByUser = () => axios.get(API_URL + TAREAS_URL + '/findByUser');
export const findByProyectoAndUsuario = (proyectoId, usuarioId) => axios.get(API_URL + TAREAS_URL + '/findByProyectoAndUsuario/' + proyectoId + '/' + usuarioId);
export const findByProyecto = (proyectoId, page, limit, search) => axios.get(API_URL + TAREAS_URL + '/findByProyecto/' + proyectoId + '/' + page + '/' + limit + (search ? '/' + search : ''));
export const findByProyectoLista = (proyectoId, page, limit, search) => axios.get(API_URL + TAREAS_URL + '/findByProyectoLista/' + proyectoId + '/' + page + '/' + limit + (search ? '/' + search : ''));
export const findByProyectoDesordenadas = (proyectoId, page, limit, search) => axios.get(API_URL + TAREAS_URL + '/findByProyectoDesordenadas/' + proyectoId + '/' + page + '/' + limit + (search ? '/' + search : ''));
export const findByProyectoArray = (proyectoId) => axios.get(API_URL + TAREAS_URL + '/findByProyectoArray/' + proyectoId);
export const findByEmpresa = (empresaId) => axios.get(API_URL + TAREAS_URL + '/findByEmpresa/' + empresaId);
export const create = (tarea) => axios.post(API_URL + TAREAS_URL, tarea);
export const edit = (tarea) => axios.put(API_URL + TAREAS_URL, tarea);
export const deleteMany = (tareasId) => axios.post(API_URL + TAREAS_URL + '/deleteMany', tareasId);
export const cancelar = (tareaId) => axios.put(API_URL + TAREAS_URL + '/cancelarTarea/' + tareaId);
export const findByWord = (word, proyectoId) => axios.get(API_URL + TAREAS_URL + '/findByWord/' + word + '/' + proyectoId);
export const exportarExcel = (idProyecto) => axios.get(API_URL + TAREAS_URL + '/exportarExcel/' + idProyecto, { responseType: 'blob' });
