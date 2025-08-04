import React from 'react';
import { makeButtons } from '../../TablaUtils'

export const header = <tr role="row">
    <th>Recurso</th>
    <th>Cantidad</th>
    <th>Unidad</th>
    <th>Precio un.</th>
    <th>Precio total</th>
</tr>

export const makeBody = (adquisiciones) => {
    return adquisiciones.map(u => {
        return (
            <tr key={u._id} role="row" >
                <td className="v-align-middle sorting_1">
                    <p style={{width:'15ch'}}>{u.nombre}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.cantidad}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.unidad}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.precio}</p>
                </td>
                <td className="v-align-middle">
                    <p>{(u.cantidad * u.precio).toFixed(2)}</p>
                </td>
            </tr>)
    })
}
