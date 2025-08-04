import React from 'react';
import { marcarLeido } from '../../utils/AvisosUtils';
const formatedFecha = fecha => {
    const date = new Date(fecha);
    const day = (date.getDate() + '').length === 1 ? ('0' + date.getDate()) : date.getDate();
    const month = ((date.getMonth() + 1) + '').length === 1 ? ('0' + (date.getMonth() + 1)) : (date.getMonth() + 1);
    const year = (date.getFullYear() + '').length === 1 ? ('0' + date.getFullYear()) : date.getFullYear();
    return day + '/' + month + '/' + year;
}
const formatedHora = fecha => {
    const date = new Date(fecha);
    const hora = (date.getHours() + '').length === 1 ? ('0' + date.getHours()) : date.getHours();
    const minute = (date.getMinutes() + '').length === 1 ? ('0' + date.getMinutes()) : date.getMinutes();
    return hora + ':' + minute;
}
export function DetalleAviso({ aviso, leido = false, close }) {

    if (!aviso || !aviso._id) return <div />
    const handleLeido = () => {
        marcarLeido(aviso._id).then(res => {
            if (close) close(aviso)
        })
    }
    return <div className={'modal-body'}>
        <b style={{ fontSize: '1.5em', textTransform: 'uppercase' }}>{aviso.titulo}</b>
        <p>{aviso.descripcion}</p>
        <p>{formatedFecha(aviso.fecha)}</p>
        <p>{formatedHora(aviso.fecha)}</p>
        {leido && <button onClick={handleLeido} className="btn">Marcar como leído</button>}
    </div>
}
