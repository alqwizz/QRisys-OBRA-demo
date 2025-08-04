import { Request, Response, NextFunction } from "express";
import ProyectoService from "../services/proyecto.services";
import Logger from "../loaders/logger";
import { IProyecto } from "../interfaces/IProyecto";
import { IUsuarioDTO } from "../interfaces/IUsuario";

export default class ProyectoController {
  private proyectoService: ProyectoService;
  constructor() {
    this.proyectoService = new ProyectoService();
  }
  public create = async (req: Request, res: Response, next: NextFunction) => {
    Logger.debug("Creando nuevo proyecto con body: %o", req.body);
    try {
      const proyecto = await this.proyectoService.create(
        req.body as IProyecto,
        req.user as IUsuarioDTO
      );
      return res.status(proyecto ? 200 : 400).json({
        status: proyecto ? 200 : 400,
        user: proyecto,
        message: proyecto
          ? "Proyecto creado correctamente"
          : "Se ha producido un error.",
      });
    } catch (e) {
      Logger.error("Se ha producido un error creando un proyecto");
      Logger.error(e);
      return res.status(400).json({
        status: 400,
        message:
          "Se ha producido un error inesperado. Contacte con el administrador.",
      });
    }
  };
  public edit = async (req: Request, res: Response, next: NextFunction) => {
    Logger.debug("Editando proyecto con body: %o", req.body);
    try {
      const proyecto = await this.proyectoService.edit(
        req.body as IProyecto,
        req.user as IUsuarioDTO
      );
      return res.status(proyecto ? 200 : 400).json({
        status: proyecto ? 200 : 400,
        proyecto: proyecto,
        message: proyecto
          ? "proyecto creada correctamente"
          : "Se ha producido un error.",
      });
    } catch (e) {
      Logger.error("Se ha producido un error editando un proyecto");
      Logger.error(e);
      return res.status(400).json({
        status: 400,
        message:
          "Se ha producido un error inesperado. Contacte con el administrador.",
      });
    }
  };
  public editCTECI = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Logger.debug("Editando la CTECI, cuerpo: " + req.body);
    try {
      const proyecto = await this.proyectoService.updateCTECI(req.body);
      return res.status(proyecto ? 200 : 400).json({
        status: proyecto ? 200 : 400,
        proyecto: proyecto,
        message: proyecto
          ? "CTECI editado correctamente"
          : "Se ha producido un error.",
      });
    } catch (e) {
      Logger.error("Se ha producido un error al editar la CTECI");
      Logger.error(e);
      return res.status(400).json({
        status: 400,
        message:
          "Se ha producido un error inesperado. Contacte con el administrador.",
      });
    }
  };
  public findById = async (req: Request, res: Response, next: NextFunction) => {
    Logger.debug("Metodo findById proyectos");
    try {
      const user = req.user as IUsuarioDTO;
      const canSeeAll = user.permisos.find((x) => x.codigo === "VEP")
        ? true
        : false;
      const proyecto = await this.proyectoService.findById(
        req.params.id,
        canSeeAll ? null : user._id
      );
      return res.status(200).json({ status: 200, proyecto: proyecto });
    } catch (e) {
      Logger.error("Se ha producido un error en el metodo proyectos findById");
      Logger.error(e);
      return res.status(400).json({
        status: 400,
        message:
          "Se ha producido un error inesperado. Contacte con el administrador.",
      });
    }
  };
  public importPlanificacion = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    Logger.debug("Metodo importar");
    try {
      req.pipe(req.busboy);
      req.busboy.on("file", async function (fieldname, file, filename) {
        req.connection.setTimeout(1000 * 60 * 30);
        var proyectoService = new ProyectoService();
        proyectoService
          .importPlanificacion(req.params.idProyecto, file, filename, req.user)
          .then((value) => {
            return res.status(200).json({ status: 200 });
          })
          .catch((e) => {
            Logger.error(
              "Se ha producido un error en el metodo import planificacion"
            );
            Logger.error(e);
            return res.status(400).json({
              status: 400,
              message:
                "Se ha producido un error inesperado. Contacte con el administrador.",
            });
          });
      });
    } catch (e) {
      Logger.error("Se ha producido un error en el metodo import usuarios");
      Logger.error(e);
      return res.status(400).json({
        status: 400,
        message:
          "Se ha producido un error inesperado. Contacte con el administrador.",
      });
    }
  };
}
