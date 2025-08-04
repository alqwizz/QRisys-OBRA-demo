import Tarea from "../models/tarea.model";
import Proyecto from "../models/proyecto.model";
import { ITarea } from "../interfaces/ITarea";
import { IUsuarioDTO } from "../interfaces/IUsuario";
import Utils from "./utils/utils";
import ProyectoService from "./proyecto.services";
import AdquisicionService from "./adquisicion.services";
import mongoose from "mongoose";
import Logger from "../loaders/logger";
import { Response } from "express";
import xl from "excel4node";

export default class TareaService {
  constructor() {}

  public create = async (tarea, user: IUsuarioDTO): Promise<ITarea> => {
    try {
      let parent = null;
      var err,
        res = await Tarea.findOne({
          proyecto: tarea.proyecto,
          codigo: "CONTRADICTORIO",
        });
      if (err) throw err;
      if (res) {
        parent = res;
      } else {
        var err,
          contradictorio = await new Tarea({
            updated_for: user._id,
            proyecto: tarea.proyecto,
            idQrisys: tarea.proyecto + "CONTRADICTORIO",
            nombre: "CONTRADICTORIO",
            codigo: "CONTRADICTORIO",
            presupuesto: 0,
            medicion: 0,
          }).save();
        if (err) throw err;
        if (!contradictorio)
          throw Error("No se ha podido generar el contradictorio padre");
        parent = contradictorio;
      }
      let tar = new Tarea({
        ...tarea,
        parent: parent ? parent._id : null,
        updated_for: user._id,
      });
      tar.idQrisys = tar._id;
      tar.codigo = tar._id;
      var err,
        tareaSaved = await tar.save();
      if (err) throw err;
      if (parent) {
        parent.updated_for = user._id;
        parent.childrens.push(tareaSaved._id);
        let err,
          parentRes = await parent.save();
        if (err) throw err;
        if (!parentRes)
          throw Error("No se ha podido actualizar la información del padre.");
      }
      return tareaSaved;
    } catch (e) {
      throw e;
    }
  };
  public edit = async (tarea: ITarea, user: IUsuarioDTO): Promise<void> => {
    try {
      let err,
        res = await Tarea.findByIdAndUpdate(tarea._id, {
          $set: {
            nombre: tarea.nombre,
            presupuesto: tarea.presupuesto,
            idPlanificacion: tarea.idPlanificacion,
            idPresupuesto: tarea.idPresupuesto,
            idPredecesora: tarea.idPredecesora,
            unidad: tarea.unidad,
            fInicio: tarea.fInicio,
            fFin: tarea.fFin,
            medicion: tarea.medicion,
          },
        });
      if (err) throw err;
      if (!res) throw Error("No se ha editado la tarea correctamente.");
    } catch (e) {
      throw e;
    }
  };
  public delete = async (
    tareaId: string,
    user: IUsuarioDTO
  ): Promise<Boolean> => {
    try {
      let err,
        tarea = await Tarea.findById(tareaId);
      if (err) throw err;

      tarea.updated_for = user._id;
      await tarea.save();

      let error,
        res = await Tarea.findByIdAndDelete(tareaId);
      if (error) throw error;
      return true;
    } catch (e) {
      throw e;
    }
  };
  public deleteMany = async (tareasId: [string]): Promise<void> => {
    try {
    } catch (e) {
      throw e;
    }
  };
  public findByProyectoAndUsuario = async (
    idProyecto: string,
    idUsuario: string
  ): Promise<any> => {
    try {
    } catch (e) {
      throw e;
    }
  };
  private getParent = (tarea: ITarea, parents): string => {
    try {
      let nombre = "";
      if (tarea.parent) {
        const parent = parents.find((x) => x._id + "" === tarea.parent + "");
        if (parent)
          nombre = parent.parent
            ? this.getParent(parent, parents) + " / " + parent.nombre
            : parent.nombre;
      }
      return nombre;
    } catch (e) {
      throw e;
    }
  };
  private addHijos = (childrens: ITarea[], tareas: ITarea[]) => {
    for (let i = 0; i < childrens.length; i++) {
      const child = childrens[i];
      if (child.childrens && child.childrens.length > 0) {
        this.addHijos(child.childrens as ITarea[], tareas);
      } else {
        const find = tareas.find((x) => x._id + "" === child._id + "");
        if (!find) {
          tareas.push(child);
        }
      }
    }
  };
  private diacriticSensitiveRegex = (string: string = ""): string => {
    return string
      .replace(/a/g, "[a,á,à,ä]")
      .replace(/e/g, "[e,é,ë]")
      .replace(/i/g, "[i,í,ï]")
      .replace(/o/g, "[o,ó,ö,ò]")
      .replace(/u/g, "[u,ü,ú,ù]");
  };
  public findByProyectoLista = async (
    idProyecto: string,
    user: IUsuarioDTO,
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ tareas: any; pages: number }> => {
    try {
      let query = {
        proyecto: idProyecto,
        childrens: { $size: 0 },
        estado: { $nin: ["completado", "cancelado"] },
      };
      if (search) {
        search = this.diacriticSensitiveRegex(
          search.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        );
        query = {
          ...query,
          ...{
            $or: [
              { nombre: { $regex: search, $options: "i" } },
              { codigo: { $regex: search, $options: "i" } },
              { unidad: { $regex: search, $options: "i" } },
              { estado: { $regex: search, $options: "i" } },
              { idQrisys: { $regex: search, $options: "i" } },
            ],
          },
        };
      }

      if (search) {
        var err,
          parentsFiltered = await Tarea.find({
            proyecto: idProyecto,
            "childrens.0": { $exists: true },
            $or: [
              { nombre: { $regex: search, $options: "i" } },
              { codigo: { $regex: search, $options: "i" } },
              { unidad: { $regex: search, $options: "i" } },
              { estado: { $regex: search, $options: "i" } },
              { idQrisys: { $regex: search, $options: "i" } },
            ],
          }).lean();
        if (err) throw err;
      }
      var err,
        tareas = await Tarea.find(query)
          .populate("reportesProduccion.reporte")
          .lean();
      var err,
        parents = await Tarea.find({
          proyecto: idProyecto,
          "childrens.0": { $exists: true },
        }).lean();
      if (err) throw err;
      if (search) {
        const adquisicionService = new AdquisicionService();
        const adquisiciones = await adquisicionService.findByProyecto(
          idProyecto,
          search
        );
        for (let i = 0; i < adquisiciones.length; i++) {
          //Añadimos las tareas relacionadas a las adquisiciones que ha devuelto la búsqueda
          const adquisicion = adquisiciones[i];
          if (adquisicion.tareas && adquisicion.tareas.length > 0) {
            for (let j = 0; j < adquisicion.tareas.length; j++) {
              const t = adquisicion.tareas[j];
              if (
                !tareas.find((x) => x._id + "" === (t.tarea as ITarea)._id + "")
              ) {
                tareas.push(t.tarea as ITarea);
              }
            }
          }
        }
        for (let i = 0; i < parentsFiltered.length; i++) {
          const parent = parentsFiltered[i];
          if (parent.childrens && parent.childrens.length > 0)
            this.addHijos(parent.childrens as ITarea[], tareas);
        }
      }
      for (let i = 0; i < tareas.length; i++) {
        let tarea = tareas[i];
        if (!tarea) throw Error("La tarea no funsiona");
        tarea.parent = this.getParent(tarea, parents);
      }
      tareas.sort(this.compareTareas(user._id));
      const pages = Math.ceil(tareas.length / limit);
      const end = page * limit;
      const start = end - limit;
      const returning = tareas.slice(start, end);
      return { tareas: returning, pages };
    } catch (e) {
      throw e;
    }
  };
  public findByProyecto = async (
    idProyecto: string,
    user: IUsuarioDTO,
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ tareas: any; pages: number }> => {
    try {
      let tareas = [];
      let query = {
        proyecto: idProyecto,
        estado: { $nin: ["completado", "cancelado"] },
      };
      if (search) {
        query = {
          ...query,
          ...{
            $or: [
              { nombre: { $regex: search, $options: "i" } },
              { codigo: { $regex: search, $options: "i" } },
              { unidad: { $regex: search, $options: "i" } },
              { estado: { $regex: search, $options: "i" } },
              { idQrisys: { $regex: search, $options: "i" } },
            ],
          },
        };
        const adquisicionService = new AdquisicionService();
        const adquisiciones = await adquisicionService.findByProyecto(
          idProyecto,
          search
        );
        for (let i = 0; i < adquisiciones.length; i++) {
          //Añadimos las tareas relacionadas a las adquisiciones que ha devuelto la búsqueda
          tareas = tareas.concat(adquisiciones[i].tareas);
        }
      } else {
        query = { ...query, ...{ parent: null } };
      }
      var err,
        res = await Tarea.find(query);
      if (err) throw err;
      tareas = tareas.concat(res);

      let resultado = [];
      if (!search) {
        resultado = tareas;
      } else {
        for (let i = 0; i < tareas.length; i++) {
          const tarea = tareas[i];
          resultado = resultado.filter((x) => {
            if (x.parent)
              return x.parent._id
                ? x.parent._id + "" !== tarea._id + ""
                : x.parent + "" !== tarea._id + "";
            else return true;
          });
          if (
            (tarea.parent &&
              !resultado.find((x) =>
                x._id + "" === tarea.parent._id
                  ? tarea.parent._id
                  : tarea.parent
              )) ||
            !tarea.parent
          ) {
            if (!resultado.find((x) => x._id + "" === tarea._id + ""))
              resultado.push(tarea);
          }
        }
      }
      //Filtramos las tareas para devolver solo una vez cada tarea y de forma ordenada como un arbol
      this.sortTareas(resultado as ITarea[], user._id);
      const pages = Math.ceil(resultado.length / limit);
      const end = page * limit;
      const start = end - limit;
      const returning = resultado.slice(start, end);
      return { tareas: returning, pages: pages === 0 ? 1 : pages };
    } catch (e) {
      throw e;
    }
  };

  public findByProyectoDesordenadas = async (
    idProyecto: string,
    page?: number,
    limit?: number,
    search?: string
  ): Promise<{ tareas: any; pages: number }> => {
    try {
      let tareas = [];
      let query = {
        proyecto: idProyecto,
        estado: { $nin: ["completado", "cancelado"] },
      };
      if (search) {
        search = this.diacriticSensitiveRegex(
          search.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        );
        query = {
          ...query,
          ...{
            $or: [
              { nombre: { $regex: search, $options: "i" } },
              { codigo: { $regex: search, $options: "i" } },
              { unidad: { $regex: search, $options: "i" } },
              { estado: { $regex: search, $options: "i" } },
              { idQrisys: { $regex: search, $options: "i" } },
            ],
          },
        };
        const adquisicionService = new AdquisicionService();
        const adquisiciones = await adquisicionService.findByProyecto(
          idProyecto,
          search
        );
        for (let i = 0; i < adquisiciones.length; i++) {
          const adq = adquisiciones[i];
          for (let j = 0; j < adq.tareas.length; j++) {
            //Añadimos las tareas relacionadas a las adquisiciones que ha devuelto la búsqueda
            if (
              adq.tareas[j].tarea &&
              (adq.tareas[j].tarea as ITarea).estado !== "cancelado"
            )
              tareas = tareas.concat(adq.tareas[j].tarea);
          }
        }
      } else {
        query = { ...query, ...{ parent: null } };
      }
      var err,
        res = await Tarea.find(query);
      if (err) throw err;
      tareas = tareas.concat(res);

      let resultado = [];
      if (!search) {
        resultado = tareas;
      } else {
        for (let i = 0; i < tareas.length; i++) {
          const tarea = tareas[i];
          resultado = resultado.filter((x) => {
            if (x.parent)
              return x.parent._id
                ? x.parent._id + "" !== tarea._id + ""
                : x.parent + "" !== tarea._id + "";
            else return true;
          });
          if (
            (tarea.parent &&
              !resultado.find(
                (x) =>
                  x._id + "" ===
                  (tarea.parent._id ? tarea.parent._id : tarea.parent)
              )) ||
            !tarea.parent
          ) {
            if (!resultado.find((x) => x._id + "" === tarea._id + ""))
              resultado.push(tarea);
          }
        }
      }
      //Filtramos las tareas para devolver solo una vez cada tarea y de forma ordenada como un arbol
      let returning = resultado;
      let pages = 1;
      if (limit) {
        pages = Math.ceil(resultado.length / limit);
        const end = page * limit;
        const start = end - limit;
        returning = resultado.slice(start, end);
      }

      return { tareas: returning, pages: pages === 0 ? 1 : pages };
    } catch (e) {
      throw e;
    }
  };
  private sortTareas = async (tareas: ITarea[], idUser: string) => {
    try {
      for (let i = 0; i < tareas.length; i++) {
        const tarea = tareas[i];
        if (tarea.childrens.length > 0)
          this.sortTareas(tarea.childrens as ITarea[], idUser);
      }
      tareas.sort(this.compareTareas(idUser));
    } catch (e) {
      throw e;
    }
  };
  private diffDays = (date: Date): number => {
    var fInicio = date ? new Date(date) : new Date();

    var diff = Math.floor(new Date().getTime() - fInicio.getTime());

    var diffDays = Math.ceil(diff / (1000 * 3600 * 24));

    return diffDays;
  };
  //Si devuelve <0, se coloca a en un indice menor que b, o sea, primero
  //Si devuelve=0, se dejan en la misma posicion
  //Si devuelve >0, se coloca b en un indice menor que a, o sea, primero.
  private compareTareas = (idUser) => (a: ITarea, b: ITarea): number => {
    /*
                1. Tienen reportes (Si una de las dos tiene reportes, esa va primero)
                2. Tienen reportes del usuario (Si una de las dos tiene reportes del usuario, esa va primero)
                3. Diferencia de las fechas de reportes del usuario / nº reportes del usuario (El numero mas grande va primero)
                4. Diferencia de las fechas de reportes/nº reportes (Numero mas grande primero)
                5. Fecha de inicio de la tarea
                */
    const lengthA = a.reportesProduccion
      ? a.reportesProduccion.length
        ? a.reportesProduccion.length
        : 0
      : 0;
    const lengthB = b.reportesProduccion
      ? b.reportesProduccion.length
        ? b.reportesProduccion.length
        : 0
      : 0;

    if (lengthA > 0 && !(lengthB > 0)) return -1; //Si a tiene reportes y b no, a primero
    if (!(lengthA > 0) && lengthB > 0) return 1; //Si b tiene reportes y a no, b primero
    if (lengthA > 0 && lengthB > 0) {
      //Si a y b tienen reportes, miramos si tienen reportes del usuario
      let fechasValuesAUser,
        fechasValuesBUser,
        fechasValuesA,
        fechasValuesB = 0; //Calculamos la diferencia de días desde que se hicieron los reportes, por el usuario y por los demas.
      const filterA = a.reportesProduccion.filter((x) => {
        fechasValuesA += this.diffDays(x.fechaCreacion);
        if (x.usuario + "" === idUser) {
          fechasValuesAUser += this.diffDays(x.fechaCreacion);
          return true;
        }
      });
      const filterB = b.reportesProduccion.filter((x) => {
        fechasValuesB += this.diffDays(x.fechaCreacion);
        if (x.usuario + "" === idUser) {
          fechasValuesBUser += this.diffDays(x.fechaCreacion);
          return true;
        }
      });
      if (filterA.length > 0 && !(filterB.length > 0)) return -1; //Si a tiene reportes del usuario y b no, a primero
      if (filterB.length > 0 && !(filterA.length > 0)) return 1; //Si b tiene reportes del usuario y a no, b primero
      if (filterB.length > 0 && filterA.length > 0) {
        //Si ambos tienen reportes del usuario
        fechasValuesA = fechasValuesA / a.reportesProduccion.length;
        fechasValuesAUser = fechasValuesAUser / filterA.length;

        fechasValuesB = fechasValuesB / b.reportesProduccion.length;
        fechasValuesBUser = fechasValuesBUser / filterB.length;

        if (fechasValuesAUser > fechasValuesBUser) return -1;
        if (fechasValuesAUser < fechasValuesBUser) return 1;
        if (fechasValuesA > fechasValuesB) return -1;
        if (fechasValuesA < fechasValuesB) return 1;
      }
    }
    //si ninguno tiene reportes
    const diffDateA = this.diffDays(a.fInicio);
    const diffDateB = this.diffDays(b.fInicio);
    return diffDateA > diffDateB ? -1 : 1;
  };
  public propagarEstado = async (
    tarea: ITarea,
    user: IUsuarioDTO
  ): Promise<void> => {
    try {
      let err,
        parent = await Tarea.findById(tarea.parent);
      if (err) throw err;
      if (parent && tarea.estado !== parent.estado) {
        let proyectoService = null;
        if (tarea.estado === "iniciado" && parent.estado === "sin_iniciar") {
          parent.estado = "iniciado";
          parent.updated_for = user._id;
          let err,
            res = await parent.save();
          if (err) throw err;
          if (parent.parent) {
            await this.propagarEstado(parent, user);
          } else {
            proyectoService = new ProyectoService();
            await proyectoService.propagarEstado(res, user);
          }
        } else if (tarea.estado === "completado") {
          const find = parent.childrens.find((x) => {
            x = x as ITarea;
            return x.estado !== "completado" && "" + x._id !== "" + tarea._id;
          });
          if (!find) {
            parent.estado = "completado";
            parent.updated_for = user._id;
            let err,
              res = await parent.save();
            if (err) throw err;
            if (parent.parent) {
              await this.propagarEstado(parent, user);
            } else {
              proyectoService = new ProyectoService();
              await proyectoService.propagarEstado(res);
            }
          } else if (parent.estado === "sin_iniciar") {
            parent.updated_for = user._id;
            parent.estado = "iniciado";
            let err,
              res = await parent.save();
            if (err) throw err;
            if (parent.parent) {
              await this.propagarEstado(parent, user);
            } else {
              proyectoService = new ProyectoService();
              await proyectoService.propagarEstado(res, user);
            }
          }
        }
      }
    } catch (err) {
      throw err;
    }
  };
  public saveInfoReportes = async (
    tarea: ITarea,
    idTarea: string,
    fechaCreacion: Date,
    idUser: string,
    idReporte: string
  ): Promise<void> => {
    try {
      if (tarea.parent) {
        let err,
          parent = await Tarea.findById(tarea.parent);
        if (err) throw err;
        if (!parent) throw Error("No se puede encontrar el padre de la tarea.");
        await this.saveInfoReportes(
          parent,
          idTarea,
          fechaCreacion,
          idUser,
          idReporte
        );
      }
      const row = {
        tarea: idTarea,
        usuario: idUser,
        reporte: idReporte,
        fechaCreacion: fechaCreacion,
      };
      let err,
        res = await Tarea.findOneAndUpdate(
          { _id: tarea._id },
          {
            $set: {},
            $addToSet: { reportesProduccion: row },
          }
        );
      if (err) throw err;
      if (!res) throw Error("No se ha podido guardar la tarea");
    } catch (e) {
      throw e;
    }
  };
  public findByProyectoArray = async (
    idProyecto: string,
    user
  ): Promise<any> => {
    try {
      let tareas = [];
      if (Utils.hasPermission("VATP", user)) {
        var err,
          res = await Tarea.find({ proyecto: idProyecto });
        if (err) throw err;
        tareas = res;
      } else if (Utils.hasPermission("VST", user)) {
        var err,
          res = await Tarea.find({
            proyecto: idProyecto,
            _id: { $in: user.tareas },
          });
        if (err) throw err;
        tareas = res;
      }
      return tareas;
    } catch (e) {
      throw e;
    }
  };
  private splitByLastDot = function (text) {
    if (text) {
      var index = text.lastIndexOf(".");

      if (index !== -1) return text.slice(0, index);
      else return null;
    } else return null;
  };
  private async agruparPorCapitulosTarea(tarea, parent) {
    if (parent) {
      tarea.parent = parent._id;
      tarea.markModified("parent");
      var err,
        tarea = await tarea.save();
      if (err) throw err;
      if (
        !(
          parent.childrens.includes(tarea._id) ||
          parent.childrens.includes(tarea)
        )
      ) {
        parent.childrens.addToSet(tarea._id);
        parent.markModified("childrens");
        var err,
          parent = await parent.save();
      }
    } else {
      tarea.parent = null;
      tarea.markModified("parent");
      var err,
        tarea = await tarea.save();
      if (err) throw err;
    }
  }
  private async agruparPorCapitulos(idProyecto) {
    try {
      let err,
        tareas = await Tarea.find({ proyecto: idProyecto });
      if (err) throw err;

      for (let i = 0; i < tareas.length; i++) {
        let tarea = tareas[i];
        const parentCode = this.splitByLastDot(tarea.codigo);
        const parent = parentCode
          ? tareas.find((x) => x.codigo === parentCode)
          : null;
        await this.agruparPorCapitulosTarea(tarea, parent);
      }
    } catch (err) {
      throw err;
    }
  }
  public findByEmpresa = async (idEmpresa: string, user): Promise<ITarea[]> => {
    try {
      if (Utils.hasPermission("VAT", user)) {
        var err,
          proyectos = await Proyecto.find({ empresa: idEmpresa });
        if (err) throw err;
        let proyIds = proyectos.map((p) => {
          return p._id;
        });
        var err,
          res = await Tarea.find({ proyecto: { $in: proyIds } });
        if (err) throw err;
        return res;
      } else if (Utils.hasPermission("VST", user)) {
        var err,
          proyectos = await Proyecto.find({ empresa: idEmpresa });
        if (err) throw err;
        let proyIds = proyectos.map((p) => {
          return p._id;
        });
        var err,
          res = await Tarea.find({
            proyecto: { $in: proyIds },
            _id: { $in: user.tareas },
          });
        if (err) throw err;
        return res;
      }
      return [];
    } catch (e) {
      throw e;
    }
  };
  public findByUser = async (user): Promise<ITarea[]> => {
    try {
      var err,
        res = await Tarea.find({ _id: { $in: user.tareas } });
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public findById = async (id: string): Promise<ITarea> => {
    try {
      var err,
        res = await Tarea.findById(id);
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  private writeTareas = (
    tareas: ITarea[],
    ws,
    regularStyle,
    index: number
  ): number => {
    for (let i = 0; i < tareas.length; i++) {
      const tarea: ITarea = tareas[i];
      if (tarea) {
        const idPresupuesto =
          tarea && tarea.idPresupuesto ? tarea.idPresupuesto : "";
        const nombre = tarea && tarea.nombre ? tarea.nombre : "";
        const unidad = tarea && tarea.unidad ? tarea.unidad : "";
        const medicion = tarea && tarea.medicion ? tarea.medicion : null;
        const presupuesto =
          tarea && tarea.presupuesto ? tarea.presupuesto : null;
        const porcentajeActual =
          tarea && tarea.porcentajeActual ? tarea.porcentajeActual : null;
        const medicionActual =
          tarea && tarea.medicionActual ? tarea.medicionActual : null;
        const presupuestoActual =
          tarea && tarea.presupuestoActual ? tarea.presupuestoActual : null;

        ws.cell(index, 1).string(idPresupuesto).style(regularStyle);
        ws.cell(index, 2).string(nombre).style(regularStyle);
        ws.cell(index, 3).string(unidad).style(regularStyle);
        if (medicion) ws.cell(index, 4).number(medicion).style(regularStyle);
        if (presupuesto)
          ws.cell(index, 5).number(presupuesto).style(regularStyle);
        if (porcentajeActual)
          ws.cell(index, 6).number(porcentajeActual).style(regularStyle);
        if (medicionActual)
          ws.cell(index, 7).number(medicionActual).style(regularStyle);
        if (presupuestoActual)
          ws.cell(index, 8).number(presupuestoActual).style(regularStyle);

        index++;
        if (tarea.childrens && tarea.childrens.length > 0) {
          index = this.writeTareas(
            tarea.childrens as ITarea[],
            ws,
            regularStyle,
            index
          );
        }
      }
    }
    return index;
  };
  public exportarExcel = async (
    idProyecto: string,
    res: Response
  ): Promise<void> => {
    try {
      const wb = new xl.Workbook();
      const ws = wb.addWorksheet("EXCEL TAREAS");
      const headerStyle = wb.createStyle({
        fill: {
          type: "pattern",
          patternType: "solid",
          bgColor: "#cfe7f5",
          fgColor: "#cfe7f5",
        },
        alignment: {
          wrapText: true,
          horizontal: "center",
        },
      });
      const regularStyle = wb.createStyle({
        alignment: {
          wrapText: true,
          horizontal: "center",
        },
      });
      ws.cell(1, 1).string("ID PRESUPUESTO").style(headerStyle);
      ws.column(1).setWidth(20);
      ws.cell(1, 2).string("NOMBRE").style(headerStyle);
      ws.column(2).setWidth(60);
      ws.cell(1, 3).string("UNIDAD").style(headerStyle);
      ws.cell(1, 4).string("MEDICIÓN").style(headerStyle);
      ws.cell(1, 5).string("PRESUPUESTO").style(headerStyle);
      ws.column(5).setWidth(20);
      ws.cell(1, 6).string("%AVANCE").style(headerStyle);
      ws.cell(1, 7).string("MEDICION EJECUTADA").style(headerStyle);
      ws.column(7).setWidth(20);
      ws.cell(1, 8).string("PRESUPUESTO EJECUTADO").style(headerStyle);
      ws.column(8).setWidth(30);

      var resultado = await this.findByProyectoDesordenadas(idProyecto);
      const tareas = resultado.tareas;

      let index = 2;

      this.writeTareas(tareas, ws, regularStyle, index);

      wb.write("EXCEL TAREAS.xlsx", res);
    } catch (e) {
      throw e;
    }
  };
  public import = async (
    tareas: unknown[],
    idProyecto: string,
    user: IUsuarioDTO
  ): Promise<void> => {
    try {
      let startTime = new Date();
      Logger.debug("Importando " + tareas.length + " tareas ");
      for (let i = 0; i < tareas.length; i++) {
        const t = tareas[i];
        var fIni = null;
        var fFn = null;
        if (t["FECHA INICIO"]) {
          var fIniParts = t["FECHA INICIO"].replace(/_/g, "").split("/");
          fIni = new Date(+fIniParts[2], fIniParts[1] - 1, +fIniParts[0]);
        }
        if (t["FECHA FIN"]) {
          var fFnParts = t["FECHA FIN"].replace(/_/g, "").split("/");
          fFn = new Date(+fFnParts[2], fFnParts[1] - 1, +fFnParts[0]);
        }
        let tar = {
          proyecto: idProyecto,
          codigo: t["CÓDIGO"],
          idPlanificacion: t["ID PLANIFICACION"],
          idPredecesora: t["ID PREDECESORA"],
          idPresupuesto: t["ID PRESUPUESTO"],
          nombre: t["NOMBRE"],
          medicion: t["MEDICIÓN"],
          unidad: t["UNIDAD"],
          presupuesto: t["PRESUPUESTO"],
          coordenadasGPS: t["COORDENADAS GPS"],
          porcentajeActual: t["UNIDAD O PORCENTAJE ACTUAL"],
          idQrisys: t["ID QRISYS"],
          updated_for: user._id,
          parent: null,
          childrens: [],
        };
        if (fIni) tar["fInicio"] = fIni;
        if (fFn) tar["fFin"] = fFn;
        let err,
          res = await Tarea.findOneAndUpdate(
            { proyecto: tar.proyecto, idQrisys: tar.idQrisys },
            (tar as unknown) as [ITarea]
          );
        if (err) throw err;
        if (!res) {
          let err,
            res = await new Tarea(tar).save();
          if (err) throw err;
        }
      }
      await this.agruparPorCapitulos(idProyecto);
      let endTime = new Date();
      var timeDiff = +endTime - +startTime; //in ms
      // strip the ms
      timeDiff /= 1000;
      // get seconds
      var seconds = Math.round(timeDiff);
      Logger.debug("Tareas time: " + seconds + " seconds");
    } catch (e) {
      throw e;
    }
  };
  public cancelarTarea = async (
    idTarea: string,
    user: IUsuarioDTO
  ): Promise<void> => {
    try {
      let err,
        tarea = await Tarea.findById(idTarea);
      if (err) throw err;
      if (!tarea) throw new Error("No existe una tarea con esa id");
      if (tarea.childrens.length > 0) {
        await this.cancelarTareas(
          tarea.childrens as [ITarea & mongoose.Document],
          user
        );
      }
      tarea.estado = "cancelado";
      tarea.updated_for = user._id;
      let e,
        t = await tarea.save();
      if (e) throw e;
    } catch (e) {
      throw e;
    }
  };
  private cancelarTareas = async (
    tareas: [ITarea & mongoose.Document],
    user: IUsuarioDTO
  ): Promise<void> => {
    for (let i = 0; i < tareas.length; i++) {
      let tarea = tareas[i];
      tarea.estado = "cancelado";
      tarea.updated_for = user._id;
      let err,
        tar = await tarea.save();
      if (err) throw err;
      if (tarea.childrens.length > 0)
        this.cancelarTareas(
          tarea.childrens as [ITarea & mongoose.Document],
          user
        );
    }
  };
  public history = async () => {
    /*console.log(Audit)
        let err, history = await Audit.find({})
        if (err) throw err;
        console.log(history)*/
    return [];
  };
  public findByWord = async (
    word: string,
    idProyecto: string
  ): Promise<ITarea[]> => {
    try {
      let err,
        tareas = await Tarea.find({
          nombre: { $regex: word, $options: "i" },
          proyecto: idProyecto,
        }).lean();
      if (err) throw err;
      return tareas;
    } catch (e) {
      throw e;
    }
  };

  public findByRecurso = async (
    recurso: string,
    idProyecto: string
  ): Promise<ITarea[]> => {
    try {
      let err,
        tareas = await Tarea.find({
          proyecto: idProyecto,
        }).lean();

      function esRecurso(element, index, array) {
        return element.nombre === recurso;
      }
      function tieneTareaRecurso(element, index, array) {
        return element.recursosAsociados.filter(esRecurso).length > 0;
      }

      tareas = tareas.filter(tieneTareaRecurso);

      if (err) throw err;
      return tareas;
    } catch (e) {
      throw e;
    }
  };

  public findBetweenDates = async (
    dateInicio: string,
    dateFin: string,
    idProyecto: string
  ): Promise<ITarea[]> => {
    try {
      let err,
        tareas = await Tarea.find({
          proyecto: idProyecto,
          parent: null,
        }).lean();
      if (err) throw err;
      return tareas;
    } catch (e) {
      throw e;
    }
  };

  public addRecursoAsociado = async (
    tarea: ITarea,
    recurso: string,
    factor: number,
    precio: number,
    cantidad: number
  ): Promise<ITarea> => {
    try {
      if (cantidad === null)
        tarea.recursosAsociados.push({
          nombre: recurso,
          precio: precio,
          precioInicial: precio,
          cantidad: 0,
          factor: factor,
        });
      else {
        for (var i = 0; i < tarea.recursosAsociados.length; i++) {
          if (tarea.recursosAsociados[i].nombre === recurso)
            tarea.recursosAsociados[i] = {
              nombre: tarea.recursosAsociados[i].nombre,
              precio: precio,
              precioInicial: tarea.recursosAsociados[i].precioInicial,
              cantidad: cantidad,
              factor: tarea.recursosAsociados[i].factor,
            };
        }
      }

      let err,
        res = await Tarea.findByIdAndUpdate(tarea._id, {
          $set: {
            recursosAsociados: tarea.recursosAsociados,
          },
        });
      if (err) throw err;
      if (!res) throw Error("No se ha editado la tarea correctamente.");
      return res;
    } catch (e) {
      throw e;
    }
  };
  public updateCantidad = async (
    tarea: ITarea,
    recurso: string,
    cantidad: number
  ): Promise<ITarea> => {
    try {
      for (var i = 0; i < tarea.recursosAsociados.length; i++) {
        if (tarea.recursosAsociados[i].nombre === recurso)
          tarea.recursosAsociados[i] = {
            nombre: tarea.recursosAsociados[i].nombre,
            precio: tarea.recursosAsociados[i].precio,
            precioInicial: tarea.recursosAsociados[i].precioInicial,
            cantidad: cantidad,
            factor: tarea.recursosAsociados[i].factor,
          };
      }

      let err,
        res = await Tarea.findByIdAndUpdate(tarea._id, {
          $set: {
            recursosAsociados: tarea.recursosAsociados,
          },
        });
      if (err) throw err;
      if (!res) throw Error("No se ha editado la tarea correctamente.");
      return res;
    } catch (e) {
      throw e;
    }
  };
}
