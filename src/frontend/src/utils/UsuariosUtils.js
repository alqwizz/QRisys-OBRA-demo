import axios from 'axios';
import { API_URL } from '../config/config';
const USUARIOS_URL = '/usuarios';

export const findUserById = (id) => axios.get(API_URL + USUARIOS_URL + '/findById/' + id);
export const findAll = () => axios.get(API_URL + USUARIOS_URL + '/findAll');
export const findByEmpresa = (idEmpresa) => axios.get(API_URL + USUARIOS_URL + '/findByEmpresa/' + idEmpresa);
export const findByEmpresaNoProyecto = (idProyecto) => axios.get(API_URL + USUARIOS_URL + '/findByEmpresaNoProyecto/' + idProyecto);
export const findByProyectoNoTarea = (idTarea) => axios.get(API_URL + USUARIOS_URL + '/findByProyectoNoTarea/' + idTarea);
export const findByProyecto = (idProyecto) => axios.get(API_URL + USUARIOS_URL + '/findByProyecto/' + idProyecto);
export const create = (user) => axios.post(API_URL + USUARIOS_URL, user);
export const edit = (user) => axios.put(API_URL + USUARIOS_URL, user);
export const editCredentials = (idUsuario, password) => axios.put(API_URL + USUARIOS_URL + '/editCredentials/' + idUsuario, password)
export const deleteMany = (usersId) => axios.post(API_URL + USUARIOS_URL + '/deleteMany', usersId);
export const importFile = (file) => axios.post(API_URL + USUARIOS_URL + '/import', file);
export const asignarTarea = (idUsuario, idTarea) => axios.put(API_URL + USUARIOS_URL + '/asignarTarea/' + idUsuario + '/' + idTarea);
export const quitarTarea = (idUsuario, idTarea) => axios.put(API_URL + USUARIOS_URL + '/quitarTarea/' + idUsuario + '/' + idTarea);
export const asignarProyecto = (idProyecto, idUsuario) => axios.put(API_URL + USUARIOS_URL + '/asignarProyecto/' + idProyecto + '/' + idUsuario);
export const quitarProyecto = (idProyecto, idUsuario) => axios.put(API_URL + USUARIOS_URL + '/quitarProyecto/' + idProyecto + '/' + idUsuario);
