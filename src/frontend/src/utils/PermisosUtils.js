import axios from 'axios';
import { API_URL } from '../config/config';
const PERMISOS_URL = '/permisos';

export const findById = (id) => axios.get(API_URL + PERMISOS_URL + '/findById/' + id);
export const findAll = () => axios.get(API_URL + PERMISOS_URL)
export const create = (permiso) => axios.post(API_URL + PERMISOS_URL, permiso);
export const edit = (permiso) => axios.put(API_URL + PERMISOS_URL, permiso);
export const deleteMany = (permisoId) => axios.post(API_URL + PERMISOS_URL + '/deleteMany', permisoId);