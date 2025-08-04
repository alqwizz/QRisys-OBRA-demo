import Pedido from "../models/pedido.model";
import { IPedido } from "../interfaces/IPedido";
import { IUsuarioDTO } from "../interfaces/IUsuario";
import Adquisicion from "../models/adquisicion.model";
import EmpresaSubcontrata from "../models/empresaSubcontrata.model";
import config from "../config";
import fs from "fs";
import mkdirp from "mkdirp";
import xl from "excel4node";
import util from "util";
import QRCode from "qrcode";
import { Response } from "express";
import { IEmpresaSubcontrata } from "../interfaces/IEmpresaSubcontrata";
import { IAdquisicion } from "../interfaces/IAdquisicion";
import archiver from "archiver";
import ProyectoService from "./proyecto.services";
import TareaService from "./tarea.services";
import AdquisicionService from "./adquisicion.services";

export default class PedidoService {
  constructor() {}

  public create = async (pedido, user: IUsuarioDTO): Promise<IPedido> => {
    try {
      var err,
        pedidoNew = await new Pedido({
          ...pedido,
          updated_for: user._id,
        }).save();
      if (err) throw err;
      var err,
        empresa = await EmpresaSubcontrata.findById(
          pedidoNew.empresaSubcontrata
        );
      if (err) throw err;
      if (!empresa) throw Error("No se ha encontrado ninguna empresa.");

      let costesOtrosPedido = 0.0;

      for (let i = 0; i < pedidoNew.adquisiciones.length; i++) {
        const recurso = pedidoNew.adquisiciones[i];
        var err,
          adquisicion = await Adquisicion.findOne({
            nombre: recurso.nombre,
            empresaSubcontrata: empresa._id,
          });
        if (err) throw err;
        if (!adquisicion) {
          var err,
            newAdquisicion = await new Adquisicion({
              nombre: recurso.nombre,
              tipo: recurso.tipo,
              precio: recurso.precio,
              unidad: recurso.unidad,
              proyecto: pedidoNew.proyecto,
              empresaSubcontrata: empresa._id,
              updated_for: user._id,
            }).save();
          if (err) throw err;
        }
        if (recurso.tipo === "OTROS")
          costesOtrosPedido += 1.0 * recurso.precio * recurso.cantidad;
      }

      /*Actualización de COtros*/
      if (costesOtrosPedido > 0) {
        const proyectoService: ProyectoService = new ProyectoService();
        var err,
          proyectoActualizado = await proyectoService.updateCO(
            pedido.proyecto,
            costesOtrosPedido,
            null
          );
        if (err) throw err;
        if (!proyectoActualizado)
          throw Error("No se ha podido actualizar el proyecto.");
      }
      /*---------------------------*/
      return pedidoNew;
    } catch (e) {
      throw e;
    }
  };
  public edit = async (
    pedido: IPedido,
    user: IUsuarioDTO
  ): Promise<IPedido> => {
    try {
      let err,
        res = Pedido.findByIdAndUpdate(pedido._id, {
          ...pedido,
          updated_for: user._id,
        });
      if (err) throw err;

      return res;
    } catch (e) {
      throw e;
    }
  };
  public delete = async (pedidoId: String): Promise<Boolean> => {
    try {
      var err,
        res = await Pedido.findByIdAndDelete(pedidoId);
      if (err) throw err;
      return true;
    } catch (e) {
      throw e;
    }
  };
  public deleteMany = async (pedidosId: [string]): Promise<void> => {
    try {
      var err,
        res = await Pedido.deleteMany({ _id: { $in: pedidosId } });
      if (err) throw err;
    } catch (e) {
      throw e;
    }
  };
  public findAll = async (): Promise<[IPedido]> => {
    try {
      var err,
        res = await Pedido.find({});
      if (err) throw err;
      return (res as unknown) as [IPedido];
    } catch (e) {
      throw e;
    }
  };
  public findByTarea = async (idTarea: string): Promise<IPedido[]> => {
    try {
      var err,
        adquisiciones = await Adquisicion.find({ "tareas.tarea": idTarea });
      if (err) throw err;
      const adquisicionesIds = adquisiciones.map((x) => x._id);
      var err,
        res = await Pedido.find({ "adquisiciones._id": adquisicionesIds })
          .populate("empresaSubcontrata")
          .populate("updated_for")
          .sort({ fechaPedido: -1 });
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public findById = async (id: string): Promise<IPedido> => {
    try {
      var err,
        res = await Pedido.findById(id).populate("empresaSubcontrata").lean();
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
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
  public findByProyecto = async (
    idProyecto: string,
    search?: string
  ): Promise<[IPedido]> => {
    try {
      let query = { proyecto: idProyecto };
      if (search) {
        search = this.diacriticSensitiveRegex(
          search.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        );
        let err,
          empresas = await EmpresaSubcontrata.find({
            proyecto: idProyecto,
            $or: [
              { nombre: { $regex: search, $options: "i" } },
              { nombreContacto: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
              { cif: { $regex: search, $options: "i" } },
              { telefono: { $regex: search, $options: "i" } },
            ],
          });
        if (err) throw err;
        const empresasIds = empresas.map((x) => x._id);
        query = {
          ...query,
          ...{
            $or: [
              { estado: { $regex: search, $options: "i" } },
              { empresaSubcontrata: empresasIds },
              { "adquisiciones.nombre": { $regex: search, $options: "i" } },
              { "adquisiciones.tipo": { $regex: search, $options: "i" } },
              { "adquisiciones.unidad": { $regex: search, $options: "i" } },
              {
                "adquisiciones.estadosMaquina": {
                  $regex: search,
                  $options: "i",
                },
              },
            ],
          },
        };
      }
      let err,
        res = await Pedido.find(query)
          .populate("empresaSubcontrata")
          .populate("updated_for")
          .sort({ fechaPedido: -1 });
      if (err) throw err;
      return (res as unknown) as [IPedido];
    } catch (e) {
      throw e;
    }
  };

  public aceptar = async (
    pedidoId: string,
    comentario: string
  ): Promise<IPedido> => {
    try {
      const tareaService: TareaService = new TareaService();
      const adqService: AdquisicionService = new AdquisicionService();

      var err,
        pedido = await Pedido.findById(pedidoId);
      if (err) throw err;
      if (pedido && pedido.estado === "PENDIENTE") {
        pedido.estado = "ENTREGADO";
        pedido.fechaRecepcion = new Date();
        pedido.description.recibir = comentario;
        for (let i = 0; i < pedido.adquisiciones.length; i++) {
          if (pedido.adquisiciones[i].tipo === "MAQUINA") {
            for (let j = 0; j < pedido.adquisiciones[i].cantidad; j++) {
              pedido.adquisiciones[i].estadosMaquinas.push("ENTREGADO");
            }
          } else {
            pedido.adquisiciones[i].estadoMaterial = "ENTREGADO";
          }

          var err,
            tareas = await tareaService.findByRecurso(
              pedido.adquisiciones[i].nombre,
              pedido.proyecto.toString()
            );

          for (let k = 0; k < tareas.length; k++) {
            tareaService.addRecursoAsociado(
              tareas[k],
              pedido.adquisiciones[i].nombre,
              null,
              pedido.adquisiciones[i].precio,
              pedido.adquisiciones[i].cantidad
            );
          }
        }
      } else {
        throw new Error("No se puede aceptar este pedido.");
      }
      var err,
        res = await pedido.save();
      if (err) throw err;
      //TODO

      return res;
    } catch (e) {
      throw e;
    }
  };
  public rechazar = async (
    pedidoId: string,
    comentario: string
  ): Promise<IPedido> => {
    try {
      var err,
        pedido = await Pedido.findById(pedidoId);
      if (err) throw err;
      if (pedido && pedido.estado === "PENDIENTE") {
        pedido.estado = "RECHAZADO";
        pedido.fechaRecepcion = new Date();
        pedido.description.rechazar = comentario;
      } else {
        throw new Error("No se puede rechazar este pedido.");
      }
      var err,
        res = await pedido.save();
      if (err) throw err;

      let costesOtrosPedido = 0.0;
      for (let i = 0; i < pedido.adquisiciones.length; i++) {
        const recurso = pedido.adquisiciones[i];

        if (recurso.tipo === "OTROS")
          costesOtrosPedido += recurso.precio * recurso.cantidad;
      }

      /*Actualización de COtros*/
      if (costesOtrosPedido > 0) {
        const proyectoService: ProyectoService = new ProyectoService();
        var err,
          proyectoActualizado = await proyectoService.updateCO(
            pedido.proyecto,
            costesOtrosPedido,
            pedido.fechaPedido
          );
        if (err) throw err;
        if (!proyectoActualizado)
          throw Error("No se ha podido actualizar el proyecto.");
      }

      return res;
    } catch (e) {
      throw e;
    }
  };
  public anular = async (
    pedidoId: string,
    comentario: string
  ): Promise<IPedido> => {
    try {
      var err,
        pedido = await Pedido.findById(pedidoId);
      if (err) throw err;
      if (pedido && pedido.estado === "PENDIENTE") {
        pedido.estado = "ANULADO";
        pedido.description.anular = comentario;
      } else {
        throw new Error("No se puede anular este pedido.");
      }
      var err,
        res = await pedido.save();
      if (err) throw err;

      let costesOtrosPedido = 0.0;
      for (let i = 0; i < pedido.adquisiciones.length; i++) {
        const recurso = pedido.adquisiciones[i];

        if (recurso.tipo === "OTROS")
          costesOtrosPedido += recurso.precio * recurso.cantidad;
      }

      /*Actualización de COtros*/
      if (costesOtrosPedido > 0) {
        const proyectoService: ProyectoService = new ProyectoService();
        var err,
          proyectoActualizado = await proyectoService.updateCO(
            pedido.proyecto,
            costesOtrosPedido,
            pedido.fechaPedido
          );
        if (err) throw err;
        if (!proyectoActualizado)
          throw Error("No se ha podido actualizar el proyecto.");
      }
      /*---------------------------*/

      return res;
    } catch (e) {
      throw e;
    }
  };
  public acopiar = async (
    pedidoId: string,
    geolocalizacion
  ): Promise<IPedido> => {
    try {
      var err,
        pedido = await Pedido.findById(pedidoId);
      if (err) throw err;

      if (pedido.estado === "ENTREGADO") {
        pedido.adquisiciones.forEach((adquisicion) => {
          if (adquisicion.tipo === "MATERIAL") {
            adquisicion.estadoMaterial = "ACOPIADO";
            adquisicion.reportes.push({
              estado: "ACOPIADO",
              geolocalizacion: geolocalizacion,
              files: [],
            });
          }
        });
        pedido.estado = "ACOPIADO";
      } else {
        throw new Error("No se pueden acopiar los materiales de este pedido.");
      }
      var err,
        res = await pedido.save();
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public usar = async (
    pedidoId: string,
    adquisicionId: string,
    number: number,
    geolocalizacion
  ): Promise<string> => {
    try {
      var err,
        pedido = await Pedido.findById(pedidoId);
      if (err) throw err;
      if (!pedido) throw Error("No se ha encontrado ningún pedido con esa id.");
      let index = -1;
      let adquisicion = pedido.adquisiciones.find((x, i) => {
        if (x._id + "" === adquisicionId + "") {
          index = i;
          return true;
        }
      });
      if (
        adquisicion &&
        adquisicion.tipo === "MAQUINA" &&
        (adquisicion.estadosMaquinas[number] === "ENTREGADO" ||
          adquisicion.estadosMaquinas[number] === "PROBLEMA")
      ) {
        adquisicion.estadosMaquinas[number] = "EN USO";
        pedido.markModified(
          "adquisiciones." + index + ".estadosMaquinas." + number
        );
        adquisicion.reportes.push({
          estado: "EN USO",
          geolocalizacion: geolocalizacion,
          numeroMaquina: number,
          horaInicio: new Date(),
        });
      } else {
        throw new Error("No se puede usar esta adquisicion del pedido.");
      }
      var err,
        res = await pedido.save();
      if (err) throw err;
      if (!res) throw "No se ha podido realizar la acción correctamente";
      return (
        'El recurso "' +
        adquisicion.nombre +
        '" ha sido marcado como en uso correctamente.'
      );
    } catch (e) {
      throw e;
    }
  };
  public entregarMaquina = async (
    pedidoId: string,
    adquisicionId: string,
    number: number,
    geolocalizacion
  ): Promise<string> => {
    try {
      var err,
        pedido = await Pedido.findById(pedidoId);
      if (err) throw err;
      let index = -1;
      let adquisicion = pedido.adquisiciones.find((x, i) => {
        if (x._id + "" === adquisicionId + "") {
          index = i;
          return true;
        }
      });
      if (!adquisicion) throw Error("No se ha encontrado el recurso indicado.");
      if (
        adquisicion &&
        (adquisicion.estadosMaquinas[number] === "PROBLEMA" ||
          adquisicion.estadosMaquinas[number] === "EN USO")
      ) {
        adquisicion.estadosMaquinas[number] = "ENTREGADO";

        const proyectoService: ProyectoService = new ProyectoService();
        var lastReport = adquisicion.reportes[adquisicion.reportes.length - 1];
        let NOW = new Date();
        var err,
          proyectoActualizado = await proyectoService.updateCM(
            pedido.proyecto,
            lastReport.horaInicio.getTime(),
            NOW.getTime(),
            adquisicion.precio,
            pedido.empresaSubcontrata
          );
        if (err) throw err;
        if (!proyectoActualizado)
          throw Error("No se ha podido actualizar el proyecto.");

        pedido.markModified(
          "adquisiciones." + index + ".estadosMaquinas." + number
        );
        adquisicion.reportes.push({
          estado: "ENTREGADO",
          geolocalizacion: geolocalizacion,
          numeroMaquina: number,
          horaInicio: new Date(),
        });
      } else {
        throw new Error("No se puede entregar este recurso.");
      }
      var err,
        res = await pedido.save();
      if (err) throw err;
      if (!res) throw Error("Se ha producido un error entregando el recurso");
      return (
        'El recurso "' +
        adquisicion.nombre +
        '" ha sido marcado como ENTREGADO.'
      );
    } catch (e) {
      throw e;
    }
  };
  public reportarProblemaMaquina = async (
    pedidoId: string,
    adquisicionId: string,
    geolocalizacion,
    number: number,
    descripcion: string
  ): Promise<string> => {
    try {
      var err,
        pedido = await Pedido.findById(pedidoId);
      if (err) throw err;
      let index = -1;
      let adquisicion = pedido.adquisiciones.find((x, i) => {
        if (x._id + "" === adquisicionId + "") {
          index = i;
          return true;
        }
      });
      if (!adquisicion) throw Error("No se ha encontrado el recurso indicado.");
      if (
        adquisicion &&
        adquisicion.tipo === "MAQUINA" &&
        adquisicion.estadosMaquinas[number] === "EN USO"
      ) {
        adquisicion.estadosMaquinas[number] = "PROBLEMA";
        pedido.markModified(
          "adquisiciones." + index + ".estadosMaquinas." + number
        );
        adquisicion.reportes.push({
          estado: "PROBLEMA",
          geolocalizacion: geolocalizacion,
          descripcion: descripcion,
          numeroMaquina: number,
          horaInicio: new Date(),
        });
      } else {
        throw new Error("No se puede reportar un problema en este recurso.");
      }
      var err,
        res = await pedido.save();
      if (err) throw err;
      if (!res) throw Error("Se ha producido un error reportando el recurso");
      return (
        'Se ha reportado un problema en el recurso "' +
        adquisicion.nombre +
        '".'
      );
    } catch (e) {
      throw e;
    }
  };
  public problemaAdquisicion = async (
    pedidoId: string,
    adquisicionId: string,
    geolocalizacion
  ): Promise<IPedido> => {
    try {
      var err,
        pedido = await Pedido.findById(pedidoId);
      if (err) throw err;
      let adquisicion = pedido.adquisiciones.find(
        (x) => x.adquisicion.id === adquisicionId
      );

      if (
        adquisicion &&
        (adquisicion.estado === "ACOPIADO" || adquisicion.estado === "EN USO")
      ) {
        adquisicion.estado = "ENTREGADO";
        adquisicion.reportes.push({
          estado: "ENTREGADO",
          geolocalizacion: geolocalizacion,
        });
      } else {
        throw new Error("No se puede entregar esta adquisicion del pedido.");
      }
      var err,
        res = await pedido.save();
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public qrAdquisicion = async (
    idPedido: string,
    idAdquisicion: string,
    geolocalizacion
  ): Promise<string> => {
    try {
      var err,
        pedido = await Pedido.findById(idPedido);
      if (err) throw err;
      if (pedido.estado !== "ENTREGADO") {
        return "No se puede utilizar este recurso hasta que se haya confirmado la recepción del pedido.";
      }
      let res = "";
      let adquisicion = pedido.adquisiciones.find((x) => {
        return "" + x.adquisicion.id === "" + idAdquisicion;
      });
      if (!adquisicion) return "No se ha encontrado el recurso indicado.";

      if (adquisicion.adquisicion.tipo === "MATERIAL") {
        if (adquisicion.estado === "ENTREGADO") {
          adquisicion.estado = "ACOPIADO";
          res =
            "El recurso " +
            adquisicion.adquisicion.nombre +
            " ha cambiado su estado de ENTREGADO a ACOPIADO";
        } else if (adquisicion.estado === "ACOPIADO") {
          adquisicion.estado = "ENTREGADO";
          res =
            "El recurso " +
            adquisicion.adquisicion.nombre +
            " ha cambiado su estado de ACOPIADO a ENTREGADO";
        } else
          res =
            "El recurso no tiene un estado correcto. Contacte con el administrador.";
      } else if (adquisicion.adquisicion.tipo === "MAQUINA") {
        if (adquisicion.estado === "ENTREGADO") {
          res =
            "Seleccione una acción para el recurso " +
            adquisicion.adquisicion.nombre +
            ":";
        } else if (adquisicion.estado === "EN USO") {
          adquisicion.estado = "ENTREGADO";
          adquisicion.reportes.push({
            estado: "ENTREGADO",
            geolocalizacion: geolocalizacion,
          });
          res =
            "El recurso " +
            adquisicion.adquisicion.nombre +
            " ha cambiado su estado de EN USO a ENTREGADO";
        } else
          res =
            "El recurso no tiene un estado correcto. Contacte con el administrador.";
      } else return "No se puede realizar esta acción.";
      if (res !== "") {
        let err,
          ped = await pedido.save();
        if (err) throw err;
        if (!ped) throw Error("No se ha podido realizar esta acción");
        return res;
      } else return "Se ha producido un error. Concacte con el administrador.";
    } catch (e) {
      throw e;
    }
  };
  public sendPhotoProblemaAdquisicion = async (
    idPedido,
    idAdquisicion,
    file,
    filename
  ): Promise<void> => {
    try {
      var err,
        pedido = await Pedido.findById(idPedido);
      if (err) throw err;
      if (!pedido) throw Error("No se ha encontrado ningún pedido con esa id.");
      let adquisicion = pedido.adquisiciones.find(
        (x) => x._id + "" === idAdquisicion + ""
      );
      if (!adquisicion) throw Error("No se ha encontrado ningun recurso.");
      const path = config.upload_dir + "/" + pedido._id + "/" + idAdquisicion;
      mkdirp.sync(path);
      const fullpath = path + "/" + filename;
      const fstream = fs.createWriteStream(fullpath);
      file.pipe(fstream);
      await new Promise((fulfill) => fstream.on("close", fulfill));
      adquisicion.reportes[adquisicion.reportes.length - 1].files.push(
        filename
      );
      var err,
        res = await pedido.save();
      if (err) throw err;
    } catch (e) {
      throw e;
    }
  };

  public downloadFiles = async (
    idPedido: string,
    res: Response
  ): Promise<void> => {
    // @ts-ignore
    const zip = new require("node-zip")();

    const pathExcel =
      config.upload_dir + "/" + idPedido + "/" + idPedido + ".xlsx";
    if (!fs.existsSync(pathExcel)) {
      await this.generateExcel(idPedido);
    }
    let zipName =
      new Date().getFullYear().toString() +
      new Date().getMonth().toString() +
      "-" +
      idPedido +
      ".zip";
    let directoryToRead = fs.readdirSync(`${config.upload_dir}/${idPedido}`);
    for (let i = 0; i < directoryToRead.length; i++) {
      let splitted = directoryToRead[i].split(".");
      let extension = splitted[splitted.length - 1];
      if (extension === "zip") {
        fs.unlinkSync(`${config.upload_dir}/${idPedido}/${directoryToRead[i]}`);
      }
      if (extension !== "zip") {
        zip.file(
          directoryToRead[i],
          fs.readFileSync(
            `${config.upload_dir}/${idPedido}/${directoryToRead[i]}`
          )
        );
      }
    }
    let data = zip.generate({ base: 64, compression: "DEFLATE" });
    fs.writeFileSync(
      `${config.upload_dir}/${idPedido}/` + zipName,
      data,
      "binary"
    );
    let file = fs.createReadStream(
      `${config.upload_dir}/${idPedido}/` + zipName
    );
    file.on("end", function () {
      fs.unlink(`${config.upload_dir}/${idPedido}/` + zipName, function (err) {
        if (err) throw err;
      });
    });
    file.pipe(res);
  };
  public sendPhoto = async (idPedido, file, filename, user): Promise<void> => {
    try {
      var err,
        res = await Pedido.findById(idPedido);
      if (err) throw err;
      if (!res)
        throw Error(
          "No se ha encontrado ningún pedido con esta identificación."
        );
      await this.uploadPhoto(res._id, filename, file);
      res.files.solicitar.push(res._id + "/" + filename);
      res.updated_for = user._id;
      await res.save();
    } catch (e) {
      throw e;
    }
  };
  private formatDate = (date) => {
    if (date) {
      var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [day, month, year].join("/");
    }
    return "";
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
      ws.cell(1, 1).string("SUBCONTRATA").style(headerStyle);
      ws.column(1).setWidth(30);
      ws.cell(1, 2).string("Nº ALBARAN").style(headerStyle);
      ws.column(2).setWidth(50);
      ws.cell(1, 3).string("FECHA ESPERADA").style(headerStyle);
      ws.column(3).setWidth(20);
      ws.cell(1, 4).string("FECHA RECEPCION").style(headerStyle);
      ws.column(4).setWidth(20);
      ws.cell(1, 5).string("ESTADO").style(headerStyle);
      ws.cell(1, 6).string("PRECIO").style(headerStyle);
      ws.cell(1, 7).string("PRECIO + IVA").style(headerStyle);
      ws.column(7).setWidth(20);

      var pedidos = await this.findByProyecto(idProyecto);

      let index = 2;
      for (let i = 0; i < pedidos.length; i++) {
        const pedido = pedidos[i];
        const nombreEmpresa =
          pedido &&
          pedido.empresaSubcontrata &&
          (pedido.empresaSubcontrata as IEmpresaSubcontrata).nombre
            ? (pedido.empresaSubcontrata as IEmpresaSubcontrata).nombre
            : "";
        const nAlbaran = pedido._id + "";
        let fechaEsperada = "";
        if (pedido.fechaEsperada) {
          const day = pedido.fechaEsperada.getDate();
          const month = pedido.fechaEsperada.getMonth() + 1;
          const year = pedido.fechaEsperada.getFullYear();
          fechaEsperada = day + "/" + month + "/" + year;
        }
        let fechaRecepcion = "";
        if (pedido.fechaRecepcion) {
          const day1 = pedido.fechaRecepcion.getDate();
          const month1 = pedido.fechaRecepcion.getMonth() + 1;
          const year1 = pedido.fechaRecepcion.getFullYear();
          fechaRecepcion = day1 + "/" + month1 + "/" + year1;
        }
        const estado = pedido && pedido.estado ? pedido.estado : "";
        let precio = 0;
        if (pedido && pedido.adquisiciones)
          for (let j = 0; j < pedido.adquisiciones.length; j++) {
            const adq = pedido.adquisiciones[j];
            precio += adq.precio * adq.cantidad;
          }

        const precioIva = precio ? precio * 1.21 : null;
        ws.cell(index, 1).string(nombreEmpresa).style(regularStyle);
        ws.cell(index, 2).string(nAlbaran).style(regularStyle);
        ws.cell(index, 3).string(fechaEsperada).style(regularStyle);
        ws.cell(index, 4).string(fechaRecepcion).style(regularStyle);
        ws.cell(index, 5).string(estado).style(regularStyle);
        if (precio && precio !== 0 && !isNaN(precio))
          ws.cell(index, 6).number(precio).style(regularStyle);
        if (precioIva) ws.cell(index, 7).number(precioIva).style(regularStyle);

        index++;
      }

      wb.write("EXCEL TODOS LOS PEDIDOS.xlsx", res);
    } catch (e) {
      throw e;
    }
  };
  public generateExcel = async (
    idPedido: string,
    res?: Response
  ): Promise<void> => {
    try {
      let err,
        pedido = await Pedido.findById(idPedido).populate("empresaSubcontrata");
      if (err) throw err;
      if (!pedido) throw Error("El pedido no se ha podido encontrar.");

      var dir = config.upload_dir + "/" + idPedido + "/";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const wb = new xl.Workbook();
      const ws = wb.addWorksheet("Pedido");
      ws.cell(1, 1, 8, 2, true);
      ws.cell(1, 3).string("Proveedor");
      ws.cell(1, 4).string(
        (pedido.empresaSubcontrata as IEmpresaSubcontrata).nombre
      );
      ws.cell(4, 3).string("Número pedido");
      ws.cell(4, 4).string(pedido._id + "");
      ws.cell(7, 3).string("Fecha esperada");
      ws.cell(7, 4).string(this.formatDate(pedido.fechaEsperada));

      ws.cell(10, 1).string("Nombre");
      ws.cell(10, 2).string("Medición");
      ws.cell(10, 3).string("Unidad");
      ws.cell(10, 4).string("Precio unitario");
      ws.cell(10, 5).string("Total");
      ws.cell(10, 6).string("Descripción");
      let init = 10;
      let total = 0;
      for (let i = 0; i < pedido.adquisiciones.length; i++) {
        init++;
        const recurso = pedido.adquisiciones[i];
        const totalRecurso = recurso.precio * recurso.cantidad;
        total += totalRecurso;
        ws.cell(init, 1).string(recurso.nombre);
        ws.cell(init, 2).string(recurso.cantidad + "");
        ws.cell(init, 3).string(recurso.unidad);
        ws.cell(init, 4).string(recurso.precio.toFixed(2));
        ws.cell(init, 5).string(totalRecurso.toFixed(2));
        ws.cell(init, 6).string(
          pedido.description
            ? pedido.description.solicitar
              ? pedido.description.solicitar + ""
              : ""
            : ""
        );
      }
      ws.cell(init + 2, 4).string("Total");
      ws.cell(init + 2, 5).string(total.toFixed(2));
      const qrstring = config.URL + "QR/" + pedido._id;
      const path = dir + idPedido + "-QR.png";
      let errorQR = await QRCode.toFile(path, qrstring, {
        color: {
          dark: "#000000", // Black dots
          light: "#0000", // Transparent background
        },
      });
      if (errorQR) throw errorQR;
      ws.addImage({
        path: path,
        type: "picture",
        position: {
          type: "oneCellAnchor",
          from: {
            col: 1,
            colOff: 0,
            row: 1,
            rowOff: 0,
          },
        },
      });
      const pathExcel = dir + idPedido + ".xlsx";
      wb.write = util.promisify(wb.write);
      await wb.write(pathExcel);
      if (res) wb.write(pathExcel, res);
    } catch (e) {
      throw e;
    }
  };

  public solicitarPresupuesto = async (
    empresaSubcontrataId: string,
    adquisiciones: [IAdquisicion],
    res: Response
  ): Promise<void> => {
    try {
      let err,
        empresaSubcontrata = await EmpresaSubcontrata.findById(
          empresaSubcontrataId
        ).lean();
      if (err) throw err;
      if (!empresaSubcontrata)
        throw Error("No se ha podido encontrar la empresa.");

      var dir = config.upload_dir + "/temp/";

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const wb = new xl.Workbook();
      const ws = wb.addWorksheet("Presupuesto");

      ws.cell(1, 1).string("Nombre");
      ws.cell(1, 2).string("Medición");
      ws.cell(1, 3).string("Unidad");
      ws.cell(1, 4).string("Fecha esperada");
      ws.cell(1, 5).string("Descripción");
      ws.cell(1, 6).string("Precio");
      ws.cell(1, 7).string("Precio total");
      let init = 2;
      for (let i = 0; i < adquisiciones.length; i++) {
        const recurso = adquisiciones[i];

        ws.cell(init, 1).string(recurso.nombre);
        ws.cell(init, 2).string(recurso.cantidad + "");
        ws.cell(init, 3).string(recurso.unidad);
        init++;
      }
      const pathExcel = dir + "presupuesto.xlsx";
      wb.write("presupuesto.xlsx", res);
    } catch (e) {
      throw e;
    }
  };

  public sendPhotoReporte = async (
    idPedido,
    file,
    filename,
    user,
    reporte
  ): Promise<void> => {
    try {
      let err,
        res = await Pedido.findById(idPedido);
      if (err) throw err;
      if (!res)
        throw Error(
          "No se ha encontrado ningún pedido con esta identificación."
        );
      await this.uploadPhoto(res._id, filename, file);
      if (reporte === "recibir") {
        res.files.recibir.push(res._id + "/" + filename);
      }
      if (reporte === "rechazar") {
        res.files.rechazar.push(res._id + "/" + filename);
      }
      if (reporte === "anular") {
        res.files.anular.push(res._id + "/" + filename);
      }
      res.updated_for = user._id;
      res.save();
    } catch (e) {
      throw e;
    }
  };

  private async uploadPhoto(id, filename, file) {
    const path = config.upload_dir + "/" + id;
    mkdirp.sync(path);
    const fullpath = path + "/" + filename;
    const fstream = fs.createWriteStream(fullpath);
    file.pipe(fstream);
    new Promise((fulfill) => fstream.on("close", fulfill));
  }

  public async exportarData(idProyecto: string, res: Response): Promise<void> {
    try {
      let err,
        pedidos = await Pedido.find({ proyecto: idProyecto });
      if (err) throw err;
      const pedidosIds = pedidos.map((x) => x._id + "");

      let zipName =
        new Date().getFullYear().toString() +
        new Date().getMonth().toString() +
        "-" +
        idProyecto +
        ".zip";
      let pathZip = `${config.upload_dir}/${idProyecto}/` + zipName;

      let archive = archiver.create("zip", { forceZip64: true });

      if (!fs.existsSync(`${config.upload_dir}/${idProyecto}/`)) {
        fs.mkdirSync(`${config.upload_dir}/${idProyecto}/`);
      }

      archive.pipe(res);

      for (let i = 0; i < pedidosIds.length; i++) {
        const idPedido = pedidosIds[i];
        const folderPedidoPath = config.upload_dir + "/" + idPedido;
        await this.generateExcel(idPedido);
        archive.directory(folderPedidoPath, idPedido);
      }
      archive.finalize();
    } catch (e) {
      throw e;
    }
  }
}
