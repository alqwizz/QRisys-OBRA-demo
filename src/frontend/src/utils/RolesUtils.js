import axios from 'axios';
import { API_URL } from '../config/config';
const ROLES_URL = '/roles';

export const findById = (id) => axios.get(API_URL + ROLES_URL + '/findById/' + id);
export const findAll = () => axios.get(API_URL + ROLES_URL)
export const findAllByEmpresa = (idEmpresa) => axios.get(API_URL + ROLES_URL + '/findByEmpresa/' + idEmpresa)
export const create = (rol) => axios.post(API_URL + ROLES_URL, rol);
export const edit = (rol) => axios.put(API_URL + ROLES_URL, rol);
export const deleteMany = (rolId) => axios.post(API_URL + ROLES_URL + '/deleteMany', rolId);