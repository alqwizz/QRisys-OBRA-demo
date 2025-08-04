import React from 'react';
import { makeButtons } from '../../TablaUtils'

export const header = <tr role="row">
    <th>Acciones </th>
    <th>Título </th>
    <th>Descripción </th>
    <th>Autor </th>
    <th>Fecha programada </th>
</tr>

export const makeBody = (usuarios, buttons) => {
    return usuarios.map(u => {
        return (
            <tr key={u._id} role="row">
                <td className="v-align-middle">
                    {makeButtons(u, buttons)}
                </td>
                <td className="v-align-middle sorting_1">
                    <p>{u.titulo}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.descripcion}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.autor}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.dia + '/' + u.mes + '/' + u.year}</p>
                </td>
            </tr>)
    })
}