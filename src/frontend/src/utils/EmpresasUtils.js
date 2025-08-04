import axios from 'axios';
import { API_URL } from '../config/config';
const EMPRESAS_URL = '/empresas';

export const findById = (id) => axios.get(API_URL + EMPRESAS_URL + '/findById/' + id);
export const findAll = () => axios.get(API_URL + EMPRESAS_URL + '/findAll');
export const create = (empresa) => axios.post(API_URL + EMPRESAS_URL, empresa);
export const edit = (empresa) => axios.put(API_URL + EMPRESAS_URL, empresa);
export const sendLogo = (idEmpresa, photo) => axios.post(API_URL + EMPRESAS_URL + '/sendLogo/' + idEmpresa, photo);