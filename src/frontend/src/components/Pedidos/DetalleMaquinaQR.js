import React, { useEffect, useState } from 'react';
import { usar, entregarMaquina, reportarProblemaMaquina, sendPhotoProblemaAdquisicion } from '../../utils/PedidosUtils'
import { QRGenerator as QRGeneratorAdquisicion } from '../../utils/Adquisiciones/QR/QR'
import documento from "../../assets/img/document.svg";
import QRCode from 'qrcode.react'
import { formatDateHour } from '../../utils/FormsUtils'

export function DetalleMaquinaQR({ maquina, idPedido, number }) {
    const [mensaje, setMensaje] = useState(null)
    const [nuevoEstado, setNuevoEstado] = useState(null)
    const [esProblema, setEsProblema] = useState(false);
    const [descripcion, setDescripcion] = useState('');
    const [geolocalizacion, setGeolocalizacion] = useState(null)
    const [files, setFiles] = useState([])
    const [confirmando, setConfirmando] = useState(false)
    const [usando, setUsando] = useState(false);

    useEffect(() => {
        if (maquina && idPedido) {
            setEsProblema(false)
            setMensaje(null)
            setDescripcion('');
            navigator.geolocation.getCurrentPosition(function (position) {
                const geo = { lat: position.coords.latitude, lng: position.coords.longitude }
                setGeolocalizacion(geo);
                if (maquina.estadosMaquinas[number] === "ENTREGADO") {
                    usar(idPedido, maquina._id, geo, number).then(res => {
                        setMensaje(res.data.mensaje)
                        setNuevoEstado("EN USO")
                    })
                }
            }, function (error) {
                if (maquina.estadosMaquinas[number] === "ENTREGADO") {
                    usar(idPedido, maquina._id, null, number).then(res => {
                        setMensaje(res.data.mensaje)
                        setNuevoEstado("EN USO")
                    })
                }
                //setMensaje("No ha sido posible calcular su localización. Por favor, configure su dispositivo correctamente e inténtelo de nuevo.");
            });
        }
    }, [maquina, idPedido, number])
    const handleImages = (event) => {
        let eventFiles = event.target.files;
        let newFiles = [...files];
        for (let i = 0; i < eventFiles.length; i++) {
            newFiles.push(eventFiles[i]);
        }
        setFiles(newFiles);
    };
    const handleConfirmar = () => {
        if (!esProblema) {
            //ENTREGAR
            entregarMaquina(idPedido, maquina._id, geolocalizacion, number).then(res => {
                setMensaje(res.data.mensaje)
                setNuevoEstado("ENTREGADO")
            })
        } else {
            reportarProblemaMaquina(idPedido, maquina._id, geolocalizacion, number, descripcion).then(res => {
                if (files.length > 0) {
                    let p = []
                    for (let i = 0; i < files.length; i++) {
                        const data = new FormData()
                        data.append('file', files[i])
                        p.push(sendPhotoProblemaAdquisicion(idPedido, maquina._id, data))
                    }
                    Promise.all(p).then(values => {
                        setMensaje(res.data.mensaje);
                        setNuevoEstado("PROBLEMA")
                    })
                } else
                    setMensaje(res.data.mensaje);
                setNuevoEstado("PROBLEMA")
            })

        }
    }
    const handleConfirmar2 = () => {
        if (usando) {
            usar(idPedido, maquina._id, geolocalizacion, number).then(res => {
                setMensaje(res.data.mensaje)
            })
        } else {
            entregarMaquina(idPedido, maquina._id, geolocalizacion, number).then(res => {
                setMensaje(res.data.mensaje)
            })
        }
    }
    const getHoraInicio = () => {
        if (maquina) {
            for (let i = maquina.reportes.length - 1; i >= 0; i--) {
                const reporte = maquina.reportes[i];
                if (reporte.numeroMaquina === number && reporte.estado === 'EN USO')
                    return formatDateHour(reporte.horaInicio);
            }
        }
        return '';
    }
    const getColor = (estado) => {
        if (estado === 'PROBLEMA')
            return { color: 'red' }
        else return { color: 'green' }
    }
    console.log('hola que pasa')
    if (maquina && idPedido) {
        return <div>
            <div>
                <QRCode value={QRGeneratorAdquisicion(idPedido, maquina, number)} />
                <h3> {maquina.nombre}</h3>
                <p style={getColor(maquina.estadosMaquinas[number])}><b>{maquina.estadosMaquinas[number]}</b>{nuevoEstado && <span> => <b style={{ color: 'orange' }}>{nuevoEstado}</b></span>}</p>
                {maquina.estadosMaquinas[number] === "EN USO" && <p>Hora inicio: <b>{getHoraInicio()}</b></p>}
            </div>
            {
                maquina.estadosMaquinas[number] === "ENTREGADO" && mensaje &&
                < p > {mensaje}</p >
            }

            {maquina.estadosMaquinas[number] === "EN USO" && mensaje &&
                <p>{mensaje}</p>
            }
            {maquina.estadosMaquinas[number] === "EN USO" && !mensaje &&
                <div>
                    {!confirmando && <div >
                        <p>Seleccione una acción:</p>
                        <div className={'radio radio-success'}>
                            <input id="entregar" onChange={() => { setEsProblema(false) }} checked={!esProblema} type="radio" name="entregar" value="entregar" />
                            <label htmlFor="entregar"><b>ENTREGAR</b></label>
                        </div>
                        <div className={'radio radio-danger'}>
                            <input id="problema" onChange={() => { setEsProblema(true) }} checked={esProblema} type="radio" name="problema" value="problema" />
                            <label htmlFor="problema"><b>REPORTAR PROBLEMA</b></label>
                        </div>

                        {esProblema && <form>
                            <div className={'row'}>
                                <div>
                                    <b>¿Desea adjuntar alguna foto / fichero o comentario antes de terminar el proceso?</b>
                                    <input type={'file'} id={'files-pedido'} style={{ display: 'none' }} onChange={handleImages} multiple />
                                    <label htmlFor={'files-pedido'}>
                                        <span type={'button'} className={'btn btn-info m-l-15'}><i className={'fas fa-file-upload'} /></span>
                                    </label>
                                </div>

                                <div className={'form-group form-group-default'}>
                                    <label>Comentario</label>
                                    <textarea className={'form-control'} value={descripcion} onChange={(event) => setDescripcion(event.target.value)} />
                                </div>
                                {
                                    files.length > 0 && <div className={'m-b-15'} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                        {files.map((file, i) => { return <img key={i} style={{ objectFit: 'contain' }} className={'m-r-15'} src={URL.createObjectURL(file)} alt={'previsualizacion fichero'} onError={(e) => e.target.src = documento} width={150} height={100} /> })}
                                    </div>
                                }
                            </div>
                        </form>}
                    </div>}
                    {!confirmando && <button onClick={() => { setConfirmando(true) }} className="btn btn-success m-t-15">Aceptar</button>}
                    {confirmando && <div>
                        {esProblema && <p>Se va a reportar un problema en el recurso.</p>}
                        {!esProblema && <p>Se va a marcar el recurso como "ENTREGADO".</p>}
                        <button onClick={handleConfirmar} className="btn btn-success m-t-15">Confirmar</button>
                        <button onClick={() => { setConfirmando(false) }} className="btn btn-danger m-l-30 m-t-15">Cancelar</button>
                    </div>}
                </div>}
            {maquina.estadosMaquinas[number] === "PROBLEMA" && <div>
                {!confirmando && <p> {'Se ha indicado que la máquina "' + maquina.nombre + '" tiene un problema.'}</p>}
                {
                    !confirmando && <button onClick={() => {
                        setUsando(true)
                        setConfirmando(true)
                    }} className="btn btn-success m-t-15">Usar</button>
                }
                {
                    !confirmando && <button onClick={() => {
                        setUsando(false)
                        setConfirmando(true)
                    }} className="btn btn-primary m-l-30 m-t-15">Entregar</button>
                }
                {confirmando && !mensaje && < p > Se va a marcar la máquina {' "' + maquina.nombre + '" '} como {usando ? '"EN USO"' : '"ENTREGADO"'}. </p>}
                {confirmando && !mensaje && <button onClick={handleConfirmar2} className="btn btn-success m-t-15">Confirmar</button>}
                {confirmando && !mensaje && <button onClick={() => { setConfirmando(false) }} className="btn btn-danger m-l-30 m-t-15">Cancelar</button>}
                {confirmando && mensaje && <p>{mensaje}</p>}
            </div >
            }
        </div>
    }
    return <div />
}