import React, { useState, useEffect } from 'react';
import { findById } from '../../utils/TareasUtils'
import { findByTarea as findPedidosByTarea } from '../../utils/PedidosUtils'
import { ModalFormTareas } from './Modales/ModalFormTareas'
import { ModalReportar } from '../Reportes/Modales/ModalReportar'
import { TablaReportesProduccionTarea } from '../Reportes/Tablas/TablaReportesProduccionTareas';
import { TablaPedidos } from '../Pedidos/Tablas/TablaPedidos';
import { findByTarea as findReportesProduccionByTarea } from '../../utils/ReportesProduccionUtils';
import useGlobal from "../../store/store";
import { findById as findProyectoById } from '../../utils/ProyectosUtils';
import { ModalCancelarTarea } from "./Modales/ModalCancelarTarea";
import { navigate } from 'hookrouter'
import './DetalleTarea.css';


export function DetalleTarea({ idTarea }) {

    let [tarea, setTarea] = useState(null);
    let [openModalEditar, setOpenModalEditar] = useState(false);

    const [openModalCancelar, setOpenModalCancelar] = useState(false);


    let [cargar, setCargar] = useState(false);
    let [reportesProduccion, setReportesProduccion] = useState([]);
    let [pedidos, setPedidos] = useState([]);
    let [openPedidos, setOpenPedidos] = useState(false);
    let [openReportesProduccion, setOpenReportesProduccion] = useState(true);
    let [modalOpenReportarTarea, setModalOpenReportarTarea] = useState(false);

    let [editReporte, setEditReporte] = useState(null);
    let [editPedido, setEditPedido] = useState(null);
    let [state, actions] = useGlobal();
    // const userSession = state.userSession;
    const hasPermission = actions.hasPermission();
    useEffect(() => {
        if (hasPermission("VTRP")) {
            setOpenPedidos(false)
            setOpenReportesProduccion(true)
        } else if (hasPermission("VTP")) {
            setOpenPedidos(true)
            setOpenReportesProduccion(false)
        } else {
            navigate('/empresas')
        }
    }, [])
    useEffect(() => {
        findById(idTarea).then(res => {
            const tareaRes = res.data.tarea;
            setTarea(tareaRes);
        });
        if (hasPermission('VTRP'))
            findReportesProduccionByTarea(idTarea).then(res => {
                setReportesProduccion(res.data.reportesProduccion);
            });
        if (hasPermission('VTP'))
            findPedidosByTarea(idTarea).then(res => {
                setPedidos(res.data.pedidos);
            });
    }, [idTarea, cargar]);

    useEffect(() => {
        let unmounted = false;
        if (tarea) {
            findProyectoById(tarea.proyecto).then(res => {
                const proyecto = res.data.proyecto;
                const breadcrumb = [
                    { link: '/empresas', name: 'Empresas' },
                    { link: '/detalleEmpresa/' + proyecto.empresa._id, name: proyecto.empresa.cif },
                    { link: '/detalleProyecto/' + proyecto._id, name: proyecto.nombre },
                    { link: '/tareas/' + tarea._id, name: tarea.nombre }];
                if (!unmounted) actions.setBreadcrumb(breadcrumb)
            });

            return () => { unmounted = true };
        }
    }, [tarea, actions]);

    const handleEditar = () => {
        setOpenModalEditar(true);
    };
    const doCargar = () => {
        if (editReporte) setEditReporte(null)
        if (editPedido) setEditPedido(null)
        setCargar(!cargar);
    }
    const handlePedidos = () => {
        if (openReportesProduccion) setOpenReportesProduccion(false)
        setOpenPedidos(true)
    }
    const handleReportesProduccion = () => {
        if (openPedidos) setOpenPedidos(false)
        setOpenReportesProduccion(true)
    };


    const handleCancelPedido = () => {
        setOpenModalCancelar(true);
    };

    // const hanldeUsuarios = () => {
    //     setModalOpenAsignarUsuarios(true);
    // }

    const firstCircleStyle = {
        stroke: 'grey',
        strokeWidth: '4px'
    };
    const secondCircleStyle = {
        strokeWidth: '8px',
        strokeDasharray: '252',
        strokeLinecap: 'round',

    };
    const returnStrokeStyle = (tarea) => {
        const result = {};
        switch (tarea.estado) {
            case 'iniciado':
                result.stroke = '#FDB070';
                break;
            case 'problema':
                result.stroke = '#fdb5b0';
                break;
            case 'completado':
                result.stroke = '#B2FD94';
                break;
            case 'cerrado':
                result.stroke = '#487A1D';
                break;
            case 'cancelado':
                result.display = 'none';
                break;
            default:
                result.stroke = 'white';
                break;
        }
        result.strokeDashoffset = 252 - (252 * (tarea.porcentajeActual / 100));
        // if (user && user.tareas && !user.tareas.includes(tarea._id)) {
        //     result.backgroundColor = '#f6f6f6';
        // }
        return result;
    }

    if (!tarea) return <div />;
    return (
        <div className={'section'}>
            <div className={'section-heading'}>
                <h3>{tarea.nombre}</h3>
            </div>
            <div className={'section-content'}>
                <div className={'section-body'}>
                    <div className={'section-body--header'}>
                        <div className={'tarea-info-detail'}>
                            <div>
                                {hasPermission("ET") && <i className={'fas fa-pencil-alt'} style={{ marginRight: '8px' }} onClick={handleEditar} />}
                                {hasPermission("CT") && <i className={'fas fa-ban'} onClick={handleCancelPedido} />}
                            </div>

                            <div className={'tarea-info--details'}>
                                <div className={'planificacion'}>
                                    <svg viewBox="0 0 100 100" style={{ height: '80px', marginRight: '30px' }}>
                                        <circle id="first-circle" cx="50" cy="50" r="32" fill="none" style={firstCircleStyle} />
                                        <circle id="second-circle" cx="50" cy="50" r="40" fill="none" style={Object.assign({}, secondCircleStyle, returnStrokeStyle(tarea))} />
                                        <text x="50" y="50" fontSize={'18'} fontWeight={'bold'} dominantBaseline="middle" textAnchor="middle">{tarea && tarea.porcentajeActual && tarea.porcentajeActual.toFixed(0)}%</text>
                                    </svg>
                                    <span>ID Planificación: <b>{tarea.idPlanificacion}</b></span>
                                </div>
                                <div className={'indicators'}>
                                    <div className={'date'}>
                                        {tarea.fInicio && < span > {new Date(tarea.fInicio).toLocaleDateString()}</span>}
                                        {tarea.fFin && <span>{new Date(tarea.fFin).toLocaleDateString()}</span>}
                                    </div>
                                    <div className={'indicators-line'}>
                                        <div>
                                            <span style={{marginRight:'8px'}}>Producción <b>{tarea.porcentajeActual}%</b> </span>
                                            <b>{tarea.medicion} {tarea.unidad}</b>
                                        </div>
                                        {/*<div style={tarea.porcentajeActual > 100 ? { width: '100%' } : { width: tarea.porcentajeActual + '%' }}></div>*/}
                                    </div>
                                    <div className={'indicators-line'}>
                                        <div>
                                            <span style={{marginRight:'8px'}}>Presupuesto <b>{tarea.presupuestoActual}</b> </span>
                                            <b>{tarea.presupuesto}</b>
                                        </div>
                                        {/*<div style={tarea.presupuestoActual / tarea.presupuesto > 1 ? { width: '100%' } : { width: (tarea.presupuestoActual / tarea.presupuesto) * 100 + '%' }}></div>*/}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className={'section-body--body'}>
                        <div className={'selectors'} style={{ textAlign: 'center' }}>
                            <span className={'selector_item' + (openReportesProduccion ? " active" : '')} onClick={handleReportesProduccion} style={{ cursor: 'pointer' }}>Reportes</span>
                            <span className={'selector_item' + (openPedidos ? " active" : '')} onClick={handlePedidos} style={{ cursor: 'pointer' }}>Pedidos</span>
                        </div>
                        {openReportesProduccion && <TablaReportesProduccionTarea tarea={tarea} reportes={reportesProduccion} doCargar={doCargar} />}
                        {openPedidos && <TablaPedidos pedidos={pedidos} doCargar={doCargar} />}
                        <ModalFormTareas tarea={tarea} doCargar={doCargar} modalOpen={openModalEditar} setModalOpen={setOpenModalEditar} />
                        <ModalReportar tarea={tarea} reporte={editReporte} doCargar={doCargar} modalOpen={modalOpenReportarTarea} setModalOpen={setModalOpenReportarTarea} />
                        <ModalCancelarTarea tarea={tarea} doCargar={doCargar} modalOpen={openModalCancelar} setModalOpen={setOpenModalCancelar} />
                        {/*<ModalAsignarUsuariosTarea doCargar={doCargar} idProyecto={tarea.proyecto} idTarea={tarea._id} modalOpen={modalOpenAsignarUsuarios} setModalOpen={setModalOpenAsignarUsuarios} />*/}
                    </div>
                </div>

            </div>
        </div >
    )
}
