import TareaController from "../../controllers/tarea.controllers";
import { Router } from "express";
import middlewares from "../middlewares";
import { celebrate, Joi } from "celebrate";
const route = Router();

export default (app: Router) => {
  const tareaController = new TareaController();
  app.use("/tareas", route);
  route.get(
    "/history/",
    middlewares.hasPermission("VT"),
    tareaController.history
  );
  route.get(
    "/findById/:id",
    middlewares.hasPermission(["VTRP", "VTP"]),
    tareaController.findById
  );
  route.get("/exportarExcel/:idProyecto", tareaController.exportarExcel);
  route.get(
    "/findByProyectoLista/:idProyecto/:page/:limit/:search?",
    middlewares.hasPermission("VTO"),
    tareaController.findByProyectoLista
  );
  route.get(
    "/findByProyecto/:idProyecto/:page/:limit/:search?",
    middlewares.hasPermission("VAT"),
    tareaController.findByProyecto
  );
  route.get(
    "/findByProyectoDesordenadas/:idProyecto/:page/:limit/:search?",
    middlewares.hasPermission("VAT"),
    tareaController.findByProyectoDesordenadas
  );
  route.get(
    "/findByProyectoAndUsuario/:idProyecto/:idUsuario",
    middlewares.hasPermission("VATP"),
    middlewares.hasPermission(["VST", "VAT"]),
    tareaController.findByProyectoAndUsuario
  );
  route.get(
    "/findByProyectoArray/:idProyecto",
    middlewares.hasPermission("VATP"),
    middlewares.hasPermission(["VST", "VAT"]),
    tareaController.findByProyectoArray
  );
  route.get(
    "/findByEmpresa/:idEmpresa",
    middlewares.hasPermission("VTE"),
    tareaController.findByEmpresa
  );
  route.get(
    "/findByUser",
    middlewares.hasPermission("VST"),
    tareaController.findByUser
  );
  route.post(
    "/",
    celebrate({
      body: Joi.object({
        proyecto: Joi.string().required(),
        nombre: Joi.string().required(),
        presupuesto: Joi.number().required(),
        unidad: Joi.string().optional(),
        medicion: Joi.number().required(),
        fInicio: Joi.date().allow(""),
        fFin: Joi.date().allow(""),
        idPlanificacion: Joi.string().allow(""),
        idPresupuesto: Joi.string().allow(""),
        idPredecesora: Joi.string().allow(""),
      }),
    }),
    middlewares.hasPermission("CC"),
    tareaController.create
  );
  route.put(
    "/",
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
        proyecto: Joi.string().required(),
        nombre: Joi.string().required(),
        codigo: Joi.string().required(),
        presupuesto: Joi.number().allow("", null),
        unidad: Joi.string().allow("", null),
        medicion: Joi.number().allow(""),
        fInicio: Joi.date().allow("", null),
        fFin: Joi.date().allow("", null),
        idPlanificacion: Joi.string().allow("", null),
        idPresupuesto: Joi.string().allow("", null),
        idPredecesora: Joi.string().allow("", null),
        idQrisys: Joi.string().required(),
        updated_for: Joi.string().required(),
        medicionActual: Joi.number().required(),
        porcentajeActual: Joi.number().required(),
        presupuestoActual: Joi.number().required(),
        estado: Joi.string().required(),
        parent: Joi.string().required(),
        childrens: Joi.array().required(),
        reportesProduccion: Joi.array(),
        recursosAsociados: Joi.array(),
        _version: Joi.number().integer().required(),
      }),
    }),
    middlewares.hasPermission("ET"),
    tareaController.edit
  );
  route.put(
    "/cancelarTarea/:idTarea",
    middlewares.hasPermission("CT"),
    tareaController.cancelarTarea
  );

  route.get("/findByWord/:word/:idProyecto", tareaController.findByWord);
};
