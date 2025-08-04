import { IUsuarioDTO } from '../interfaces/IUsuario';
import ParteAsistencia from '../models/parteAsistencia.model';
import { IParteAsistencia } from "../interfaces/IParteAsistencia";
import mongoose from 'mongoose';
import xl from 'excel4node';
import { Response } from 'express';
import EmpresaSubcontrataModel from '../models/empresaSubcontrata.model';

export default class ParteAsistenciaService {
    constructor() { }

    public create = async (parte, user: IUsuarioDTO): Promise<IParteAsistencia> => {
        try {
            let err, parteAsistencia = await new ParteAsistencia({
                asistentes: parte.asistentes,
                fecha: parte.fecha,
                proyecto: parte.proyecto,
                empresa: parte.empresa,
                updated_for: user._id
            }).save();
            if (err) throw err;
            return parteAsistencia;
        } catch (e) {
            throw e;
        }
    }

    public findByProyecto = async (idProyecto: string): Promise<IParteAsistencia[]> => {
        try {
            let err, partes = await ParteAsistencia.aggregate([
                { $match: { proyecto: new mongoose.Types.ObjectId(idProyecto) } },
                { $group: { _id: { $dateToString: { format: '%d/%m/%Y', date: '$fecha' } }, partes: { $push: { parte: '$_id', empresa: '$empresa' } } } },
                { $sort: { _id: -1 } },
                { $lookup: { from: 'empresasubcontratas', localField: 'partes.empresa', foreignField: '_id', as: "empresas" } },
            ]);
            if (err) throw err;
            return partes;
        } catch (e) {
            throw e;
        }
    }
    public findByEmpresaAndDate = async (idEmpresa: string, fecha: string): Promise<IParteAsistencia[]> => {
        try {
            let err, partes = await ParteAsistencia.aggregate([
                { $match: { empresa: new mongoose.Types.ObjectId(idEmpresa), $expr: { $eq: [fecha, { $dateToString: { format: '%d/%m/%Y', date: '$fecha' } }] } } },
                { $project: { fecha: { $dateToString: { format: '%d/%m/%Y', date: '$fecha' } }, asistentes: 1 } }
            ]);
            if (err) throw err;
            return partes
        } catch (e) {
            throw e;
        }
    }

    public exportarExcel = async (idProyecto: string, res: Response): Promise<void> => {
        try {
            const wb = new xl.Workbook();
            const ws = wb.addWorksheet('PARTES PERSONAL');
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
            ws.cell(1, 1).string("FECHA").style(headerStyle);
            ws.cell(1, 2).string("DÍA SEMANA").style(headerStyle);
            ws.cell(1, 3).string("NOMBRE EMPRESA").style(headerStyle);
            ws.column(3).setWidth(20)
            ws.cell(1, 4).string("DNI").style(headerStyle);
            ws.cell(1, 5).string("NOMBRE Y APELLIDOS").style(headerStyle);
            ws.column(5).setWidth(20)
            ws.cell(1, 6).string("HORAS").style(headerStyle);



            var err, partes = await ParteAsistencia.find({ proyecto: idProyecto });
            if (err) throw err;
            if (partes) {
                let index = 2;
                const dias = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"]
                let empresas = {}
                for (let i = 0; i < partes.length; i++) {
                    const parte = partes[i]
                    let fecha = ''
                    let dia = ''
                    var empresa = empresas[parte.empresa];
                    const asistentes = parte.asistentes;
                    if (!empresa) {
                        var err, empRes = await EmpresaSubcontrataModel.findById(parte.empresa);
                        if (err) throw err;
                        empresa = empRes;
                        empresas[parte.empresa] = empresa;
                    }
                    const nombreEmpresa = empresa && empresa.nombre ? empresa.nombre : ''
                    if (parte.fecha) {
                        const day = parte.fecha.getDate()
                        const month = parte.fecha.getMonth() + 1
                        const year = parte.fecha.getFullYear()
                        fecha = day + '/' + month + '/' + year
                        dia = dias[parte.fecha.getDay()];
                    }
                    if (asistentes && asistentes.length)
                        for (let j = 0; j < asistentes.length; j++) {
                            const asistente = asistentes[j];
                            const nombre = asistente && asistente.nombre ? asistente.nombre : ''
                            const dni = asistente && asistente.dni ? asistente.dni : ''
                            const horas = asistente && asistente.horas ? asistente.horas : ''
                            ws.cell(index, 1).string(fecha).style(regularStyle);
                            ws.cell(index, 2).string(dia).style(regularStyle);
                            ws.cell(index, 3).string(nombreEmpresa).style(regularStyle);
                            ws.cell(index, 4).string(dni).style(regularStyle);
                            ws.cell(index, 5).string(nombre).style(regularStyle);
                            ws.cell(index, 6).number(horas).style(regularStyle);
                            index++;
                        }
                }
            }



            wb.write('PARTES PERSONAL.xlsx', res);

        } catch (e) {
            throw e;
        }
    }
}
