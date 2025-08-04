import React, { useState, useEffect } from 'react';
import { formatDate } from "../../utils/FormsUtils";
import Certificacion from "../../entidades/Certificacion";
import { getAllCertificaciones, generateCertificacion, createCert, validateCert, exportCertificacion } from "../../utils/CertificacionUtils";
import TableTareas from "../Tareas/Tablas/TablaTareas";

export default function Certificaciones({ proyecto }) {
    const [certificaciones, setCertificaciones] = useState([]);
    const [actualCertificacion, setActualCertificacion] = useState(new Certificacion());
    const [errorFechas, setErrorFechas] = useState(false);
    const [errorSobreCoste, setErrorSobreCoste] = useState(false);
    const [errorNombre, setErrorNombre] = useState(false);
    const [certGenerated, setCertGenerated] = useState(false);

    const [cargar, setCargar] = useState(false);

    const handleGenerate = () => {
        if (validateFechas() && validateSobreCoste()) {
            generateCertificacion(actualCertificacion.fInicio, actualCertificacion.fFin, actualCertificacion.sobreCoste, proyecto._id).then(res => {

                if (res.status === 200) {
                    setCertGenerated({ ...res.data.certificacion, nombre: actualCertificacion.nombre });
                } else {
                    window.error('Error generando certificacion')
                }
            }).catch(err => console.error(err));
        }
    };

    const handleChanges = (prop) => (e) => {
        setActualCertificacion({ ...actualCertificacion, [prop]: e.target.value });
    };

    const handleValidate = (id) => {
        validateCert(id).then((res) => {
            if (res.status === 200) {
                let oldCertificaciones = [...certificaciones];
                let index = -1;
                oldCertificaciones.filter((x, i) => {
                    if (x._id + '' === id) {
                        index = i;
                    }
                    return true;
                })
                if (index > 0) {
                    oldCertificaciones[index].validada = true;
                    setCertificaciones(oldCertificaciones)
                }
            } else {
                window.error('Ha ocurrido un error al validar la certificacion');
            }
        }).catch(err => console.error(err));
    };

    useEffect(() => {
        getAllCertificaciones(proyecto._id).then(res => {
            if (res.status === 200) {
                setCertificaciones(res.data.certificaciones);
            } else {
                window.error('ha ocurrido un error obteniendo las certificaciones');
            }
        }).catch(err => console.error(err));
    }, [cargar]);

    const validateFechas = () => {
        let res = true;
        if (actualCertificacion.fechaFin < actualCertificacion.fechaInicio) {
            setErrorFechas('Introduce un periodo válido.');
            res = false;
        }
        return res;
    };
    const validateSobreCoste = () => {
        let res = true;
        if (actualCertificacion.sobreCoste < 0) {
            setErrorSobreCoste('Introduce un sobrecoste válido.');
            res = false;
        }
        return res;
    };
    const handleCreate = () => {
        if (validateName() && certGenerated) {
            delete certGenerated['tareas'];
            certGenerated.validada = false;
            certGenerated.proyecto = proyecto._id;
            createCert(certGenerated).then(() => {
                setCargar(!cargar);
            })
        }
    };
    const handleExportar = () => {
        if (certGenerated) {
            certGenerated.validada = false;
            certGenerated.proyecto = proyecto._id;
            exportCertificacion(certGenerated).then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'CERTIFICACION.xlsx');
                document.body.appendChild(link);
                link.click();
                //link.remove();
            }).catch(err => console.error(err));
        }
    }

    const validateName = () => {
        let res = true;
        if (certGenerated.nombre.length < 1) {
            setErrorNombre('Introduce un nombre de certificación válido.');
            res = false;
        }
        return res;
    };

    return (
        <div>
            <h4 style={{fontWeight:'bold',textTransform:'uppercase',color:'#626262'}}>Certificaciones</h4>
            <div className={'cert-container'}>
                <div className={'cert-generate cert-section'}>
                    <div style={{ marginRight: '15px' }}>
                        <div className={'cert-cont--title'}><b>Periodo a certificar</b>{errorFechas && <span className="error">{errorFechas}</span>}</div>
                        <div className={"form-group form-group-default" + (errorFechas ? " has-error" : "")}>
                            <label>Fecha inicio</label>
                            <input type="date" value={formatDate(actualCertificacion.fInicio)} onChange={handleChanges('fInicio')} className="form-control" />
                        </div>
                        <div className={"form-group form-group-default" + (errorFechas ? " has-error" : "")}>
                            <label>Fecha Fin</label>
                            <input type="date" value={formatDate(actualCertificacion.fFin)} onChange={handleChanges('fFin')} className="form-control" />
                        </div>
                        <button className={'qr-btn green'} onClick={handleGenerate}><b style={{ color: 'white' }}>Aceptar</b></button>
                    </div>
                    <div>
                        <div className={'cert-cont--title'}><b>Sobrecoste acordado</b></div>
                        <div className={"form-group form-group-default" + (errorFechas ? " has-error" : "")}>
                            <label>Cantidad</label>
                            <input type="number" value={actualCertificacion.sobreCoste} onChange={handleChanges('sobreCoste')} className="form-control" id={'sobrecoste'} />
                            {errorSobreCoste && <label htmlFor={'sobrecoste'} className={'error'}>{errorSobreCoste}</label>}
                        </div>
                    </div>
                </div>
                <div className={'cert-resume cert-section'}>
                    <div className={'cert-cont--title'}><b>Resumen certificación</b></div>
                    {certGenerated ? <div className={'cert-resume--table'}>
                            <div>
                                <span>Fecha Inicio</span>
                                <span>{new Date(certGenerated.fInicio).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span>Fecha Fin</span>
                                <span>{new Date(certGenerated.fFin).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span>%</span>
                                <span>{(+certGenerated.perCert).toFixed(2)}</span>
                            </div>
                            <div>
                                <span>Coste</span>
                                <span>{(+certGenerated.costeCert).toFixed(2)}</span>
                            </div>
                            <div>
                                <span>% total</span>
                                <span>{(+certGenerated.perTotal).toFixed(2)}</span>
                            </div>
                            <div>
                                <span>Coste total</span>
                                <span>{(+certGenerated.costeTotal).toFixed(2)}</span>
                            </div>
                        </div>
                        :
                        <div><b>No se ha generado aún ninguna certificación.</b></div>}

                    <div className={"form-group form-group-default" + (errorNombre ? " has-error" : "")} style={{ width: '200px', margin: '15px 0' }}>
                        <label>Nombre certificación</label>
                        <input type="text" value={certGenerated.nombre} onChange={(e) => { setCertGenerated({ ...certGenerated, nombre: e.target.value }) }} disabled={!certGenerated} className="form-control" id={'sobrecoste'} />
                        {errorNombre && <label htmlFor={'sobrecoste'} className={'error'}>{errorNombre}</label>}
                    </div>
                    <div>
                        <button className={'qr-btn blue'} style={{ marginRight: '8px' }} disabled={!certGenerated} onClick={handleCreate}><b>Guardar</b></button>
                        <button className={'qr-btn green'} disabled={!certGenerated} onClick={handleExportar}><b style={{ color: 'white' }}>Exportar</b></button>
                    </div>
                </div>
                <div className={'cert-history cert-section'}>
                    {certificaciones.length > 0 ?
                        <table>
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Inicio</th>
                                <th>Fin</th>
                                <th>%</th>
                                <th>coste</th>
                                <th>sobrecoste</th>
                                <th>% Total</th>
                                <th>Validar</th>
                            </tr>
                            </thead>
                            <tbody>
                            {certificaciones.map((cert) => {
                                return <tr>
                                    <td>{cert.nombre}</td>
                                    <td>{new Date(cert.fInicio).toLocaleDateString()}</td>
                                    <td>{new Date(cert.fFin).toLocaleDateString()}</td>
                                    <td>{(+cert.perCert).toFixed(2)}</td>
                                    <td>{(+cert.costeCert).toFixed(2)}</td>
                                    <td>{(+cert.sobreCoste).toFixed(2)}</td>
                                    <td>{(+cert.perTotal).toFixed(2)}</td>
                                    <td><div className={'radio radio-success'} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0' }}>
                                        <input id={cert._id} disabled={cert.validada} type="radio" checked={cert.validada} />
                                        <label onClick={() => handleValidate(cert._id)} htmlFor={'perc'} style={{ width: '0px', padding: '0', margin: '0' }}></label>
                                    </div></td></tr>
                            })}
                            </tbody>
                        </table>
                        :
                        <b>No hay certificaciones guardadas.</b>}

                </div>
                <div className={'cert-tasks cert-section'}>
                    {certGenerated && certGenerated.tareas && certGenerated.tareas.length > 0 &&
                    <TableTareas tareas={certGenerated.tareas} certificacion={true} />
                    }
                    {certGenerated && certGenerated.tareas && certGenerated.tareas.length < 1 && <b>No se han encontrado tareas con fecha de fin entre las fechas seleccionadas.</b>}
                </div>

            </div>
        </div>
    )
}
