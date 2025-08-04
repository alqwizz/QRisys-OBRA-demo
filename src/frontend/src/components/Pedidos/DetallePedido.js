import React, { useState, useEffect } from 'react';
import { TablaAdquisicionesPedidos } from '../Adquisiciones/Tablas/TablaAdquisicionesPedidos';
import QRCode from 'qrcode.react'
import { QRGenerator as QRGeneratorAdquisicion } from '../../utils/Adquisiciones/QR/QR'
import { aceptar, rechazar, anular, acopiar, usar, entregarMaquina, sendPhotoReporte } from '../../utils/PedidosUtils'
import { API_URL } from "../../config/config";
import documento from '../../assets/img/document.svg';
import useGlobal from "../../store/store";
import {QRGenerator} from "../../utils/Pedido/QR/QR";
import './DetallePedido.css';
export function DetallePedido({ pedido, open, close, QR }) {

    const [openQRAdquisicion, setOpenQRAdquisicion] = useState(false);
    const [viewingAdquisicion, setViewingAdquisicion] = useState(null);
    const [confirmandoRecibir, setConfirmandoRecibir] = useState(0);//0 boton normal, 1 pidiendo confirmacion, 2 confirmado.
    const [confirmandoRechazar, setConfirmandoRechazar] = useState(0);
    const [confirmandoAnular, setConfirmandoAnular] = useState(0);
    const [confirmandoAcopiar, setConfirmandoAcopiar] = useState(0);
    const [confirmandoUsar, setConfirmandoUsar] = useState(0);
    const [confirmandoEntregar, setConfirmandoEntregar] = useState(0);
    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    const [reporte, setReporte] = useState(null);

    const getTotal = () => {
        let res = 0;
        pedido.adquisiciones.forEach(adq => {
            res += adq.precio * adq.cantidad;
        });
        return res;
    };

    useEffect(() => {
        if (!open) {
            setViewingAdquisicion(null);
            setOpenQRAdquisicion(false);
            setConfirmandoRechazar(0)
            setConfirmandoRecibir(0)
            setConfirmandoEntregar(0)
            setConfirmandoUsar(0)
            setConfirmandoAcopiar(0)
            setConfirmandoAnular(0)
        }
    }, [open])
    const showEstado = (estado) => {
        //enum: ['ENTREGADO', 'RECHAZADO', 'ACOPIADO', 'EN USO', 'PENDIENTE', 'ANULADO']
        switch (estado) {
            case 'PENDIENTE':
                return 'Pendiente';
            case 'ENTREGADO':
                return 'Entregado';
            case 'RECHAZADO':
                return 'Rechazado';
            case 'ACOPIADO':
                return 'Acopiado';
            case 'EN USO':
                return 'En uso'
            case 'ANULADO':
                return 'Anulado';
            default:
                return 'Estado inválido'

        }
    };

    const handleAcopiarAdquisicion = () => {
        setConfirmandoAcopiar(1);
    };

    const handleConfirmarAcopiarAdquisicion = () => {
        acopiar(pedido._id).then(res => {
            if (res.data.status === 200) {
                setConfirmandoAcopiar(0);
                if(!QR) close();
                if(QR) window.location.reload();
            }
        })
    }
    const handleCancelarAcopiarAdquisicion = () => {
        setConfirmandoAcopiar(0);
    };
    const handleConfirmarUsar = () => {
        usar(pedido._id, viewingAdquisicion._id).then(res => {
            if (res.data.status === 200) {
                setConfirmandoUsar(2);
            }
        })
    };
    const handleCancelarUsar = () => {
        setConfirmandoUsar(0);
    };

    const handleBackAdquisicionQR = () => {
        if (openQRAdquisicion) setOpenQRAdquisicion(false);
        if (viewingAdquisicion) setViewingAdquisicion(null);
    };

    /*---- RECIBIR PEDIDO ----*/
    const handleRecibir = () => {
        setConfirmandoRecibir(1);
        setReporte({ tipo: 'recibir', comentario: '', files: [] });
    };
    const handleConfirmarRecibir = () => {
        aceptar(pedido._id, reporte.comentario).then(res => {
            if (res.data.status === 200) {
                if (reporte.tipo === 'recibir' && reporte.files.length > 0) {
                    let promises = [];
                    reporte.files.forEach(file => {
                        const data = new FormData();
                        data.append('file', file);
                        promises.push(sendPhotoReporte(pedido._id, data, reporte.tipo));
                    });
                    Promise.all(promises).then(values => {
                        setConfirmandoRecibir(2);
                        if (QR) {
                            window.location.reload();
                        }
                    }).catch(e => window.alert('error al recibir el pedido'));
                }
                setConfirmandoRecibir(2);
                if (QR) {
                    window.location.reload();
                }
            }
        });
    };

    const handleCancelarRecibir = () => {
        setConfirmandoRecibir(0);
        setReporte(null);
    };

    /*---- RECHAZAR PEDIDO ----*/
    const handleRechazar = () => {
        setConfirmandoRechazar(1);
        setReporte({ tipo: 'rechazar', comentario: '', files: [] });
    };

    const handleConfirmarRechazar = () => {
        rechazar(pedido._id, reporte.comentario).then(res => {
            if (res.data.status === 200) {
                if (reporte.tipo === 'rechazar' && reporte.files.length > 0) {
                    let promises = [];
                    reporte.files.forEach(file => {
                        const data = new FormData();
                        data.append('file', file);
                        promises.push(sendPhotoReporte(pedido._id, data, reporte.tipo));
                    });
                    Promise.all(promises).then(values => {
                        if (QR) {
                            window.location.reload();
                        }
                        setConfirmandoRechazar(2);
                    }).catch(e => window.alert('error al recibir el pedido'));
                }
                if (QR) {
                    window.location.reload();
                }
                setConfirmandoRechazar(2);
            }
        })
    };

    const handleCancelarRechazar = () => {
        setConfirmandoRechazar(0);
        setReporte(null);
    };

    /*---- ANULAR PEDIDO ----*/
    const handleAnular = () => {
        setConfirmandoAnular(1);
        setReporte({ tipo: 'anular', comentario: '', files: [] });
    };
    const handleConfirmarAnular = () => {
        anular(pedido._id).then(res => {
            if (res.data.status === 200) {
                if (reporte.tipo === 'anular' && reporte.files.length > 0) {
                    let promises = [];
                    reporte.files.forEach(file => {
                        const data = new FormData();
                        data.append('file', file);
                        promises.push(sendPhotoReporte(pedido._id, data, reporte.tipo));
                    });
                    Promise.all(promises).then(values => {
                        setConfirmandoAnular(2);
                        if (QR) {
                            window.location.reload();
                        }
                    }).catch(e => window.alert('error al recibir el pedido'));
                }
            }
            setConfirmandoAnular(2);
            if (QR) {
                window.location.reload();
            }
        })
    };
    const handleCancelarAnular = () => {
        setConfirmandoAnular(0);
        setReporte(null);
    };


    /*--- ADQUSICIONES ---*/

    const handleConfirmarEntregar = () => {
        entregarMaquina(pedido._id, viewingAdquisicion._id).then(res => {
            if (res.data.status === 200) {
                setConfirmandoEntregar(2);
            }
        })
    }
    const handleCancelarEntregar = () => {
        setConfirmandoEntregar(0);
    }
    const mostrarDetalle =
        confirmandoRecibir === 0
        && confirmandoRechazar === 0
        && confirmandoAnular === 0
        && confirmandoEntregar === 0
        && confirmandoUsar === 0
        && confirmandoAcopiar === 0;

    function hasMaterial(pedido) {
        let res = false;
        for (let i = 0; i < pedido.adquisiciones.length; i++) {
            if (pedido.adquisiciones[i].tipo === 'MATERIAL') {
                res = true;
                break;
            }
        }
        return res;
    }
    const handleClickQR = (adq) => {
        if (adq.tipo === 'MAQUINA') {
            setOpenQRAdquisicion(true);
            setViewingAdquisicion(adq);
        }
    };

    function getQrMaquinas(adq) {
        let container = [];
        for (let i = 0; i < adq.cantidad; i++)(
            container.push(
                <div key={'qr' + i} style={{ textAlign: 'center', fontSize: '.9em' }}>
                    <b>{adq.nombre} - {i + 1}</b><br />
                    {pedido && adq && <QRCode style={{ marginTop: '15px' }} value={QRGeneratorAdquisicion(pedido, adq, i)} />}
                </div>
            )
        )
        return container;
    }
    function handleXFiles(i) {
        let newFiles = [...reporte.files];
        newFiles.splice(i, 1);
        setReporte({ ...reporte, files: newFiles });
    }
    const handleClickCheck = () => {
        if(confirmandoRecibir === 1){
            handleConfirmarRecibir();
        }
        if(confirmandoRechazar === 1){
            handleConfirmarRechazar();
        }
        if(confirmandoAnular === 1){
            handleConfirmarAnular();
        }
        if(confirmandoAcopiar === 1){
            handleConfirmarAcopiarAdquisicion();
        }
    };

    const handleClickCancelar = () => {
        if(confirmandoRecibir === 1){
            handleCancelarRecibir();
        }
        if(confirmandoRechazar === 1){
            handleCancelarRechazar();
        }
        if(confirmandoAnular === 1){
            handleCancelarAnular();
        }
        if(confirmandoAcopiar === 1){
            handleCancelarAcopiarAdquisicion();
        }
    }
    return (
        <React.Fragment>
            <div className={'modal-body detalle-pedido'} style={QR ? {marginTop:'100px'} : {}}>
                <div className={'detalle-pedido--header'}>
                    <QRCode style={{width:'6em',height:'6em'}} value={QRGenerator(pedido)} />
                    <div className={'item'}>
                        <span>Nº Albarán</span>
                        <b>{pedido ? pedido._id : ''}</b>
                        <span>Nombre proveedor</span>
                        <b>{pedido && pedido.empresaSubcontrata ? pedido.empresaSubcontrata.nombre : ''}</b>
                    </div>
                    {
                        mostrarDetalle &&
                        <div className={'actions'}>
                            {hasPermission("AP") && pedido && pedido.estado === 'PENDIENTE' && <i className={'fa fa-ban'} onClick={handleAnular} style={{color:'var(--red)'}}/>}
                            <div>
                                {hasPermission("RRP") && pedido && pedido.estado === 'PENDIENTE' && <button className={'qr-btn fab-btn green'} onClick={handleRecibir}><i className="fas fa-check" /></button>}
                                {hasPermission("RRP") && pedido && pedido.estado === 'PENDIENTE' && <button className={'qr-btn fab-btn red'}  onClick={handleRechazar}><i className="fas fa-times" /></button>}
                                {pedido && pedido.estado === 'ENTREGADO' && hasMaterial(pedido) && <button onClick={handleAcopiarAdquisicion} className={'qr-btn blue'}><b>Acopiar</b></button>}
                            </div>
                        </div>
                    }
                </div>
                {mostrarDetalle && <div className={'detalle-pedido--detalle'} >
                    <div className={'detalle-info'}>
                        <div className={'item'}>
                            <span>Fecha esperada </span>
                            <b>{pedido.fechaEsperada ? new Date(pedido.fechaEsperada).toLocaleDateString() : 'Sin fecha esperada.'}</b>
                        </div>
                        <div className={'item'}>
                            <span>Estado</span>
                            <b>{pedido.estado}</b>
                        </div>
                        <div className={'item'}>
                            <span>Pagaré a</span>
                            <b>{pedido.pagare}</b>
                        </div>
                    </div>

                    {pedido && pedido.adquisiciones && pedido.adquisiciones.length > 0 && < React.Fragment >
                        {!openQRAdquisicion &&
                        <React.Fragment>
                            <b>Recursos del pedido</b><br/>
                            <div className={'row'} style={{margin:'15px 0'}}>
                                <div style={{overflow:'hidden'}}>
                                    <TablaAdquisicionesPedidos adquisiciones={pedido.adquisiciones} total={getTotal} pedido={pedido} handleClick={handleClickQR} />
                                </div>
                            </div>


                            {
                                ((pedido.description && pedido.description.solicitar !== '') || (pedido.files && pedido.files.solicitar.length > 0)) &&
                                <div className={'reportes-pedido'} style={{ backgroundColor: '#70adf91c', padding: '8px' }}>
                                    <h5 style={{ borderBottom: 'solid 1px', width: 'fit-content' }}>Fotos y documentos del pedido</h5>
                                    <div className={'files'}>
                                        {
                                            pedido.files && pedido.files.solicitar && pedido.files.solicitar.map((file, i) => {
                                                return <img key={i} src={API_URL + '/' + file} alt={'imagen del fichero'} style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain', margin: '8px' }} onError={(e) => e.target.src = documento} />
                                            })
                                        }
                                    </div>
                                    {
                                        pedido.description && pedido.description.solicitar &&
                                        <div className={'comment'}>
                                            <p><b>Comentario: </b>{pedido.description.solicitar}</p>
                                        </div>
                                    }
                                </div>
                            }
                            {
                                pedido.estado !== 'PENDIENTE' && ((pedido.description && ((pedido.description.recibir && pedido.description.recibir !== '') || (pedido.description.rechazar && pedido.description.rechazar !== ''))) || (pedido.files && (pedido.files.recibir.length > 0 || pedido.files.rechazar.length > 0))) &&
                                <div className={'reportes-pedido'} style={{ backgroundColor: '#f9e2701c', padding: '8px', marginTop: '15px' }}>
                                    <h5 style={{ borderBottom: 'solid 1px', width: 'fit-content' }}>Fotos y documentos del pedido al {pedido.estado === 'ENTREGADO' ? 'recibirlo' : 'rechazarlo'}</h5>
                                    <div className={'files'}>
                                        {
                                            pedido.files && pedido.files.recibir && pedido.files.recibir.map((file, i) => {
                                                return <img key={i} src={API_URL + '/' + file} alt={'imagen del fichero'} style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain', margin: '8px' }} onError={(e) => e.target.src = documento} />
                                            })
                                        }
                                        {
                                            pedido.files && pedido.files.rechazar && pedido.files.rechazar.map((file, i) => {
                                                return <img key={i} src={API_URL + '/' + file} alt={'imagen del fichero'} style={{ maxWidth: '200px', maxHeight: '100px', objectFit: 'contain', margin: '8px' }} onError={(e) => e.target.src = documento} />
                                            })
                                        }
                                    </div>
                                    {
                                        pedido.description && pedido.description.recibir &&
                                        <div className={'comment'}>
                                            <p><b>Comentario: </b>{pedido.description.recibir}</p>
                                        </div>
                                    }
                                    {
                                        pedido.description && pedido.description.rechazar &&
                                        <div className={'comment'}>
                                            <p><b>Comentario: </b>{pedido.description.rechazar}</p>
                                        </div>
                                    }
                                </div>
                            }
                        </React.Fragment>
                        }
                        {openQRAdquisicion && viewingAdquisicion && <div>
                            <button onClick={handleBackAdquisicionQR} className="btn btn-primary m-b-15"><b>Ver pedido completo</b></button>
                            <TablaAdquisicionesPedidos adquisiciones={[viewingAdquisicion]} pedido={pedido} />
                            <div style={{ display: 'flex', justifyContent: 'space-around', margin: '30px 0' }}>
                                {getQrMaquinas(viewingAdquisicion)}
                            </div>
                        </div>}
                    </React.Fragment>}
                </div>}
                {
                    (confirmandoRecibir === 1 || confirmandoRechazar === 1) && reporte && <div>
                        <div>
                            <b>¿Desea adjuntar alguna foto / fichero o comentario antes de terminar el proceso?</b>
                            <input type={'file'} id={'files-recibir'} style={{ display: 'none' }} onChange={(e) => setReporte({ ...reporte, files: [...reporte.files, e.target.files[0]] })} />
                            <label htmlFor={'files-recibir'}>
                                <span type={'button'} className={'btn btn-info m-l-15'}><i className={'fas fa-file-upload'} /></span>
                            </label>
                        </div>

                        <div className={'form-group form-group-default'}>
                            <label>Comentario</label>
                            <textarea className={'form-control'} value={reporte.comentario} onChange={(e) => setReporte({ ...reporte, comentario: e.target.value })} />
                        </div>
                        {
                            reporte.files.length > 0 &&
                            <div className={'m-b-15'} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                {reporte.files.map((file, i) => {
                                    return <div style={{ position: 'relative', marginRight: '15px' }} key={i}>
                                        <i className={'fa fa-times close-icon'} onClick={() => handleXFiles(i)} />
                                        <img style={{ objectFit: 'contain' }} src={URL.createObjectURL(file)} alt={'previsualizacion fichero'} onError={(e) => e.target.src = documento} width={150} height={100} />
                                    </div>
                                })}
                            </div>
                        }
                    </div>
                }
                {(confirmandoAnular === 1 || confirmandoAcopiar === 1) && <div style={{textAlign:'center',marginTop:'15px'}}>
                    <p>¿Está seguro que quiere <b>{confirmandoAnular === 1 ? 'anular' : 'acopiar'}</b> el pedido?</p>
                </div>}

                {confirmandoRecibir === 2 && <div><p>El pedido ha sido aceptado correctamente.</p></div>}
                {confirmandoRechazar === 2 && <div><p>El pedido ha sido rechazado correctamente.</p></div>}
                {confirmandoAnular === 2 && <div><p>El pedido ha sido anulado correctamente.</p></div>}

                {
                    confirmandoUsar === 1 && <div>
                        <p>Pulse en confirmar para usar el recurso "{viewingAdquisicion.adquisicion.nombre}".</p>
                        <button onClick={handleConfirmarUsar} className="btn btn-success m-r-15">Confirmar</button>
                        <button onClick={handleCancelarUsar} className="btn btn-danger">Cancelar</button>
                    </div>
                }
                {confirmandoUsar === 2 && <div><p>El recurso "{viewingAdquisicion.adquisicion.nombre}" está en uso.</p></div>}
                {
                    confirmandoEntregar === 1 && <div>
                        <p>Pulse en confirmar para entregar el recurso "{viewingAdquisicion.adquisicion.nombre}".</p>
                        <button onClick={handleConfirmarEntregar} className="btn btn-success m-r-15">Confirmar</button>
                        <button onClick={handleCancelarEntregar} className="btn btn-danger">Cancelar</button>
                    </div>
                }
                {confirmandoEntregar === 2 && <div><p>El recurso "{viewingAdquisicion.adquisicion.nombre}" ha sido entregada.</p></div>}
            </div >
            {
                !mostrarDetalle &&
                <div className={'modal-footer'} style={{ backgroundColor: 'var(--main-color)' }}>
                    {
                        (confirmandoRecibir === 1 || confirmandoRechazar === 1 || confirmandoAnular === 1 || confirmandoAcopiar === 1)  &&
                            <React.Fragment>
                                <div className={'cancel-container'}>
                                    <button onClick={handleClickCancelar} type={'button'} className="qr-btn confirm-btn" style={{padding: '8px 30px 8px 45px'}}>
                                        <i className={'fa fa-times'} style={{backgroundColor:'var(--red)',color:'white'}}/>
                                        <span>Cancelar</span>
                                    </button>
                                </div>
                                <div className={'buttons'} style={{ backgroundColor: 'var(--verde-agua)' }}>
                                    <button onClick={handleClickCheck} className="qr-btn confirm-btn" style={{padding: '8px 30px 8px 45px'}}>
                                        <i className={'fa fa-check'} style={{backgroundColor:'var(--verde-agua)',color:'white'}}/>
                                        <span>Confirmar</span>
                                    </button>

                                </div>
                            </React.Fragment>
                    }
                </div>
            }
        </React.Fragment>
    )
}
