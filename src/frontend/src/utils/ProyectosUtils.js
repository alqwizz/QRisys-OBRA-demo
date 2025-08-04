import axios from "axios";
import { API_URL } from "../config/config";
import { exportarExcel } from "./TareasUtils";
const PROYECTOS_URL = "/proyectos";

export const findById = (id) =>
  axios.get(API_URL + PROYECTOS_URL + "/findById/" + id);
export const findAll = () => axios.get(API_URL + PROYECTOS_URL + "/findAll");
export const findByUser = () =>
  axios.get(API_URL + PROYECTOS_URL + "/findByUser");
export const findByEmpresa = (idEmpresa) =>
  axios.get(API_URL + PROYECTOS_URL + "/findByEmpresa/" + idEmpresa);
export const create = (proyecto) =>
  axios.post(API_URL + PROYECTOS_URL, proyecto);
export const edit = (proyecto) => axios.put(API_URL + PROYECTOS_URL, proyecto);
export const editCTECI = (proyecto) =>
  axios.put(API_URL + PROYECTOS_URL + "/editCTECI/", proyecto);
export const deleteMany = (proyectosId) =>
  axios.post(API_URL + PROYECTOS_URL + "/deleteMany", proyectosId);
export const importPlanificacion = (idProyecto, file) =>
  axios.post(
    API_URL + PROYECTOS_URL + "/importPlanificacion/" + idProyecto,
    file,
    { timeout: 30 * 1000 * 60 }
  );
