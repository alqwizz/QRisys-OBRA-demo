import React, { useState, useEffect } from 'react';
import { reporteEmpty, reporteFalse } from '../../../utils/ReporteProduccion/Form/Form'
import { edit, create, findLast3ByTarea, sendPhoto } from '../../../utils/ReportesProduccionUtils'
import documento from "../../../assets/img/document.svg";
import { API_URL } from '../../../config/config'
import useGlobal from "../../../store/store";

export function ReporteProduccionForm({ reporte, tarea, close, modalOpen }) {
    let [touched, setTouched] = useState(reporteFalse);
    let [errors, setErrors] = useState(reporteEmpty);
    let [numeroBeforeEdit, setNumeroBeforeEdit] = useState(null);
    let [lastReportes, setLastReportes] = useState([]);
    let [editReporte, setEditReporte] = useState(reporteEmpty)
    let [page, setPage] = useState(0);
    let [files, setFiles] = useState([])
    let [tipoReporte, setTipoReporte] = useState('tajo') //tajo | problema
    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    useEffect(() => {
        let unmounted = false;
        if (!modalOpen && !unmounted) {
            setErrors(reporteEmpty);
            setFiles([]);
            setPage(0);
            setTouched(reporteFalse);
        }
        if (!reporte && !unmounted) {
            setEditReporte(reporteEmpty);
            setTipoReporte('tajo');
        }
        if (reporte && !unmounted) {
            setEditReporte(reporte);
            setTipoReporte(reporte.tipo)
            setNumeroBeforeEdit(reporte.numero)
        }
        return () => { unmounted = true };
    }, [modalOpen, reporte])
    useEffect(() => {
        let unmounted = false;
        if (tarea && modalOpen && !unmounted) {
            findLast3ByTarea(tarea._id).then(res => {
                if (!unmounted) setLastReportes(res.data.reportesProduccion)
            })
            return () => { unmounted = true };
        }
    }, [tarea, modalOpen])

    const handleBlurReporte = (field) => (event) => {
        setTouched({ ...touched, [field]: true })
    }
    const handleChangesReporte = (field) => (event) => {
        setEditReporte({ ...editReporte, [field]: event.target.value });
    }

    const handleUnidadPorcentaje = (tipo) => () => {
        switch (tipo) {
            case 'unidad':
                setEditReporte({ ...editReporte, unidad: true, porcentaje: false });
                break;
            case 'porcentaje':
                setEditReporte({ ...editReporte, unidad: false, porcentaje: true });
                break;
            default:
                setEditReporte({ ...editReporte, unidad: true, porcentaje: false });
                break;
        }
    }
    const validatePage1 = () => {
        if (tipoReporte === 'tajo') {
            if (!editReporte.completar && (!editReporte.numero || editReporte.numero < 0)) {
                setErrors({ ...errors, numero: "Debe indicar un número válido" })
                return false;
            }
            if (editReporte.completar) {
                if (editReporte.numero) {
                    if (editReporte.numero < 0) {
                        setErrors({ ...errors, numero: "Debe indicar un número válido" })
                        return false;
                    }
                }
            }
            return true;
        } else {
            setErrors({ ...errors, numero: "" })
            return true;
        }
    }
    const validatePage2 = () => {
        if (tipoReporte === 'problema' && (!editReporte.descripcion || editReporte.length < 4)) {
            setErrors({ ...errors, descripcion: "Debe especificiar el mótivo del problema." })
            return false;
        } else {
            setErrors({ ...errors, numero: "" })
            return true;
        }
    }

    const handleSiguiente = () => {
        if (page === 0) {
            if (validatePage1()) setPage(1);
        }
    }

    const resetForm = () => {
        setErrors(reporteEmpty)
        setEditReporte(reporteEmpty);
        setFiles([])
        setPage(0);
        setTipoReporte('tajo')
        setTouched(reporteFalse)
        close()
    }
    const handleReportar = (event) => {
        event.preventDefault();
        if (validatePage2())
            if (editReporte._id) {
                edit(editReporte).then(res => {
                    let p = []
                    if (files.length > 0) {
                        for (let i = 0; i < files.length; i++) {
                            const data = new FormData()
                            data.append('file', files[i])
                            p.push(sendPhoto(res.data.reporteProduccion._id, data))
                        }
                        Promise.all(p).then(values => resetForm())
                    } else resetForm()
                })
            } else
                create({ ...editReporte, tarea: tarea._id, tipo: tipoReporte }).then(res => {
                    if (files.length > 0) {
                        let p = []
                        for (let i = 0; i < files.length; i++) {
                            const data = new FormData()
                            data.append('file', files[i])
                            p.push(sendPhoto(res.data.reporteProduccion._id, data))

                        }
                        Promise.all(p).then(values => resetForm())
                    } else resetForm()
                })
    }
    const handleCompleteTask = () => {
        if (tipoReporte === 'problema') setTipoReporte('tajo')
        if (!editReporte.completar && !editReporte.numero && diferenciaPorcentaje() === 0) {
            setEditReporte({ ...editReporte, numero: 100, completar: !editReporte.completar });
        } else {
            setEditReporte({ ...editReporte, completar: !editReporte.completar });
        }
        setErrors({ ...errors, numero: "" })

    }
    const handleImages = (event) => {
        let eventFiles = event.target.files;
        let newFiles = [...files];
        for (let i = 0; i < eventFiles.length; i++) {
            newFiles.push(eventFiles[i]);
        }
        setFiles(newFiles);
    }
    const handleTipoReporte = () => {
        if (tipoReporte === 'tajo') {
            setTipoReporte('problema');
            setEditReporte({ ...editReporte, numero: '',completar: false });
        }
        else setTipoReporte('tajo');
    }
    const handleRemoveFile = (file) => () => {
        setEditReporte({ ...editReporte, files: editReporte.files.filter(x => x !== file) })
    }

    // const diferenciaUnidades = () => {
    //     if (!editReporte._id)
    //         if (editReporte.unidad) {
    //             return editReporte.numero > 0 ? (tarea.medicionActual + parseFloat(editReporte.numero)).toFixed(2) : tarea.medicionActual.toFixed(2);
    //         } else {
    //             const avance = tarea.medicion * (editReporte.numero / 100);
    //             return (tarea.medicionActual + avance).toFixed(2);
    //         }
    // }
    const diferenciaPorcentaje = () => {
        if (editReporte && editReporte._id) {
            const diff = editReporte.numero - numeroBeforeEdit;
            if (editReporte.unidad) {
                const diffPorcentaje = (diff * 100 / tarea.medicion).toFixed(2)
                return +tarea.porcentajeActual + diffPorcentaje;
            } else {
                return (+tarea.porcentajeActual) + diff;
            }
        } else {
            if (editReporte.unidad) {
                const avance = +(editReporte.numero * 100 / tarea.medicion).toFixed(2);
                return +tarea.porcentajeActual + avance;
            } else {

                return (+tarea.porcentajeActual) + (+editReporte.numero);
            }
        }

    }

    function handleXFiles(i) {
        let newFiles = [...files];
        newFiles.splice(i, 1);
        setFiles(newFiles);
    }
    function calcPorcentaje(reporte) {
        let porcentaje = '';
        if (reporte.numero)
            porcentaje = (reporte.porcentaje ? reporte.numero.toFixed(2) : (reporte.numero / tarea.medicion * 100).toFixed(2)) + '%';

        return porcentaje;
    }

    if (!tarea) return <div />
    return (
        <React.Fragment>
            <div className={'modal-body'}>
                <div className="row m-b-30">
                    <div className="col-sm-12" style={{ fontSize: '.8em', color: 'darkgrey' }}>
                        <b style={{ color: 'black' }}>Últimos reportes</b>
                        {lastReportes.map(lastRep => {
                            return <div key={lastRep._id}>{new Date(lastRep.fechaActualizacion).toLocaleDateString()} <b className={'m-l-15'}>{calcPorcentaje(lastRep)} REPORTADO</b><b className={'m-l-15'}>{lastRep.porcentajeTarea ? lastRep.porcentajeTarea.toFixed(2) + '% ACUMULADO' : ''}</b></div>
                        })}
                        {lastReportes.length === 0 && "No hay reportes anteriores"}
                    </div>
                </div>
                <div style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '1.1em' }}>
                    {tarea.nombre}
                </div>
                {page === 0 &&
                    <div className={'m-t-15'}>
                        {/*<b>¿{editReporte.unidad ? ("Cuántas " + (tarea.unidad || 'unidades se han')) : 'Qué porcentaje se ha'} ejecutado?</b>*/}
                        <b>¿Cuánto se ha ejecutado?</b>
                        {/*{!editReporte._id && <p>Total ejecutado actualmente: {tarea.medicionActual + ', ' + tarea.porcentajeActual + '%'}</p>}*/}
                        {/*{!editReporte._id && <p>Total ejecutado tras reporte: {diferenciaUnidades() + ', ' + diferenciaPorcentaje() + '%'}</p>}*/}
                        <form>
                            <div className="form-group">
                                <div className="row m-t-15">
                                    <div className="col-xs-4">
                                        <div className={"form-group form-group-default" + (errors.numero.length > 0 ? " has-error" : "") + (tipoReporte === 'problema' ? ' disabled' : '')}>
                                            <label>Cantidad</label>
                                            <input disabled={tipoReporte === 'problema'} value={editReporte.numero} onBlur={handleBlurReporte('numero')} onChange={handleChangesReporte('numero')} type="number" className="form-control" />
                                            {errors.numero.length > 0 && <label id="numero-error" className="error" htmlFor="numero">{errors.numero}</label>}
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className={'radio radio-success'} style={{ display: 'flex', flexDirection: 'column', marginTop: '0' }}>
                                            <input value={'perc'} id="perc" disabled={editReporte._id || tipoReporte === 'problema'} type="radio" checked={editReporte.porcentaje} onChange={handleUnidadPorcentaje('porcentaje')} />
                                            <label htmlFor={'perc'}>Porcentaje</label>
                                            <input value={'unit'} id="unit" disabled={editReporte._id || tipoReporte === 'problema'} type="radio" checked={editReporte.unidad} onChange={handleUnidadPorcentaje('unidad')} />
                                            <label htmlFor={'unit'}>Unidad</label>
                                        </div>
                                    </div>
                                    <div className={'col-xs-4'}>
                                        <div className={"form-group form-group-default disabled"}>
                                            <label>Acumulado</label>
                                            <input disabled value={diferenciaPorcentaje() + '%'} onBlur={handleBlurReporte('numero')} onChange={handleChangesReporte('numero')} type="text" className="form-control" />
                                        </div>
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className="col-sm-12">
                                        <div >
                                            {hasPermission("CMR") && <div className={'checkbox check-success'}>
                                                <input value={'completar'} id="completar" disabled={editReporte._id} type="checkbox" checked={editReporte.completar} onChange={handleCompleteTask} />
                                                <label htmlFor={'completar'}>Dar por completada la partida</label>
                                            </div>}
                                            {hasPermission("PR") && <div className={'checkbox check-danger'}>
                                                <input value={'problema'} id="problema" disabled={!!editReporte._id} type="checkbox" checked={tipoReporte === 'problema'} onChange={handleTipoReporte} />
                                                <label htmlFor={'problema'}>Comunicar problema</label>
                                            </div>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>}
                {
                    page === 1 && <div>
                        <div>
                            <b>¿Desea adjuntar archivo o comentario?</b>
                            <input type={'file'} id={'files-pedido'} style={{ display: 'none' }} onChange={handleImages} multiple />
                            <label htmlFor={'files-pedido'}>
                                <span type={'button'} className={'btn btn-info m-l-15'}><i className={'fas fa-file-upload'} /></span>
                            </label>
                        </div>

                        <div className={'form-group form-group-default'}>
                            <label>Comentario</label>
                            <textarea className={'form-control' + (errors.descripcion.length > 0 ? " has-error" : "")} value={editReporte.descripcion}
                                onBlur={handleBlurReporte('descripcion')}
                                onChange={handleChangesReporte('descripcion')} />
                            {errors.descripcion.length > 0 && <label id="descripcion-error" className="error" htmlFor="descripcion">{errors.descripcion}</label>}
                        </div>
                        {
                            editReporte._id && editReporte.files && editReporte.files.length > 0 && <div className={'m-b-15'} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                {editReporte.files.map((file, i) => {
                                    return <React.Fragment>
                                        <i className={'fa fa-times close-icon'} onClick={handleRemoveFile(file)} />
                                        <img key={i} style={{ objectFit: 'contain' }} className={'m-r-15'} src={API_URL + '/' + (file)} alt={'previsualizacion fichero'} onError={(e) => e.target.src = documento} width={150} height={100} />
                                    </React.Fragment>
                                })}
                            </div>
                        }
                        {
                            files.length > 0 && <div className={'m-b-15'} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                {files.map((file, i) => {
                                    return <div style={{ position: 'relative', marginRight: '15px', marginBottom: '15px' }} key={i}>
                                        <i className={'fa fa-times close-icon'} onClick={() => handleXFiles(i)} />
                                        <img style={{ objectFit: 'contain' }} src={URL.createObjectURL(file)} alt={'previsualizacion fichero'} onError={(e) => e.target.src = documento} width={150} height={100} />
                                    </div>
                                })}
                            </div>
                        }
                    </div>
                }
            </div >
            <div className={'modal-footer'} style={page === 1 ? { backgroundColor: 'var(--main-color)' } : { backgroundColor: 'var(--verde-agua)' }}>
                {
                    page === 1 && <div className={'cancel-container'}>
                        <div onClick={() => setPage(0)} className={'continue-row'} style={{ cursor: 'pointer' }}><i className={'fa fa-arrow-left'} /><span>Atrás</span> </div>
                    </div>
                }
                <div style={page === 0 ? { backgroundColor: 'var(--main-color)' } : { backgroundColor: 'var(--verde-agua)' }}>
                    {
                        page === 0 &&
                        <div onClick={handleSiguiente} className={'continue-row'} style={{ cursor: 'pointer' }}><span>Continuar</span> <i className={'fa fa-arrow-right'} /></div>
                    }
                    {
                        page === 1 &&
                        <React.Fragment>
                            <div>
                                <button onClick={handleReportar} className="qr-btn confirm-btn">Confirmar</button>
                            </div>
                        </React.Fragment>
                    }
                </div>
            </div>
        </React.Fragment>
    )
}
