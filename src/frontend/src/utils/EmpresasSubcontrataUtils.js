import axios from 'axios';
import { API_URL } from '../config/config';
const EMPRESAS_SUBCONTRATA_URL = '/empresasSubcontrata';

export const findById = (id) => axios.get(API_URL + EMPRESAS_SUBCONTRATA_URL + '/findById/' + id);
export const findByAdquisicion = (idAdquisicion) => axios.get(API_URL + EMPRESAS_SUBCONTRATA_URL + '/findByAdquisicion/' + idAdquisicion);
export const findByProyectoAdquisicionNombre = (idProyecto, nombre) => axios.get(API_URL + EMPRESAS_SUBCONTRATA_URL + '/findByProyectoAdquisicionNombre/' + idProyecto, { params: { nombre: nombre } });
export const findByProyecto = (idProyecto, search = '') => axios.get(API_URL + EMPRESAS_SUBCONTRATA_URL + '/findByProyecto/' + idProyecto + '/' + search);
export const findByTarea = (idTarea) => axios.get(API_URL + EMPRESAS_SUBCONTRATA_URL + '/findByTarea/' + idTarea);
export const create = (empresaSubcontrata) => axios.post(API_URL + EMPRESAS_SUBCONTRATA_URL, empresaSubcontrata);
export const edit = (empresaSubcontrata) => axios.put(API_URL + EMPRESAS_SUBCONTRATA_URL, empresaSubcontrata);
export const findByPersonal = (idProyecto, search) => axios.get(API_URL + EMPRESAS_SUBCONTRATA_URL + '/findByPersonal/' + idProyecto + '/' + search);
export const addPersonal = (idEmpresa, personal) => axios.post(API_URL + EMPRESAS_SUBCONTRATA_URL + '/addPersonal', { idEmpresa: idEmpresa, personal: personal });
