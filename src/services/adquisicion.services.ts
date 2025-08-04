import Adquisicion from "../models/adquisicion.model";
import { IAdquisicion } from "../interfaces/IAdquisicion";
import EmpresaSubcontrata from "../models/empresaSubcontrata.model";
import Pedido from "../models/pedido.model";
import Tarea from "../models/tarea.model";
import { IUsuarioDTO } from "../interfaces/IUsuario";
import Logger from "../loaders/logger";
import { ITarea } from "../interfaces/ITarea";
import mongoose from "mongoose";
import { Response } from "express";
import xl from "excel4node";
import TareaService from "./tarea.services";

export default class AdquisicionService {
  constructor() {}

  public create = async (
    adquisicion,
    user: IUsuarioDTO
  ): Promise<IAdquisicion> => {
    try {
      var err,
        adquisicionNew = await new Adquisicion({
          ...adquisicion,
          updated_for: user._id,
        }).save();
      if (err) throw err;

      return adquisicionNew;
    } catch (e) {
      throw e;
    }
  };
  public edit = async (
    adquisicion: IAdquisicion,
    user: IUsuarioDTO
  ): Promise<IAdquisicion> => {
    try {
      var err,
        newAdquisicion = await Adquisicion.findOneAndUpdate(
          { _id: adquisicion._id },
          { ...adquisicion, updated_for: user._id }
        );
      if (err) throw err;
      return newAdquisicion;
    } catch (e) {
      throw e;
    }
  };
  public delete = async (adquisicionId: String): Promise<Boolean> => {
    try {
      var err,
        res = await Adquisicion.findByIdAndDelete(adquisicionId);
      if (err) throw err;
      return true;
    } catch (e) {
      throw e;
    }
  };
  public deleteMany = async (adquisicionsId: [string]): Promise<void> => {
    try {
      var err,
        res = await Adquisicion.deleteMany({ _id: { $in: adquisicionsId } });
      if (err) throw err;
    } catch (e) {
      throw e;
    }
  };
  public findAll = async (): Promise<IAdquisicion[]> => {
    try {
      var err,
        res = await Adquisicion.find({});
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public findByProyecto = async (
    idProyecto: string,
    search?: string
  ): Promise<IAdquisicion[]> => {
    try {
      let query = { proyecto: idProyecto };
      if (search) {
        query = {
          ...query,
          ...{
            $or: [
              { nombre: { $regex: search, $options: "i" } },
              { idAdquisicion: { $regex: search, $options: "i" } },
            ],
          },
        };
      }
      var err,
        res = await Adquisicion.find(query).populate("tareas.tarea").lean();
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public findByProyectoNombre = async (
    idProyecto: string
  ): Promise<[string]> => {
    try {
      var err,
        res = await Adquisicion.find({ proyecto: idProyecto }).distinct(
          "nombre"
        );
      if (err) throw err;
      return res as [string];
    } catch (e) {
      throw e;
    }
  };
  public findByProyectoNombreEmpresa = async (
    idProyecto: string,
    idEmpresa: string,
    nombre: string
  ): Promise<IAdquisicion> => {
    try {
      var err,
        res = await Adquisicion.findOne({
          proyecto: idProyecto,
          empresaSubcontrata: idEmpresa,
          nombre: nombre,
        });
      if (err) throw err;
      if (!res) {
        var err,
          res = await Adquisicion.findOne({
            proyecto: idProyecto,
            nombre: nombre,
          });
        if (err) throw err;
      }
      return res;
    } catch (e) {
      throw e;
    }
  };
  public findAllByNombre = async (
    idProyecto: string,
    nombre: string
  ): Promise<IAdquisicion[]> => {
    try {
      var err,
        res = await Adquisicion.find({ proyecto: idProyecto, nombre: nombre })
          .populate("empresaSubcontrata")
          .lean();
      if (err) throw err;

      return res;
    } catch (e) {
      throw e;
    }
  };
  public findByEmpresaSub = async (
    idEmpresa: string
  ): Promise<IAdquisicion[]> => {
    try {
      var err,
        res = await Adquisicion.find({ empresaSubcontrata: idEmpresa }).lean();
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public findById = async (id: string): Promise<IAdquisicion> => {
    try {
      var err,
        res = await Adquisicion.findById(id);
      if (err) throw err;
      return res;
    } catch (e) {
      throw e;
    }
  };
  public findTareasByWord = async (
    word: string,
    idProyecto: string
  ): Promise<IAdquisicion[]> => {
    try {
      let err,
        tareasAdquisiciones = await Adquisicion.find(
          { nombre: { $regex: word, $options: "i" }, proyecto: idProyecto },
          "tareas"
        )
          .populate("tareas")
          .lean();
      if (err) throw err;
      return tareasAdquisiciones;
    } catch (e) {
      throw e;
    }
  };
  private addHijosFactor(
    childrens: [ITarea],
    factor: number,
    array: { tarea: string; factor: number }[]
  ): void {
    for (let i = 0; i < childrens.length; i++) {
      const child = childrens[i];
      array.push({ tarea: child._id, factor: factor });
      if (child && child.childrens.length > 0)
        this.addHijosFactor(child.childrens as [ITarea], factor, array);
    }
  }
  private calculaTareas(
    tareas: [ITarea],
    tareasFactor: { idQrisys: string; factor: number }[]
  ): { tarea: string; factor: number }[] {
    const res: { tarea: string; factor: number }[] = [];
    for (let i = 0; i < tareas.length; i++) {
      const tarea = tareas[i];
      const find = tareasFactor.find(
        (x) => x.idQrisys + "" === tarea.idQrisys + ""
      );
      if (tarea && find) {
        res.push({ tarea: tarea._id, factor: find.factor });
        if (tarea.childrens && tarea.childrens.length > 0)
          this.addHijosFactor(tarea.childrens as [ITarea], find.factor, res);
      }
    }
    return res;
  }
  public generarComparativo = async (
    comparativos: {
      recurso: string;
      unidad: string;
      costeEmpresa: {
        coste: number;
        nombreEmpresa: string;
        medicion: number;
      }[];
    }[],
    res: Response
  ): Promise<void> => {
    try {
      const wb = new xl.Workbook();
      const ws = wb.addWorksheet("Comparativo");

      const totalStyle = wb.createStyle({
        fill: {
          type: "pattern",
          patternType: "solid",
          bgColor: "#ffcccc",
          fgColor: "#ffcccc",
        },
        alignment: {
          wrapText: true,
          horizontal: "center",
        },
      });

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
      ws.cell(1, 1, 2, 1, true);
      ws.cell(1, 1).string("NOMBRE RECURSO").style(headerStyle);
      ws.column(1).setWidth(50);

      let indexRecursos = 3;
      let indexEmpresa = 2;
      let dataEmpresas: {
        [nombre: string]: { index: number; total: number };
      } = {};

      for (let i = 0; i < comparativos.length; i++) {
        const comp = comparativos[i];

        ws.cell(indexRecursos, 1).string(comp.recurso).style(regularStyle);

        for (let j = 0; j < comp.costeEmpresa.length; j++) {
          const costeEmpresa = comp.costeEmpresa[j];
          let colEmpresa = null; //La columna donde se va a mostrar el nombre de la empresa.
          if (
            dataEmpresas[costeEmpresa.nombreEmpresa] &&
            dataEmpresas[costeEmpresa.nombreEmpresa].index
          ) {
            colEmpresa = dataEmpresas[costeEmpresa.nombreEmpresa].index;
          } else {
            colEmpresa = indexEmpresa;
            dataEmpresas[costeEmpresa.nombreEmpresa] = {
              index: indexEmpresa,
              total: 0,
            };
            ws.cell(1, indexEmpresa, 1, indexEmpresa + 2, true);
            ws.cell(1, indexEmpresa)
              .string(costeEmpresa.nombreEmpresa)
              .style(headerStyle);
            ws.cell(2, indexEmpresa).string("PRECIO").style(headerStyle);
            ws.cell(2, indexEmpresa + 1)
              .string("CANTIDAD")
              .style(headerStyle);
            ws.cell(2, indexEmpresa + 2)
              .string("UNIDADES")
              .style(headerStyle);
            indexEmpresa = indexEmpresa + 3;
          }
          let costeRecurso = costeEmpresa.coste ? costeEmpresa.coste : 0;
          let medicionRecurso = costeEmpresa.medicion
            ? costeEmpresa.medicion
            : 1;
          let totalRecurso = costeRecurso * medicionRecurso;
          totalRecurso = isNaN(totalRecurso) ? 0 : totalRecurso;
          dataEmpresas[costeEmpresa.nombreEmpresa].total =
            dataEmpresas[costeEmpresa.nombreEmpresa].total + totalRecurso;
          ws.cell(indexRecursos, colEmpresa)
            .number(costeRecurso)
            .style(regularStyle);
          ws.cell(indexRecursos, colEmpresa + 1)
            .number(medicionRecurso)
            .style(regularStyle);
          ws.cell(indexRecursos, colEmpresa + 2)
            .string(comp.unidad ? comp.unidad : "")
            .style(regularStyle);
        }
        indexRecursos++;
      }

      ws.cell(indexRecursos, 1).string("TOTAL").style(totalStyle);
      for (let i = 0; i < Object.keys(dataEmpresas).length; i++) {
        const nombEmpresa = Object.keys(dataEmpresas)[i];
        const colocacionEmpresa = dataEmpresas[nombEmpresa].index;
        const totalEmpresa = dataEmpresas[nombEmpresa].total;

        ws.cell(indexRecursos, colocacionEmpresa).style(totalStyle);
        ws.cell(indexRecursos, colocacionEmpresa + 1).style(totalStyle);
        ws.cell(indexRecursos, colocacionEmpresa + 2).style(totalStyle);
        ws.cell(indexRecursos, colocacionEmpresa).number(totalEmpresa);
      }

      wb.write("comparativo.xlsx", res);
    } catch (e) {
      throw e;
    }
  };
  public import = async (
    adquisiciones: unknown[],
    idProyecto: string,
    user: IUsuarioDTO
  ): Promise<void> => {
    try {
      let startTime = new Date();
      Logger.debug("Importando " + adquisiciones.length + " adquisiciones ");
      var err,
        tareas = await Tarea.find({ proyecto: idProyecto });
      if (err) throw err;
      const idsTodas = tareas.map((tar) => {
        return tar._id;
      });
      const empresasNombres: [
        { _id: string; nombre: string }
      ] = new Array() as [{ _id: string; nombre: string }];
      for (let i = 0; i < adquisiciones.length; i++) {
        const ad = adquisiciones[i];
        const ligadas = ad["LIGADA TAREA/CAPITULO"]
          ? ad["LIGADA TAREA/CAPITULO"].split(";")
          : null;
        let idTareasFinal = [];

        if (ligadas) {
          const tareasFactor: { idQrisys: string; factor: number }[] = []; //{ idQrisys: string, factor: number }
          const idTareas = [];
          for (let i = 0; i < ligadas.length; i++) {
            let ligada = ligadas[i];
            let str = ligada.split("-");
            let id = str[0];
            let factor = Number(str[1]);
            tareasFactor.push({ idQrisys: id, factor: factor });
            idTareas.push(id);
          }
          var err,
            tareasRes = await Tarea.find({
              idQrisys: { $in: idTareas },
              proyecto: idProyecto,
            });
          if (err) throw err;
          idTareasFinal = this.calculaTareas(
            (tareasRes as unknown) as [ITarea],
            tareasFactor
          );
        }
        /*
                if (idTareasFinal.length === 0) {
                    idTareasFinal = idsTodas;
                }*/

        var fechaRecepcion = null;
        if (ad["FECHA RECEPCION"] && ad["FECHA RECEPCION"].length > 0) {
          var str = ad["FECHA RECEPCION"];
          var fechaRecepcionParts = str.replace(/_/g, "").split("/");
          fechaRecepcion = new Date(
            +fechaRecepcionParts[2],
            fechaRecepcionParts[1] - 1,
            +fechaRecepcionParts[0]
          );
        }
        const tipo1 = ad["TIPO 1"] === "SI";
        let adquis = {
          nombre: ad["NOMBRE ADQUISICION"],
          tipo: ad["TIPO 2"],
          unidad: ad["UNIDADES"],
          precio: ad["PRECIO UNIDAD"],
          idAdquisicion: ad["ID ADQUISICION "],
          proyecto: idProyecto,
          tareas: idTareasFinal,
          updated_for: user._id,
        };
        const tareaService: TareaService = new TareaService();
        Logger.debug("Tareas a actualizar recursos: " + idTareasFinal);
        if (idTareasFinal) {
          Logger.debug("tareas update time");
          for (let k = 0; k < idTareasFinal.length; k++) {
            var err,
              tarea = await tareaService.findById(idTareasFinal[k].tarea);
            if (err) throw err;
            var err,
              resTarea = await tareaService.addRecursoAsociado(
                tarea,
                adquis.nombre,
                Number(idTareasFinal[k].factor),
                adquis.precio,
                null
              );
            if (err) throw err;
          }
        }
        let empresaSub = {
          nombre: ad["SUBCONTRATA"],
          nombreContacto: ad["NOMBRE CONTACTO"],
          email: ad["EMAIL"],
          proyecto: idProyecto,
          telefono: ad["TELEFONO"],
          cif: ad["CIF"],
          updated_for: user._id,
        };
        const find = empresasNombres.find(
          (x) => x.nombre === empresaSub.nombre
        );
        let idEmpresa = null;
        if (find) {
          idEmpresa = find._id;
        } else {
          var err,
            empresaRes = await EmpresaSubcontrata.findOneAndUpdate(
              { nombre: empresaSub.nombre, proyecto: idProyecto },
              {
                $set: { empresaSub },
              }
            );
          if (err) throw err;
          if (!empresaRes) {
            var err,
              empresaRes = await new EmpresaSubcontrata({
                ...empresaSub,
              }).save();
            if (err) throw err;
          }
          empresasNombres.push({
            _id: empresaRes._id,
            nombre: empresaRes.nombre,
          });
          idEmpresa = empresaRes._id;
        }

        var err,
          res = await Adquisicion.findOneAndUpdate(
            { nombre: adquis.nombre, empresaSubcontrata: idEmpresa },
            (adquis as unknown) as [{ tarea: String | ITarea; factor: Number }]
          );
        if (err) throw err;
        if (!res) {
          var err,
            res = await new Adquisicion({
              ...adquis,
              empresaSubcontrata: idEmpresa,
            }).save();
          if (err) throw err;
        }
        if (tipo1) {
          let pedido = {
            precio: ad["PRECIO UNIDAD"],
            fechaRecepcion: fechaRecepcion,
            proyecto: idProyecto,
            cantidad: ad["CANTIDAD"],
            ejecutado: false,
            updated_for: user._id,
          };
          var err,
            pedidoRes = await new Pedido({
              ...pedido,
              empresaSubcontrata: empresaRes._id,
              adquisicion: res._id,
            }).save();
          if (err) throw err;
        }
      }
      let endTime = new Date();
      var timeDiff = +endTime - +startTime; //in ms
      // strip the ms
      timeDiff /= 1000;
      // get seconds
      var seconds = Math.round(timeDiff);
      Logger.debug("Adquisiciones time: " + seconds + " seconds");
    } catch (e) {
      throw e;
    }
  };

  public asociarTarea = async (
    nombreAdquisicion: string,
    idTarea: string
  ): Promise<void> => {
    try {
      if (!nombreAdquisicion) throw Error("No se ha indicado una adquisicion");
      if (!idTarea) throw Error("No se ha indicado una tarea");
      var err,
        tarea = await Tarea.findById(idTarea);
      if (err) throw err;
      if (tarea) {
        var err,
          adquisiciones = await Adquisicion.updateMany(
            { nombre: nombreAdquisicion, proyecto: tarea.proyecto },
            { $addToSet: { tareas: { tarea: idTarea, factor: 1 } } }
          );

        if (err) throw err;
        return adquisiciones;
      } else {
        throw Error("Error al asociar tarea");
      }
    } catch (e) {
      throw e;
    }
  };

  public setPrecio = async (
    idAdquisicion: string,
    precio: number,
    user: IUsuarioDTO
  ) => {
    try {
      var err,
        newAdquisicion = await Adquisicion.findOneAndUpdate(
          { _id: idAdquisicion },
          { precio: precio, updated_for: user._id }
        );
      if (err) throw err;
      return newAdquisicion;
    } catch (e) {
      throw e;
    }
  };

  public setUnidad = async (
    idAdquisicion: string,
    unidad: string,
    user: IUsuarioDTO
  ) => {
    try {
      var err,
        newAdquisicion = await Adquisicion.findOneAndUpdate(
          { _id: idAdquisicion },
          { unidad: unidad, updated_for: user._id }
        );
      if (err) throw err;
      return newAdquisicion;
    } catch (e) {
      throw e;
    }
  };

  public findByTarea = async (idTarea: string): Promise<IAdquisicion[]> => {
    try {
      let err,
        adquisiciones = Adquisicion.aggregate([
          { $match: { "tareas.tarea": new mongoose.Types.ObjectId(idTarea) } },
          {
            $group: {
              _id: "$empresaSubcontrata",
              adquisiciones: {
                $push: { adquisicion: "$_id", nombre: "$nombre" },
              },
            },
          },
          {
            $lookup: {
              from: "empresasubcontratas",
              localField: "_id",
              foreignField: "_id",
              as: "empresa",
            },
          },
        ]);
      if (err) throw err;
      return adquisiciones;
    } catch (e) {
      throw e;
    }
  };
  public findMaquinasByProyecto = async (idProyecto: string): Promise<any> => {
    try {
      let err,
        maquinas = await Pedido.aggregate([
          {
            $match: {
              proyecto: new mongoose.Types.ObjectId(idProyecto),
              estado: "ENTREGADO",
            },
          },
          { $unwind: "$adquisiciones" },
          { $match: { "adquisiciones.tipo": "MAQUINA" } },
          {
            $project: {
              estadosMaquinas: "$adquisiciones.estadosMaquinas",
              nombre: "$adquisiciones.nombre",
              cantidad: "$adquisiciones.cantidad",
              reportes: "$adquisiciones.reportes",
              pedido: "$_id",
              _id: "$adquisiciones._id",
            },
          },
          { $sort: { nombre: 1 } },
        ]).exec();
      if (err) throw err;
      return maquinas;
    } catch (e) {
      throw e;
    }
  };
  public findMaterialesByProyecto = async (
    idProyecto: string
  ): Promise<any> => {
    try {
      let err,
        materiales = await Pedido.aggregate([
          {
            $match: {
              proyecto: new mongoose.Types.ObjectId(idProyecto),
              estado: "ENTREGADO",
            },
          },
          { $unwind: "$adquisiciones" },
          { $match: { "adquisiciones.tipo": "MATERIAL" } },
          {
            $project: {
              estadoMaterial: "$adquisiciones.estadoMaterial",
              nombre: "$adquisiciones.nombre",
              cantidad: "$adquisiciones.cantidad",
              precio: "$adquisiciones.precio",
              pedido: "$_id",
              _id: "$adquisiciones._id",
            },
          },
          { $sort: { nombre: 1 } },
        ]).exec();
      if (err) throw err;
      return materiales;
    } catch (e) {
      throw e;
    }
  };
}
