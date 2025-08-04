import React from 'react'
import { makeButtons } from '../../TablaUtils'

export const makeBody = (tareas, buttons, open, handleOpen) => {
    return tareas && tareas.map(tarea => {
        return makeRow(tarea, buttons, open, handleOpen);
    })
}
export const showEstado = (estado) => {
    switch (estado) {
        case 'sin_iniciar':
            return 'Sin iniciar';
        case 'iniciado':
            return 'Iniciado';
        case 'completado':
            return 'Completado';
        case 'cerrado':
            return 'Cerrado';
        case 'cancelado':
            return 'Cancelado';
        default:
            return 'Estado erróneo. Editar tarea para reparar.'
    }
}
export const header = <tr role="row">
    <th>Acciones</th>
    <th>Código</th>
    <th>Nombre</th>
    <th>Estado</th>
    <th>Unidad</th>
    <th>Medición</th>
    <th>Presupuesto</th>
    <th>Coordenadas gps</th>
    <th>Medición actual</th>
    <th>Porcentaje actual</th>
    <th>Presupuesto actual</th>
    <th>Inicio</th>
    <th>Fin</th>
</tr>
export const makeRow = (tarea, buttons, open, handleOpen) => {
    const principalRow = row(tarea, buttons, open, handleOpen);
    let rowsBody = <tr key={"empty" + tarea._id} className="rowDetails empty"></tr>

    if (tarea.childrens && tarea.childrens.length > 0) {
        const rows = tarea.childrens.map(children => {
            return makeRow(children, buttons, open, handleOpen)
        })
        rowsBody = (<tr key={"tr" + tarea._id} className="row-details" style={{ display: open[tarea._id] ? '' : 'none' }}>
            <td colSpan="11">
                <table className="table table-condensed table-hover table-detailed dataTable no-footer">
                    <thead>
                        {header}
                    </thead>
                    <tbody>
                        {rows}
                    </tbody>
                </table>
            </td>
        </tr>)

    }
    return [principalRow, rowsBody]
}
export const row = (tarea, buttons, open, handleOpen) => {
    return (
        <tr key={tarea._id} onClick={handleOpen(tarea)} className={'odd' + (open ? (open[tarea._id] ? ' shown' : '') : '')}>
            <td>
                {makeButtons(tarea, buttons)}
            </td >
            <td className="v-align-middle">
                <p>{tarea.codigo}</p>
            </td>
            <td className="v-align-middle">
                <p>{tarea.nombre}</p>
            </td>
            <td className="v-align-middle">
                <p>{showEstado(tarea.estado)}</p>
            </td>
            <td className="v-align-middle">
                <p>{tarea.unidad}</p>
            </td>
            <td className="v-align-middle">
                <p>{tarea.medicion}</p>
            </td>
            <td className="v-align-middle">
                <p>{tarea.presupuesto}</p>
            </td>
            <td className="v-align-middle">
                <p>{tarea.coordenadasGPS}</p>
            </td>
            <td className="v-align-middle">
                <p>{tarea.medicionActual}</p>
            </td>
            <td className="v-align-middle">
                <p>{tarea.porcentajeActual ? tarea.porcentajeActual.toFixed(2) : ''}</p>
            </td>
            <td className="v-align-middle">
                <p>{tarea.presupuestoActual}</p>
            </td>
            <td className="v-align-middle">
                {tarea.fInicio && <p>{(new Date(tarea.fInicio)).toLocaleDateString()}</p>}
            </td>
            <td className="v-align-middle">
                {tarea.fFin && <p>{(new Date(tarea.fFin)).toLocaleDateString()}</p>}
            </td>
        </tr >)
}
