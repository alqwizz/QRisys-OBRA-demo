import React from 'react'
import { Tabla } from '../../Tablas/Tabla/Tabla';
import {makeButtons} from "../../../utils/TablaUtils";

export function TablaProyecto({ proyectos, buttons }) {

    const showEstado = (estado) => {
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
                return 'Estado erróneo. Editar proyecto para reparar.'
        }
    }

    const header = <tr role="row" >
        <th>Nombre</th>
        <th>Estado</th>
        <th>Acciones</th>
    </tr>;

    const makeBody = (proyectos, buttons) => {

        return proyectos.map(u => {
            return (
                <tr key={u._id} role="row">
                    <td className="v-align-middle">
                        <p>{u.nombre}</p>
                    </td>
                    <td className="v-align-middle">
                        <p>{showEstado(u.estado)}</p>
                    </td>
                    <td className="v-align-middle actions">
                        {makeButtons(u, buttons)}
                    </td>
                </tr>)
        });
    }
    
    return (
        <Tabla head={header} body={makeBody(proyectos, buttons)} />
    )
}
