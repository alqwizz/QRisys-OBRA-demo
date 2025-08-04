import React, { useState } from 'react'
import ModalFiles from "../Modales/ModalFiles";
import { ModalReportar } from "../Modales/ModalReportar";
import '../Reportes.css';
import useGlobal from "../../../store/store";
import { downloadFiles } from "../../../utils/ReportesProduccionUtils";

export function TablaReportesProduccionTarea({ reportes, tarea, doCargar }) {

    const [modalOpenReportarTarea, setModalOpenReportarTarea] = useState(false);
    const [modalOpenInfo, setOpenInfo] = useState(false);
    const [editReporte, setEditReporte] = useState(null);
    const [state, actions] = useGlobal();
    const hasPermission = actions.hasPermission();
    const user = state.userSession;


    function handleShowEdit(reporte) {
        setModalOpenReportarTarea(true);
        setEditReporte(reporte);
    }
    function handleShowReporte(reporte){
        setEditReporte(reporte);
        setOpenInfo(true);
    }

    const handleDownload = (reporte) => {
        downloadFiles(reporte._id).then(res => {
            const link = document.createElement('a');
            link.href = 'data:text/plain;base64,' + res.data;
            link.setAttribute('download', `${reporte._id}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => console.error(err));
    };

    return (
        <React.Fragment>
            {
                reportes.map(reporte => {
                    return (
                        hasPermission("VRP") &&
                        <div className={'reporte-info'} key={reporte._id}>
                            <div>
                                <div className={'item'}><span>Fecha</span>
                                    <b>{new Date(reporte.fechaCreacion).toLocaleDateString()}</b></div>
                                <div className={'item'}>
                                    <span>Avance reportado </span>
                                    <b>{reporte.numero && reporte.porcentaje ? reporte.numero.toFixed(2) : (reporte.numero / tarea.medicion * 100).toFixed(2)}%</b>
                                </div>
                                <div className={'item'}>
                                    <span>Acumulado</span>
                                    <b>{reporte.porcentajeTarea ? reporte.porcentajeTarea.toFixed(2) + '%' : ''}</b>
                                </div>
                                <div className={'item'}>
                                    {reporte.completar && <b style={{color: 'var(--verde-agua)'}}>Completada</b>}
                                    {reporte.tipo === 'problema' && <b style={{color:'var(--red)'}}>Problema</b>}
                                </div>
                                <div style={{ justifySelf: 'flex-end', textAlign: 'end' }}>
                                    <i className={'fas fa-file-download'} onClick={() => handleDownload(reporte)} />
                                    {(hasPermission("ERP") || reporte.usuario === user._id) &&
                                        <i className={'fas fa-pencil-alt'} onClick={() => handleShowEdit(reporte)} />}
                                    <i className={'fas fa-eye'} onClick={() => handleShowReporte(reporte)} />
                                </div>
                            </div>
                            <div className={'comment'}>
                                <div className={'item'}>
                                    <span>Usuario</span>
                                    <b>{reporte.usuario && (reporte.usuario.nombre + ', ' + reporte.usuario.apellidos)}</b>
                                </div>
                                <div className={'item'}>
                                    <span>Comentario </span>
                                    <b>{reporte.descripcion}</b>
                                </div>
                            </div>
                        </div>
                    )
                }
                )
            }
            {(!reportes || reportes.length === 0) && <p> No hay reportes disponibles.</p>}
            {
                editReporte &&
                <React.Fragment>
                    <ModalReportar tarea={tarea} reporte={editReporte} modalOpen={modalOpenReportarTarea} setModalOpen={setModalOpenReportarTarea} doCargar={doCargar} />
                    {hasPermission("VRP") && <ModalFiles reporte={editReporte} modalOpen={modalOpenInfo} setModalOpen={setOpenInfo} tarea={tarea} />}
                </React.Fragment>
            }
            {

            }
        </React.Fragment>
    );
}
