import axios from 'axios';
import { API_URL } from '../config/config';
const PEDIDOS_URL = '/pedidos';

export const create = (pedido, tarea) => axios.post(API_URL + PEDIDOS_URL, { pedido: pedido, tarea: tarea });
export const edit = (pedido) => axios.put(API_URL + PEDIDOS_URL, pedido);
export const findById = (idPedido) => axios.get(API_URL + PEDIDOS_URL + '/findById/' + idPedido);
export const findByTarea = (idTarea) => axios.get(API_URL + PEDIDOS_URL + '/findByTarea/' + idTarea);
export const findByProyecto = (idProyecto, search) => axios.get(API_URL + PEDIDOS_URL + '/findByProyecto/' + idProyecto + '/' + search);
export const aceptar = (idPedido, comentario) => axios.put(API_URL + PEDIDOS_URL + '/aceptar', { pedidoId: idPedido, comentario: comentario });
export const rechazar = (idPedido, comentario) => axios.put(API_URL + PEDIDOS_URL + '/rechazar', { pedidoId: idPedido, comentario: comentario });
export const anular = (idPedido, comentario) => axios.put(API_URL + PEDIDOS_URL + '/anular', { pedidoId: idPedido, comentario: comentario });
export const acopiar = (idPedido) => axios.put(API_URL + PEDIDOS_URL + '/acopiar', { pedidoId: idPedido });
export const usar = (idPedido, idAdquisicion, geolocalizacion, number) => axios.put(API_URL + PEDIDOS_URL + '/usar', { pedidoId: idPedido, adquisicionId: idAdquisicion, geolocalizacion, number });
export const entregarMaquina = (idPedido, idAdquisicion, geolocalizacion, number) => axios.put(API_URL + PEDIDOS_URL + '/entregarMaquina', { pedidoId: idPedido, adquisicionId: idAdquisicion, number, geolocalizacion });
export const reportarProblemaMaquina = (idPedido, idAdquisicion, geolocalizacion, number, descripcion) => axios.put(API_URL + PEDIDOS_URL + '/reportarProblemaMaquina', { pedidoId: idPedido, adquisicionId: idAdquisicion, geolocalizacion, number, descripcion });
export const sendPhotoProblemaAdquisicion = (idPedido, idAdquisicion, photo) => axios.post(API_URL + PEDIDOS_URL + '/sendPhotoProblemaAdquisicion/' + idPedido + '/' + idAdquisicion, photo);
export const qrAdquisicion = (idPedido, idAdquisicion) => axios.put(API_URL + PEDIDOS_URL + '/qrAdquisicion/' + idPedido + '/' + idAdquisicion);
export const sendPhoto = (pedidoId, photo) => axios.post(API_URL + PEDIDOS_URL + '/sendPhoto/' + pedidoId, photo);
export const downloadFiles = (pedidoId) => axios.get(API_URL + PEDIDOS_URL + '/getFiles/' + pedidoId);
export const sendPhotoReporte = (idPedido, file, tipo) => axios.post(API_URL + PEDIDOS_URL + '/sendPhotoReporte/' + idPedido + '/' + tipo, file);
export const generateExcel = (pedidoId) => axios.get(API_URL + PEDIDOS_URL + '/generateExcel/' + pedidoId, {
    responseType: 'blob'
});
export const solicitarPresupuesto = (presupuesto) => axios.post(API_URL + PEDIDOS_URL + '/solicitarPresupuesto/', presupuesto, { responseType: 'blob' });
export const exportarExcel = (idProyecto) => axios.get(API_URL + PEDIDOS_URL + '/exportarExcel/' + idProyecto, { responseType: 'blob' });
export const exportarData = (idProyecto) => axios.get(API_URL + PEDIDOS_URL + '/exportarData/' + idProyecto, { responseType: 'blob' });