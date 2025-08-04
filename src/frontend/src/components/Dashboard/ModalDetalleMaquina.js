import React from 'react'
import { Modal } from '../Modal/Modal';
import QRCode from 'qrcode.react'
import { QRGenerator as QRGeneratorAdquisicion } from '../../utils/Adquisiciones/QR/QR'

function DetalleMaquina({ maquina, numeroMaquina }) {
    const getReportes = (maquina, numeroMaquina) => {
        const res = []
        if (maquina && maquina.reportes && maquina.reportes.length > 0) {
            const reportes = maquina.reportes.filter(x => x.numeroMaquina === numeroMaquina);

            return reportes;
        }
        return res;
    }
    const makeReportes = (reportes) => {
        let row = null;
        let prevReporte = null;
        const res = [];

        for (let i = 0; i < reportes.length; i++) {
            const reporte = reportes[i]
            if (reporte.estado === 'EN USO' && !prevReporte) {
                prevReporte = reporte;
                if (!(reportes.length > i + 1)) {
                    let fecha = getFecha(prevReporte.horaInicio)
                    let horaInicio = getHora(prevReporte.horaInicio)
                    row = <tr>
                        <td>{fecha}</td>
                        <td>{horaInicio}</td>
                        <td>-</td>
                        <td>1</td>
                    </tr>
                    res.push(row)
                }
            }
            if (prevReporte && prevReporte.estado === 'EN USO' && reporte.estado === 'ENTREGADO') {
                let fecha = getFecha(prevReporte.horaInicio)
                let horaInicio = getHora(prevReporte.horaInicio)
                let horaFin = getHora(reporte.horaInicio)
                row = <tr>
                    <td>{fecha}</td>
                    <td>{horaInicio}</td>
                    <td>{horaFin}</td>
                    <td>1</td>
                </tr>
                res.push(row);
                prevReporte = null;
            }
            if (prevReporte && prevReporte.estado === 'EN USO' && reporte.estado === 'PROBLEMA') {
                const nextReporte = reportes.length > i + 1 ? reportes[i + 1] : null;
                if (nextReporte && nextReporte.estado === 'EN USO') {
                    let fecha = getFecha(prevReporte.horaInicio)
                    let horaInicio = getHora(prevReporte.horaInicio)
                    let horaFin = getHora(reporte.horaInicio)
                    row = <tr>
                        <td>{fecha}</td>
                        <td>{horaInicio}</td>
                        <td>{horaFin}</td>
                        <td>1</td>
                    </tr>
                    res.push(row);
                    prevReporte = null;
                }
                if (nextReporte && nextReporte.estado === 'ENTREGADO') {
                    let fecha = getFecha(prevReporte.horaInicio)
                    let horaInicio = getHora(prevReporte.horaInicio)
                    let horaFin = getHora(nextReporte.horaInicio)
                    row = <tr>
                        <td>{fecha}</td>
                        <td>{horaInicio}</td>
                        <td>{horaFin}</td>
                        <td>1</td>
                    </tr>
                    res.push(row);
                    prevReporte = null;
                }
            }

        }
        if (res.length === 0)
            res.push(<tr><td colSpan={4}><b>El recurso no ha sido utilizado.</b></td></tr>)
        return res;
    }
    const getFecha = (fecha) => {
        if (fecha) {
            const date = new Date(fecha);
            const month = date.getMonth() + 1
            const day = date.getDate()
            const year = date.getFullYear();
            return day + "/" + month + "/" + year;
        }
        return '';
    }
    const getHora = (fecha) => {
        if (fecha) {
            const date = new Date(fecha);
            let hour = date.getHours()
            hour = hour < 10 ? '0' + hour : hour
            let minutes = date.getMinutes()
            minutes = minutes < 10 ? '0' + minutes : minutes
            return hour + ':' + minutes
        }
        return '';
    }

    if (maquina && maquina._id)
        return <div className={'modal-body maquina-modal--map'}>
            <div className={'maquina-info--modal'}>
                <div>
                    <b>RECURSO {"PROPIO"}</b>
                    <div>
                        <span>Estado actual:</span>
                        <b style={!maquina.estadosMaquinas ? {} : maquina.estadosMaquinas[numeroMaquina] === 'EN USO' ? { color: 'rgb(113,115,174)' } : (maquina.estadosMaquinas[numeroMaquina] === 'ENTREGADO' ? { color: 'rgb(113,175,113)' } : (maquina.estadosMaquinas[numeroMaquina] === 'PROBLEMA' ? { color: 'rgb(175,113,175)' } : {}))}>
                            {maquina && maquina.estadosMaquinas && maquina.estadosMaquinas[numeroMaquina]}</b>
                    </div>
                </div>
                <QRCode value={QRGeneratorAdquisicion(maquina.pedido, maquina._id, numeroMaquina)} style={{ height: '100px', width: '100px', justifySelf: 'end' }} />
            </div>
            <div className={'maquina-historial--modal'}>
                <b style={{ padding: '4px', borderBottom: 'solid 1px var(--main-color)' }}>HISTORIAL DE USO</b>

                <table style={{ width: '100%', marginTop: '15px' }}>
                    <thead>
                        <tr>
                            <th>FECHA</th><th>HORA INICIO</th><th>HORA FIN</th><th>COSTE</th>
                        </tr>
                    </thead>
                    <tbody>
                        {makeReportes(getReportes(maquina, numeroMaquina))}
                    </tbody>
                </table>
            </div>
        </div>
    return <div />
}

export function ModalDetalleMaquina({ maquina, numeroMaquina, modalOpen, setModalOpen }) {
    const header = maquina && maquina.nombre;
    //const subHeader = "Introduzca los datos del recurso."
    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            alone
            body={<DetalleMaquina maquina={maquina} numeroMaquina={numeroMaquina} />} />
    )
}
