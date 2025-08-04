import ReporteProduccionController from "../../controllers/reporteProduccion.controllers";
import { Router } from "express";
import middlewares from "../middlewares";
import { celebrate, Joi } from "celebrate";
const route = Router();

export default (app: Router) => {
  const reporteProduccionController = new ReporteProduccionController();
  app.use("/reportesProduccion", route);

  route.get(
    "/:idTarea",
    middlewares.hasPermission("VTRP"),
    reporteProduccionController.findByTarea
  );
  route.get(
    "/last3/:idTarea",
    middlewares.hasPermission(["CR", "ERP"]),
    reporteProduccionController.findLast3ByTarea
  );
  route.get(
    "/findById/:id",
    middlewares.hasPermission("VRT"),
    reporteProduccionController.findById
  );
  route.post(
    "/",
    celebrate({
      body: Joi.object({
        tarea: Joi.string().required(),
        completar: Joi.boolean().required(),
        numero: Joi.number().allow(null, ""),
        unidad: Joi.boolean().allow(null, ""),
        porcentaje: Joi.boolean().required(),
        tipo: Joi.string().required(),
        descripcion: Joi.string().allow(null, "").optional(),
      }),
    }),
    middlewares.hasPermission("CR"),
    reporteProduccionController.create
  );
  route.put(
    "/",
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
        tarea: Joi.string().required(),
        completar: Joi.boolean().required(),
        numero: Joi.number().allow(null, ""),
        unidad: Joi.boolean().allow(null, ""),
        porcentaje: Joi.boolean().required(),
        porcentajeTarea: Joi.number(),
        tipo: Joi.string().required(),
        descripcion: Joi.string().allow(null, ""),
        files: Joi.array().required(),
        usuario: Joi.object().required(),
        orden: Joi.number().allow(null, ""),
        fechaActualizacion: Joi.date().required(),
        fechaCreacion: Joi.date(),
        total: Joi.number().allow(null, ""),
        precioTotal: Joi.number(),
        updated_for: Joi.string().required(),
        _version: Joi.number().integer().required(),
      }),
    }),
    middlewares.hasPermission("ERP"),
    reporteProduccionController.edit
  );
  route.post(
    "/sendPhoto/:idReporteProduccion",
    middlewares.hasPermission(["CR", "ERP"]),
    reporteProduccionController.sendPhoto
  );

  route.get(
    "/getFiles/:reporteProduccion",
    reporteProduccionController.downloadFiles
  );
  route.get(
    "/exportarArchivosProyecto/:idProyecto",
    reporteProduccionController.exportarArchivosProyecto
  );
};
