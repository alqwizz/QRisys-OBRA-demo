import ReporteProduccion from "../models/reporteProduccion.model";
import Tarea from "../models/tarea.model";
import TareaService from "./tarea.services";
import { IReporteProduccion } from "../interfaces/IReporteProduccion";
import config from "../config";
import fs from "fs";
import mkdirp from "mkdirp";
import { IUsuarioDTO } from "../interfaces/IUsuario";
import { Response } from "express";
import mongoose from "mongoose";
import archiver from "archiver";
import ProyectoService from "./proyecto.services";
import { object } from "../frontend/src/assets/plugins/xcharts/xcharts";
import Logger from "../loaders/logger";

export default class ReporteProduccionService {
  constructor() {}

  public create = async (
    reporteProduccion: IReporteProduccion,
    user: IUsuarioDTO
  ): Promise<IReporteProduccion> => {
    try {
      var err,
        tarea = await Tarea.findById(reporteProduccion.tarea);
      if (err) throw err;
      if (!tarea) throw Error("NO SE ENCUENTRA NINGUNA TAREA CON ESE ID");
      reporteProduccion.fechaActualizacion = new Date();
      reporteProduccion.fechaCreacion = new Date();
      if (reporteProduccion.tipo === "tajo") {
        var err,
          ultimo = await ReporteProduccion.find({
            tarea: tarea._id,
            tipo: "tajo",
          })
            .sort({ orden: -1 })
            .limit(1);
        reporteProduccion.orden = ultimo.length === 1 ? ultimo[0].orden + 1 : 0;
        let total = 0;
        let porcentaje = 0;
        if (reporteProduccion.unidad) {
          total = (tarea.medicionActual || 0) + reporteProduccion.numero;
          porcentaje =
            Number(tarea.porcentajeActual || 0) +
            (reporteProduccion.numero / +tarea.medicion) * 100;
        } else if (reporteProduccion.porcentaje) {
          porcentaje = reporteProduccion.numero + (tarea.porcentajeActual || 0);
          total =
            (+tarea.medicionActual || 0) +
            (+tarea.medicion * reporteProduccion.numero) / 100;
        }
        reporteProduccion.total = total;
        reporteProduccion.porcentajeTarea = porcentaje;
        reporteProduccion.precioTotal = 0.0;
        tarea.medicionActual = total;
        tarea.porcentajeActual = porcentaje;
      }

      var err,
        reporteProduccionNew = await new ReporteProduccion({
          ...reporteProduccion,
          usuario: user._id,
          updated_for: user._id,
        }).save();
      if (err) throw err;
      const tareaService: TareaService = new TareaService();
      if (reporteProduccion.tipo === "tajo") {
        tarea.updated_for = user._id;

        if (reporteProduccionNew.completar) {
          tarea.estado = "completado";
          await tareaService.propagarEstado(tarea, user);
        } else if (tarea.estado === "sin_iniciar") {
          tarea.estado = "iniciado";
          await tareaService.propagarEstado(tarea, user);
        }
      }
      var err,
        tar = await tarea.save();
      if (err) throw err;
      if (!tar) throw Error("No se ha podido actualizar la tarea.");

      await tareaService.saveInfoReportes(
        tar,
        tar._id,
        reporteProduccionNew.fechaCreacion,
        user._id,
        reporteProduccionNew._id
      );

      /*Actualización del CC y CD*/

      const proyectoService: ProyectoService = new ProyectoService();
      var err,
        proyectoActualizado = await proyectoService.updateCCyCD(
          tarea.proyecto,
          reporteProduccionNew.numero,
          tarea,
          reporteProduccionNew._id,
          null,
          null,
          null
        );
      if (err) throw err;
      if (!proyectoActualizado)
        throw Error("No se ha podido actualizar el proyecto.");

      return reporteProduccionNew;
    } catch (e) {
      throw e;
    }
  };

  public edit = async (
    reporteProduccion: IReporteProduccion,
    user: IUsuarioDTO
  ): Promise<IReporteProduccion> => {
    try {
      Logger.debug("Iniciando edición de reporte");
      var err,
        reporteProduccionOld = await ReporteProduccion.findById(
          reporteProduccion._id
        );

      if (err) throw err;
      var err,
        tarea = await Tarea.findById(reporteProduccion.tarea);
      if (err) throw err;
      if (!reporteProduccionOld)
        throw new Error("No se puede editar un reporte que no existe");
      //CASO 0: EDITAMOS EL REPORTE Y AHORA INDICAMOS UN CAMBIO POR UNIDAD O POR PORCENTAJE, LO CONTRARIO A LO QUE ESTUVIESE
      if (
        reporteProduccion.numero !== reporteProduccionOld.numero ||
        (reporteProduccion.unidad !== reporteProduccionOld.unidad &&
          reporteProduccion.porcentaje !== reporteProduccionOld.porcentaje)
      ) {
        //VOLVEMOS A CALCULAR LAS UNIDADES QUE SE HAN EJECUTADO TRAS LA EDICION, Y APLICAMOS LOS CAMBIOS A LOS SIGUIENTES REPORTES.
        let totalAnterior = 0;
        if (reporteProduccion.orden > 0) {
          var err,
            reporteAnterior = await ReporteProduccion.findOne({
              tarea: reporteProduccion.tarea,
              orden: reporteProduccion.orden - 1,
            });
          totalAnterior = reporteAnterior.total;
        }
        let ejecutado = 0;
        if (reporteProduccion.porcentaje) {
          ejecutado = (tarea.medicion * reporteProduccion.numero) / 100;
        } else if (reporteProduccion.unidad) {
          ejecutado = reporteProduccion.numero;
        }
        const ejecutadoTotalActual = totalAnterior + ejecutado;
        if (ejecutadoTotalActual !== reporteProduccion.total) {
          //SI CAMBIA EL TOTAL EJECUTADO EN ESE REPORTE, HAY QUE CAMBIAR LOS TOTALES DE LOS REPORTES QUE SE HICIERON POSTERIORMENTE, SI EXISTEN
          const diferencia = ejecutadoTotalActual - reporteProduccion.total;
          const diferenciaPorcentaje = (
            (diferencia * 100) /
            tarea.medicion
          ).toFixed(2);
          reporteProduccion.total = ejecutadoTotalActual;
          reporteProduccion.porcentajeTarea += +diferenciaPorcentaje;
          var err,
            posteriores = await ReporteProduccion.update(
              {
                tarea: reporteProduccion.tarea,
                orden: { $gt: reporteProduccion.orden },
              },
              {
                $set: { fechaActualizacion: new Date(), updated_for: user._id },
                $inc: {
                  total: diferencia,
                  porcentajeTarea: Number(diferenciaPorcentaje),
                },
              }
            );
          if (err) throw err;
          tarea.medicionActual = tarea.medicionActual + diferencia;
          tarea.updated_for = user._id;
          tarea.porcentajeActual =
            (tarea.medicionActual / tarea.medicion) * 100;
          var err,
            tarea = await tarea.save();
          if (err) throw err;
        }
        Logger.debug("Actualizando CD y CC");

        const proyectoService: ProyectoService = new ProyectoService();

        var err,
          proyectoActualizado = await proyectoService.updateCCyCD(
            tarea.proyecto,
            reporteProduccion.numero,
            tarea,
            reporteProduccionOld._id,
            reporteProduccion.fechaCreacion,
            reporteProduccionOld.numero,
            reporteProduccionOld.precioTotal
          );
        if (err) throw err;
        if (!proyectoActualizado)
          throw Error("No se ha podido actualizar el proyecto.");
      }
      var err,
        newReporteProduccion = await ReporteProduccion.findByIdAndUpdate(
          reporteProduccion._id,
          {
            numero: reporteProduccion.numero,
            total: reporteProduccion.total,
            unidad: reporteProduccion.unidad,
            porcentaje: reporteProduccion.porcentaje,
            updated_for: user._id,
            descripcion: reporteProduccion.descripcion,
            fechaActualizacion: reporteProduccion.fechaActualizacion,
            files: reporteProduccion.files,
            porcentajeTarea: reporteProduccion.porcentajeTarea,
          }
        );
      if (err) throw err;

      return newReporteProduccion;
    } catch (e) {
      throw e;
    }
  };
  public addPrecioTotal = async (
    id: string | IReporteProduccion,
    precioTotalNew: number
  ): Promise<IReporteProduccion> => {
    try {
      /*
      var err,
        reporteProduccionOld = await ReporteProduccion.findById(id);*/
      var err,
        newReporte = await ReporteProduccion.findByIdAndUpdate(id, {
          precioTotal: precioTotalNew,
        });
      if (err) throw err;
      Logger.debug(
        "Actualizando el precio total del reporte, el valor nuevo debe ser: " +
          precioTotalNew +
          " y es: " +
          newReporte.precioTotal
      );

      return newReporte;
    } catch (e) {
      throw e;
    }
  };

  public delete = async (reporteProduccionId: String): Promise<Boolean> => {
    try {
      var err,
        res = await ReporteProduccion.findByIdAndDelete(reporteProduccionId);
      if (err) throw err;
      return true;
    } catch (e) {
      throw e;
    }
  };

  public findById = async (id: string): Promise<IReporteProduccion> => {
    try {
      var err,
        res = await ReporteProduccion.findById(id);
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };

  public findByTarea = async (
    idTarea: string
  ): Promise<[IReporteProduccion]> => {
    try {
      var err,
        res = await ReporteProduccion.find({ tarea: idTarea })
          .populate("usuario")
          .sort({ fechaCreacion: -1 });
      if (err) throw err;
      return (res as unknown) as [IReporteProduccion];
    } catch (e) {
      throw e;
    }
  };

  public findLast3ByTarea = async (
    idTarea: string
  ): Promise<[IReporteProduccion]> => {
    try {
      var err,
        res = await ReporteProduccion.find({ tarea: idTarea })
          .populate("usuario")
          .sort({ fechaActualizacion: -1 })
          .limit(3);
      if (err) throw err;
      return (res as unknown) as [IReporteProduccion];
    } catch (e) {
      throw e;
    }
  };

  public sendPhoto = async (
    idReporteProduccion,
    file,
    filename,
    user
  ): Promise<void> => {
    try {
      var err,
        res = await ReporteProduccion.findById(idReporteProduccion);
      if (err) throw err;
      const path = config.upload_dir + "/" + res._id;
      mkdirp.sync(path);
      const fullpath = path + "/" + filename;
      const fstream = fs.createWriteStream(fullpath);
      file.pipe(fstream);
      await new Promise((fulfill) => fstream.on("close", fulfill));
      res.files.push(res._id + "/" + filename);
      res.save();
    } catch (e) {
      throw e;
    }
  };

  public downloadFiles = async (
    idReporteProduccion,
    res: Response
  ): Promise<void> => {
    // @ts-ignore
    const zip = new require("node-zip")();

    let zipName =
      new Date().getFullYear().toString() +
      new Date().getMonth().toString() +
      "-" +
      idReporteProduccion +
      ".zip";
    let directoryToRead = fs.readdirSync(
      `${config.upload_dir}/${idReporteProduccion}`
    );

    for (let i = 0; i < directoryToRead.length; i++) {
      let splitted = directoryToRead[i].split(".");
      let extension = splitted[splitted.length - 1];
      if (extension !== "zip") {
        zip.file(
          directoryToRead[i],
          fs.readFileSync(
            `${config.upload_dir}/${idReporteProduccion}/${directoryToRead[i]}`
          )
        );
      }
    }
    let data = zip.generate({ base: 64, compression: "DEFLATE" });
    fs.writeFileSync(
      `${config.upload_dir}/${idReporteProduccion}/` + zipName,
      data,
      "binary"
    );
    let file = fs.createReadStream(
      `${config.upload_dir}/${idReporteProduccion}/` + zipName
    );
    file.on("end", function () {
      fs.unlink(
        `${config.upload_dir}/${idReporteProduccion}/` + zipName,
        function (err) {
          if (err) throw err;
        }
      );
    });
    file.pipe(res);
  };

  public findLastByTareaBetweenDates = async (
    idTarea: string,
    fechaInicio: Date,
    fechaFin: Date
  ) => {
    try {
      var err,
        res = await ReporteProduccion.find({
          tarea: idTarea,
          tipo: "tajo",
          fechaCreacion: {
            $gte: new Date(fechaInicio),
            $lte: new Date(fechaFin),
          },
        })
          .sort({ fechaCreacion: -1 })
          .lean();
      if (err) throw err;
      return (res[0] as unknown) as IReporteProduccion;
    } catch (e) {
      throw e;
    }
  };
  public exportarArchivosProyecto = async (
    idProyecto: string,
    res: Response
  ) => {
    try {
      var err,
        reportes = await Tarea.aggregate([
          { $match: { proyecto: new mongoose.Types.ObjectId(idProyecto) } },
          {
            $lookup: {
              from: "reporteproduccions",
              localField: "_id",
              foreignField: "tarea",
              as: "reportes",
            },
          },
          { $unwind: "$reportes" },
          {
            $project: {
              _id: "$reportes._id",
              fechaCreacion: "$reportes.fechaCreacion",
              files: "$reportes.files",
              completar: "$reportes.completar",
              numero: "$reportes.numero",
              descripcion: "$reportes.descripcion",
              unidad: "$reportes.unidad",
              porcentaje: "$reportes.porcentaje",
              tarea: "$nombre",
              tipo: "$reportes.tipo",
              fechaActualizacion: "$reportes.fechaActualizacion",
              orden: "$reportes.orden",
              total: "$total",
              porcentajeTarea: "$reportes.porcentajeTarea",
              usuario: "$reportes.usuario",
              updated_for: "$reportes.updated_for",
            },
          },
        ]).exec();
      if (err) throw err;

      let zipName = "FOTOSPRODUCCION.zip";
      let pathZip = `${config.upload_dir}/${idProyecto}/` + zipName;

      let archive = archiver.create("zip", { forceZip64: true });

      if (!fs.existsSync(`${config.upload_dir}/${idProyecto}/`)) {
        fs.mkdirSync(`${config.upload_dir}/${idProyecto}/`);
      }

      archive.pipe(res);

      for (let i = 0; i < reportes.length; i++) {
        const reporte = reportes[i];
        const folderReportePath = config.upload_dir + "/" + reporte._id;
        if (reporte.files && reporte.files.length > 0) {
        }
        archive.directory(folderReportePath, reporte.tarea);
      }
      archive.finalize();
    } catch (e) {
      throw e;
    }
  };
}
