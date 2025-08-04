import Certificacion from '../models/certificacion.model';
import Usuario from '../models/usuario.model';
import { IUsuarioDTO } from '../interfaces/IUsuario';
import { ICertificacion } from "../interfaces/ICertificacion";
import Aviso from "../models/aviso.model";
import TareaService from "./tarea.services";
import ReporteProduccionService from "./reporteProduccion.services";
import { ITarea } from '../interfaces/ITarea';
import { Response } from 'express';
import xl from 'excel4node';
import { isMainThread } from "worker_threads";

export default class CertificacionService {
    private tareaService: TareaService;
    private reporteProduccionService;
    constructor() {
        this.tareaService = new TareaService();
        this.reporteProduccionService = new ReporteProduccionService();
    }

    public create = async (certificacion: ICertificacion) => {
        try {
            var err, res = await new Certificacion(certificacion).save();
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    };
    public findAll = async (idProyecto: string) => {
        try {
            var err, res = await Certificacion.find({ proyecto: idProyecto });
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    }
    public validate = async (idCertificacion: string) => {
        try {
            var err, res = await Certificacion.findByIdAndUpdate(idCertificacion, { validada: true });
            if (err) throw err;
            return res;
        } catch (e) {
            throw e;
        }
    };

    public exportarExcel = async (certificacion: { fInicio: string, fFin: string, tareas: ITarea[], sobreCoste: number, costeTotal: number, perCert: number, perTotal: number, costeCert: number }, res: Response) => {
        try {
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('CERTIFICACION');
            const headerStyle = wb.createStyle({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#cfe7f5',
                    fgColor: '#cfe7f5',
                },
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            const regularStyle = wb.createStyle({
                alignment: {
                    wrapText: true,
                    horizontal: 'center',
                }
            });
            ws.cell(1, 1).string("ID PRESUPUESTO").style(headerStyle);
            ws.column(1).setWidth(20)
            ws.cell(1, 2).string("NOMBRE").style(headerStyle);
            ws.column(2).setWidth(60)
            ws.cell(1, 3).string("UNIDAD").style(headerStyle);
            ws.cell(1, 4).string("MEDICION").style(headerStyle);
            ws.cell(1, 5).string("PRESUPUESTO").style(headerStyle);
            ws.column(5).setWidth(20)
            ws.cell(1, 6).string("%AVANCE CERTIFICACION").style(headerStyle);
            ws.column(6).setWidth(40)
            ws.cell(1, 7).string("%MEDICION A CERTIFICAR").style(headerStyle);
            ws.column(7).setWidth(40)
            ws.cell(1, 8).string("%PRESUPUESTO A CERTIFICAR").style(headerStyle);
            ws.column(8).setWidth(40)
            ws.cell(1, 9).string("%AVANCE TOTAL").style(headerStyle);

            let index = 2;
            this.writeTareas(certificacion.tareas, ws, regularStyle, index, certificacion.perTotal)


            wb.write('CERTIFICACION.xlsx', res);

        } catch (e) {
            throw e;
        }
    };

    private writeTareas = (tareas: ITarea[], ws, regularStyle, index: number, avanceTotal: number): number => {
        for (let i = 0; i < tareas.length; i++) {
            const tarea: ITarea = tareas[i]
            if (tarea) {
                const idPresupuesto = tarea && tarea.idPresupuesto ? tarea.idPresupuesto : ''
                const nombre = tarea && tarea.nombre ? tarea.nombre : '';
                const unidad = tarea && tarea.unidad ? tarea.unidad : '';
                const medicion = tarea && tarea.medicion ? tarea.medicion : null;
                const presupuesto = tarea && tarea.presupuesto ? tarea.presupuesto : null
                const avanceCertificacion = tarea && tarea['porcentajeCert'] !== undefined ? tarea['porcentajeCert'] : null

                let medicionCertificacion = null
                if (medicion !== null && avanceCertificacion !== null) {
                    medicionCertificacion = medicion * avanceCertificacion / 100;
                }
                let presupuestoCertificacion = null;
                if (presupuesto !== null && avanceCertificacion !== null) {
                    presupuestoCertificacion = presupuesto * avanceCertificacion / 100;
                }
                ws.cell(index, 1).string(idPresupuesto).style(regularStyle);
                ws.cell(index, 2).string(nombre).style(regularStyle);
                ws.cell(index, 3).string(unidad).style(regularStyle);
                if (medicion !== null) ws.cell(index, 4).number(medicion).style(regularStyle);
                if (presupuesto !== null) ws.cell(index, 5).number(presupuesto).style(regularStyle);
                if (avanceCertificacion !== null) ws.cell(index, 6).number(avanceCertificacion).style(regularStyle);
                if (medicionCertificacion !== null) ws.cell(index, 7).number(medicionCertificacion).style(regularStyle);
                if (presupuestoCertificacion !== null) ws.cell(index, 8).number(presupuestoCertificacion).style(regularStyle);
                if (avanceTotal !== null) ws.cell(index, 9).number(avanceTotal).style(regularStyle);

                index++;
                if (tarea.childrens && tarea.childrens.length > 0) {
                    index = this.writeTareas(tarea.childrens as ITarea[], ws, regularStyle, index, avanceTotal);
                }
            }

        }
        return index;
    }

    public generateCertificacion = async (diaInicio: string, diaFin: string, sobreCoste: number, idProyecto: string) => {
        try {
            let tareas = await this.tareaService.findBetweenDates(diaInicio, diaFin, idProyecto);
            let trozoSobreCoste = 0;
            let tareasCert = [];
            let perTotal = 0;



            const { res, arrayRes } = await this.filtrarTareasRecursivo(tareas, diaInicio, diaFin);
            if (sobreCoste > 0) {
                trozoSobreCoste = sobreCoste / res;
            }
            const { costeCert, costeTotal, perCert } = await this.certificarTareaRecursivo(arrayRes, trozoSobreCoste, diaInicio, diaFin);
            perTotal = (costeCert / costeTotal) * 100;
            return { fInicio: diaInicio, fFin: diaFin, tareas: arrayRes, sobreCoste, costeTotal: costeTotal, perCert: perCert, perTotal: perTotal, costeCert: costeCert };
        } catch (e) {
            throw e;
        }
    }
    private filtrarTareasRecursivo = async (tareas: ITarea[], diaInicio: string, diaFin: string): Promise<{ res, arrayRes }> => {
        try {
            //let res = [...tareas]
            let res = 0;
            let arrayRes = []
            for (let i = 0; i < tareas.length; i++) {
                const tarea = tareas[i];
                if (tarea.childrens && tarea.childrens.length > 0) {
                    const response = await this.filtrarTareasRecursivo(tarea.childrens as ITarea[], diaInicio, diaFin);
                    res += response.res;
                    tarea.childrens = response.arrayRes;
                    if (tarea.childrens && tarea.childrens.length > 0) {
                        arrayRes.push(tarea);
                    }
                } else {
                    const reporte = await this.reporteProduccionService.findLastByTareaBetweenDates(tarea._id, new Date(diaInicio), new Date(diaFin));
                    if (reporte) {
                        arrayRes.push(tarea);
                        res++;
                    }
                }
            }
            return { res, arrayRes };

        } catch (e) {
            throw e;
        }
    }
    private certificarTareaRecursivo = async (tareas: ITarea[], trozoSobreCoste: number, diaInicio: string, diaFin: string) => {
        try {
            let costeCert = 0;
            let costeTotal = 0;
            let perCert = 0;
            for (let i = 0; i < tareas.length; i++) {
                const tarea = tareas[i];
                if (tarea.childrens && tarea.childrens.length > 0) {
                    const res = await this.certificarTareaRecursivo(tarea.childrens as ITarea[], trozoSobreCoste, diaInicio, diaFin);
                    costeCert += res.costeCert;
                    costeTotal += res.costeTotal;
                    perCert += res.perCert;
                } else {
                    const reporte = await this.reporteProduccionService.findLastByTareaBetweenDates(tarea._id, new Date(diaInicio), new Date(diaFin));
                    let porcentaje = reporte ? reporte.porcentajeTarea : 0;
                    let coste = reporte ? (porcentaje / 100) * tarea.presupuesto : 0;
                    if (trozoSobreCoste > 0) {
                        coste += trozoSobreCoste;
                        //porcentaje = tarea.presupuesto
                        porcentaje = coste * 100 / tarea.presupuesto;
                    }
                    costeCert += isNaN(coste) ? 0 : coste;
                    costeTotal += tarea.presupuesto;
                    perCert += porcentaje;
                    tarea['porcentajeCert'] = porcentaje;
                    tarea['costeAsociado'] = coste;
                }
            }
            perCert = perCert / tareas.length;
            return { costeCert, costeTotal, perCert }
        } catch (e) {
            throw e;
        }
    }
}
