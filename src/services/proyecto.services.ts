import Proyecto from "../models/proyecto.model";
import Empresa from "../models/empresa.model";
import EmpresaSubcontrata from "../models/empresaSubcontrata.model";
import Tarea from "../models/tarea.model";
import Usuario from "../models/usuario.model";
import TareaService from "../services/tarea.services";
import UsuarioService from "../services/usuario.services";
import AdquisicionService from "../services/adquisicion.services";
import { IProyecto } from "../interfaces/IProyecto";
import config from "../config";
import fs from "fs";
import mkdirp from "mkdirp";
import xlsx from "xlsx";
import Utils from "./utils/utils";
import { IUsuarioDTO } from "../interfaces/IUsuario";
import { ITarea } from "../interfaces/ITarea";
import { IEmpresaSubcontrata } from "../interfaces/IEmpresaSubcontrata";
import ReporteProduccionService from "./reporteProduccion.services";
import { IReporteProduccion } from "../interfaces/IReporteProduccion";
import { any } from "../frontend/src/assets/plugins/xcharts/xcharts";
import Logger from "../loaders/logger";
import { add } from "winston";

export default class ProyectoService {
  constructor() {}

  public create = async (proyecto, user: IUsuarioDTO): Promise<IProyecto> => {
    try {
      var err,
        empresa = await Empresa.findById(proyecto.empresa);
      if (err) throw err;
      if (!empresa)
        throw Error("No se encuentra la empresa indicada en el proyecto.");
      var proyectoNew = await new Proyecto({
        ...proyecto,
        updated_for: user._id,
      });
      proyectoNew.CC = [];
      proyectoNew.CTECI = [3.0];
      proyectoNew.CI = [];
      proyectoNew.CO = [];
      proyectoNew.CM = [];
      proyectoNew.CD = [];

      if (!proyectoNew.telefono) proyectoNew.telefono = empresa.telefono;
      if (!proyectoNew.email) proyectoNew.email = empresa.email;
      if (!proyectoNew.nombreContacto)
        proyectoNew.nombreContacto = proyectoNew.telefono =
          empresa.nombreContacto;
      var err,
        res = await proyectoNew.save();
      if (err) throw err;

      return res;
    } catch (e) {
      throw e;
    }
  };
  public edit = async (
    proyecto: IProyecto,
    user: IUsuarioDTO
  ): Promise<IProyecto> => {
    try {
      var err,
        proyectoOld = await Proyecto.findById(proyecto._id);

      if (err) throw err;
      if (!proyectoOld) return null;

      proyectoOld.nombreContacto = proyecto.nombreContacto;
      proyectoOld.nombre = proyecto.nombre;
      proyectoOld.lat = proyecto.lat;
      proyectoOld.lng = proyecto.lng;
      proyectoOld.estado = proyecto.estado;
      proyectoOld.fInicio = proyecto.fInicio;
      proyectoOld.fInicioReal = proyectoOld.fInicioReal;
      proyectoOld.fFin = proyecto.fFin;
      proyectoOld.telefono = proyecto.telefono;
      proyectoOld.email = proyecto.email;
      proyectoOld.direccion = proyecto.direccion;
      //proyectoOld.PorcentajeCI = proyecto.PorcentajeCI;

      proyectoOld.updated_for = user._id as string;

      var err,
        newProyecto = await proyectoOld.save();
      if (err) throw err;

      return newProyecto;
    } catch (e) {
      throw e;
    }
  };

  public delete = async (proyectoId: String): Promise<Boolean> => {
    try {
      var err,
        res = await Proyecto.findByIdAndDelete(proyectoId);
      if (err) throw err;
      return true;
    } catch (e) {
      throw e;
    }
  };
  public findByEmpresaAndUser = async (
    idEmpresa: string,
    idUser: string
  ): Promise<IProyecto[]> => {
    try {
      console.log("hola que pasa");
      var err,
        user = await Usuario.findById(idUser);
      if (err) throw err;
      if (!user) throw Error("No se ha encontrado el usuario");
      var err,
        proyectos = await Proyecto.find({
          _id: { $in: user.proyectos as string[] },
          empresa: idEmpresa,
        });
      if (err) throw err;
      return proyectos;
    } catch (e) {
      throw e;
    }
  };
  public findByEmpresa = async (idEmpresa: string): Promise<IProyecto[]> => {
    try {
      var err,
        res = await Proyecto.find({ empresa: idEmpresa });
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public propagarEstado = async (
    capitulo: ITarea,
    user: IUsuarioDTO
  ): Promise<void> => {
    try {
      let err,
        proyecto = await Proyecto.findById(capitulo.proyecto);
      if (err) throw err;
      if (capitulo.estado !== proyecto.estado) {
        if (
          capitulo.estado === "iniciado" &&
          proyecto.estado === "sin_iniciar"
        ) {
          proyecto.estado = "iniciado";
          proyecto.updated_for = user._id as string;
          let err,
            res = await proyecto.save();
          if (err) throw err;
        } else if (capitulo.estado === "completado") {
          let r,
            count = await Tarea.countDocuments({
              proyecto: proyecto._id,
              estado: { $ne: "completado" },
            });
          if (r) throw r;
          if (count === 0) {
            proyecto.updated_for = user._id as string;
            proyecto.estado = "completado";
            let err,
              res = await proyecto.save();
            if (err) throw err;
          }
        }
      }
    } catch (err) {
      throw err;
    }
  };
  public findById = async (id: string, userId?: string): Promise<IProyecto> => {
    try {
      let idProyecto = null;
      if (userId) {
        var err,
          user = await Usuario.findById(userId);
        if (err) throw err;
        if (!user) throw Error("No se ha encontrado el usuario");
        const find = user.proyectos.find((x) => x + "" === id);
        if (find) idProyecto = id;
      } else idProyecto = id;
      var err,
        res = await Proyecto.findById(idProyecto).populate("empresa");
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public importPlanificacion = async (
    idProyecto,
    file,
    filename,
    user
  ): Promise<void> => {
    try {
      const path = config.upload_dir;
      mkdirp.sync(path);
      const fstream = fs.createWriteStream(path + "/" + filename);
      file.pipe(fstream);
      await new Promise((fulfill) => fstream.on("close", fulfill));
      const route = config.upload_dir + "/" + filename;
      const woorkbook = xlsx.readFile(route);
      const arrayTareas = xlsx.utils.sheet_to_json(woorkbook.Sheets["TAREAS"]);
      const arrayUsuarios = xlsx.utils.sheet_to_json(
        woorkbook.Sheets["USUARIOS"]
      );
      const arrayAdquisiciones = xlsx.utils.sheet_to_json(
        woorkbook.Sheets["ADQUISICIONES"]
      );
      let err,
        proyecto = await Proyecto.findById(idProyecto);
      if (err) throw err;

      if (arrayTareas.length > 0)
        await new TareaService().import(arrayTareas, idProyecto, user);
      if (arrayUsuarios.length > 0)
        await new UsuarioService().import(
          arrayUsuarios,
          idProyecto,
          user,
          proyecto.empresa as string
        );
      if (arrayAdquisiciones.length > 0)
        await new AdquisicionService().import(
          arrayAdquisiciones,
          idProyecto,
          user
        );
    } catch (e) {
      throw e;
    }
  };

  public updateCCyCD = async (
    idProyecto: string | IProyecto,
    porcentajeReporte: number,
    tarea: ITarea,
    idReporte: string | IReporteProduccion,
    fechaDeReporte: Date,
    porcentajeOLD: number,
    precioTotalOLD: number
  ): Promise<IProyecto> => {
    try {
      // CALCULO COSTE PRODUCCIÓN

      // 1- Sacar proyecto (de la tarea)
      var err,
        proyectoOld = await Proyecto.findById(idProyecto);
      if (err) throw err;
      if (!proyectoOld) return null;

      //Comprobar si se es el primer reporte para actualizar la fecha de inicio Real del proyecto

      let present = new Date();
      let HOY = new Date(
        present.getFullYear(),
        present.getMonth(),
        present.getDate()
      );

      proyectoOld.fInicioReal = proyectoOld.fInicioReal
        ? proyectoOld.fInicioReal
        : HOY;

      // 3- ALGORITMO DE CALCULO

      var reporteService: ReporteProduccionService = new ReporteProduccionService();

      this.add0s(proyectoOld);
      var CCERT = [...proyectoOld.CC];
      var CDIR = [...proyectoOld.CD];

      var precioTotal = 0;
      const cantidadConsumida = porcentajeReporte * 0.01 * tarea.medicion;
      // NUEVO REPORTE
      if (fechaDeReporte === null) {
        // 3b - CALCULAMOS EL COSTE ASOCIADO AL REPORTE y lo añadimos
        for (let i = 0; i < tarea.recursosAsociados.length; i++) {
          if (
            tarea.recursosAsociados[i].cantidad &&
            tarea.recursosAsociados[i].cantidad > 0
          ) {
            tarea.recursosAsociados[i].cantidad -=
              cantidadConsumida * tarea.recursosAsociados[i].factor;
            if (tarea.recursosAsociados[i].cantidad < 0)
              tarea.recursosAsociados[i].cantidad = 0;
            precioTotal +=
              cantidadConsumida *
              tarea.recursosAsociados[i].factor *
              tarea.recursosAsociados[i].precio;

            var tareaService: TareaService = new TareaService();
            var err,
              toUpdateTasks = await tareaService.findByRecurso(
                tarea.recursosAsociados[i].nombre,
                tarea.proyecto.toString()
              );
            for (let j = 0; j < toUpdateTasks.length; j++) {
              var err,
                res = tareaService.updateCantidad(
                  toUpdateTasks[j],
                  tarea.recursosAsociados[i].nombre,
                  tarea.recursosAsociados[i].cantidad
                );
            }
          } else {
            precioTotal +=
              cantidadConsumida *
              tarea.recursosAsociados[i].factor *
              tarea.recursosAsociados[i].precioInicial;
          }
        }
        Logger.debug("ACTUALIZANDO VALORES");
        Logger.debug("Precio Total = " + precioTotal);
        var err,
          repres = await reporteService.addPrecioTotal(idReporte, precioTotal);
        Logger.debug("PrecioTotalNew: " + repres.precioTotal);
        if (err) throw err;

        var lastIndex = CCERT.length - 1;
        let costeRep = (porcentajeReporte / 100.0) * tarea.presupuesto;
        CCERT[lastIndex] += costeRep * 1.0;
        CDIR[lastIndex] += precioTotal * 1.0;
      }
      // EDICION REPORTE
      else {
        Logger.debug("Precio Antiguo: " + precioTotalOLD);
        let reportDate = new Date(
          fechaDeReporte.getFullYear(),
          fechaDeReporte.getMonth(),
          fechaDeReporte.getDate()
        );
        let index = Math.ceil(
          (reportDate.getTime() - proyectoOld.fInicio.getTime()) /
            (1000 * 3600 * 24)
        );

        CCERT[index] =
          CCERT[index] -
          0.01 * tarea.presupuesto * (porcentajeOLD - porcentajeReporte);

        for (let i = 0; i < tarea.recursosAsociados.length; i++) {
          precioTotal +=
            cantidadConsumida *
            tarea.recursosAsociados[i].factor *
            tarea.recursosAsociados[i].precioInicial;
        }
        CDIR[index] = precioTotal - precioTotalOLD;

        Logger.debug("ACTUALIZANDO VALORES");
        var err,
          repres = await reporteService.addPrecioTotal(idReporte, precioTotal);
        Logger.debug("PrecioTotalNew: " + repres.precioTotal);
        if (err) throw err;
      }

      // 4- Actualizamos proyecto

      Logger.debug("Aqui 3");
      proyectoOld.CC = CCERT;
      proyectoOld.CD = CDIR;
      var err,
        proy = await proyectoOld.save();
      if (err) throw err;
      if (!proy.CC)
        throw Error(
          "No se ha podido actualizar el proyecto." +
            CCERT[lastIndex] +
            proy.CC[lastIndex]
        );

      //FIN CALCULO COSTE

      return proy;
    } catch (e) {
      throw e;
    }
  };
  public updateCO = async (
    idProyecto: string | IProyecto,
    costeTipoOtros: number,
    fechaDePedido: Date
  ): Promise<IProyecto> => {
    try {
      // CALCULO COSTE OTROS

      // 1- Sacar proyecto (de la tarea)
      var err,
        proyectoOld = await Proyecto.findById(idProyecto);
      if (err) throw err;
      if (!proyectoOld) return null;

      //Comprobar si se es el primer pedido para actualizar días sin pedido
      // 3- ALGORITMO DE CALCULO

      this.add0s(proyectoOld);
      var COtros = [...proyectoOld.CO];
      // NUEVO PEDIDO
      if (fechaDePedido === null) {
        var lastIndex = COtros.length - 1;
        COtros[lastIndex] += costeTipoOtros * 1.0;
      }
      // ANULAR PEDIDO
      else {
        let orderDate = new Date(
          fechaDePedido.getFullYear(),
          fechaDePedido.getMonth(),
          fechaDePedido.getDate()
        );
        let index = Math.ceil(
          (orderDate.getTime() - proyectoOld.fInicio.getTime()) /
            (1000 * 3600 * 24)
        );
        var valorACTUAL = COtros[index];
        var nuevo = valorACTUAL - 1.0 * costeTipoOtros;
        COtros[index] = nuevo;
      }

      // 4- Actualizamos proyecto
      proyectoOld.CO = COtros;
      var err,
        proy = await proyectoOld.save();
      if (err) throw err;
      if (!proy.CO)
        throw Error(
          "No se ha podido actualizar el proyecto." +
            COtros[lastIndex] +
            proy.CO[lastIndex]
        );

      //FIN CALCULO COSTE

      return proy;
    } catch (e) {
      throw e;
    }
  };
  public updateCM = async (
    idProyecto: string | IProyecto,
    horaInicio: number,
    horaFin: number,
    precioPorHora: number,
    empresa: string | IEmpresaSubcontrata
  ): Promise<IProyecto> => {
    try {
      // CALCULO COSTE MAQUINARIA

      // 1- Sacar proyecto (de la tarea)
      var err,
        proyectoOld = await Proyecto.findById(idProyecto);
      if (err) throw err;
      if (!proyectoOld) return null;

      var err,
        contrata = await Empresa.findById(proyectoOld.empresa);
      var err,
        subContrata = await EmpresaSubcontrata.findById(empresa);

      if (contrata.nombre === subContrata.nombre) {
        //Comprobar si se es el primer reporte de uso para actualizar días sin pedido

        this.add0s(proyectoOld);
        var CMaq = [...proyectoOld.CM];

        // 3- ALGORITMO DE CALCULO
        var lastIndex = CMaq.length - 1;
        CMaq[lastIndex] +=
          ((horaFin - horaInicio) / (1000 * 3600)) * precioPorHora;

        // 4- Actualizamos proyecto
        proyectoOld.CM = CMaq;
        var err,
          proy = await proyectoOld.save();
        if (err) throw err;
        if (!proy.CM)
          throw Error(
            "No se ha podido actualizar el proyecto." +
              CMaq[lastIndex] +
              proy.CM[lastIndex]
          );

        //FIN CALCULO COSTE

        return proy;
      } else {
        return proyectoOld;
      }
    } catch (e) {
      throw e;
    }
  };

  public updateCTECI = async (obj: any): Promise<IProyecto> => {
    try {
      const idProyecto = obj._id;
      const newCTECI = obj.CTECI;
      Logger.debug(newCTECI);

      var err,
        proyectoOld = await Proyecto.findById(idProyecto);
      if (err) throw err;
      if (!proyectoOld) return null;

      this.add0s(proyectoOld);

      var CTECI = [...proyectoOld.CTECI];

      // 3- ALGORITMO DE CALCULO
      CTECI[CTECI.length - 1] = newCTECI;
      proyectoOld.CTECI = CTECI;
      Logger.debug("Array CTECI tras updateCTECI: " + proyectoOld.CTECI);

      var err,
        newProyecto = await proyectoOld.save();
      if (err) throw err;

      Logger.debug("Array CTECI tras .save(): " + newProyecto.CTECI);
      return newProyecto;

      //FIN CALCULO COSTE
    } catch (e) {
      throw e;
    }
  };

  public add0s = (proyectoOld) => {
    try {
      Logger.debug("Añadiendo 0s a los Arrays");

      var CTECI = [...proyectoOld.CTECI];
      if (CTECI.length === 0) CTECI.push(0.0);
      var CCERT = [...proyectoOld.CC];
      var CDIR = [...proyectoOld.CD];
      var COtros = [...proyectoOld.CO];
      var CMaq = [...proyectoOld.CM];

      let present = new Date();
      let HOY = new Date(
        present.getFullYear(),
        present.getMonth(),
        present.getDate()
      );

      const fInicio = new Date(proyectoOld.fInicio);

      let dif = (HOY.getTime() - fInicio.getTime()) / (1000 * 3600 * 24);

      /* Si no hay dias sin contabilizar diffDay == 0 y no se hace nada
            , en otro caso se añade un 0 por cada día sin contabilizar*/
      let difx = dif - CTECI.length + 1;

      if (difx > 0) {
        for (var j = 0; j < difx; j++) {
          CTECI.push(CTECI[CTECI.length - 1]);
        }
      }
      difx = dif - CCERT.length + 1;
      if (difx > 0) {
        for (var j = 0; j < difx; j++) {
          CCERT.push(0.0);
        }
      }

      difx = dif - CDIR.length + 1;
      if (difx > 0) {
        for (var j = 0; j < difx; j++) {
          CDIR.push(0.0);
        }
      }

      difx = dif - COtros.length + 1;
      if (difx > 0) {
        for (var j = 0; j < difx; j++) {
          COtros.push(0.0);
        }
      }

      difx = dif - CMaq.length + 1;
      if (difx > 0) {
        for (var j = 0; j < difx; j++) {
          CMaq.push(0.0);
        }
      }

      proyectoOld.CTECI = CTECI;
      proyectoOld.CC = CCERT;
      proyectoOld.CD = CDIR;
      proyectoOld.CO = COtros;
      proyectoOld.CM = CMaq;

      Logger.debug(proyectoOld.CTECI.length);
      Logger.debug("0s Added");
      //FIN CALCULO COSTE
    } catch (e) {
      throw e;
    }
  };
}
