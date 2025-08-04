import React from 'react';
import { makeButtons } from '../../TablaUtils'
export const header = <tr role="row" >
    <th>
        Acciones
    </th>
    <th>Recurso</th>
    <th>Empresa subcontrata</th>
    <th>Precio</th>
    <th>Cantidad</th>
    <th>Fecha de recepción</th>
</tr>

export const makeBody = (pedidos, buttons) => {

    return pedidos.map(u => {
        return (
            <tr key={u._id} role="row" >
                <td className="v-align-middle">
                    {makeButtons(u, buttons)}
                </td>
                <td className="v-align-middle">
                    <p>{u.adquisicion && u.adquisicion.nombre}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.empresaSubcontrata && u.empresaSubcontrata.nombre}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.precio}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.cantidad}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.fechaRecepcion && (new Date(u.fechaRecepcion)).toLocaleDateString()}</p>
                </td>
            </tr>)
    })

}
