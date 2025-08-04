import ProyectoController from "../../controllers/proyecto.controllers";
import { Router } from "express";
import middlewares from "../middlewares";
import { celebrate, Joi } from "celebrate";
const route = Router();

export default (app: Router) => {
  const proyectoController = new ProyectoController();
  app.use("/proyectos", route);
  route.get(
    "/findById/:id",
    middlewares.hasPermission(["VEP", "VEPU"]),
    proyectoController.findById
  );
  route.post(
    "/",
    celebrate({
      body: Joi.object({
        nombreContacto: Joi.string().required(),
        nombre: Joi.string().required(),
        empresa: Joi.string().required(),
        fInicio: Joi.string().required(),
        fFin: Joi.string().required(),
        email: Joi.string().required(),
        direccion: Joi.string().required(),
      }),
    }),
    middlewares.hasPermission("CP"),
    proyectoController.create
  );
  route.put(
    "/",
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
        empresa: Joi.alternatives().try(Joi.string(), Joi.object()).required(),
        nombreContacto: Joi.string().required(),
        nombre: Joi.string().required(),
        estado: Joi.string().required(),
        fInicio: Joi.string().required(),

        fInicioReal: Joi.string(),
        fFin: Joi.string().required(),
        email: Joi.string().required(),
        direccion: Joi.string().required(),
        updated_for: Joi.string().required(),

        CTECI: Joi.array(),
        CI: Joi.array(),
        CO: Joi.array(),
        CD: Joi.array(),
        CM: Joi.array(),
        CC: Joi.array(),
        _version: Joi.number().integer().required(),
      }),
    }),
    middlewares.hasPermission("EP"),
    proyectoController.edit
  );
  route.put(
    "/editCTECI/",
    celebrate({
      body: Joi.object({
        _id: Joi.string().required(),
        CTECI: Joi.number(),
      }),
    }),
    middlewares.hasPermission("EP"),
    proyectoController.editCTECI
  );
  route.post(
    "/importPlanificacion/:idProyecto",
    middlewares.hasPermission("IP"),
    proyectoController.importPlanificacion
  );
};
