import axios from 'axios';
import { API_URL } from '../config/config';
const AUTHENTICATION_URL = '/authentication';

export const login = (credentials) => axios.post(API_URL + AUTHENTICATION_URL + '/', credentials);
export const check = () => axios.get(API_URL + AUTHENTICATION_URL)
export const logout = () => axios.delete(API_URL + AUTHENTICATION_URL)