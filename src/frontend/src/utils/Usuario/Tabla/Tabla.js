import React from 'react';
import { makeButtons } from '../../TablaUtils'

export const header = <tr role="row">
    <th>Acciones</th>
    <th>Nombre</th>
    <th>Apellidos</th>
    <th>Nombre de usuario</th>
    <th>Email</th>
    <th>Teléfono</th>
</tr>

export const makeBody = (usuarios, buttons) => {
    return usuarios.map(u => {
        return (
            <tr key={u._id} role="row">
                <td className="v-align-middle" style={{display:'flex',justifyContent:'center'}}>
                    {makeButtons(u, buttons)}
                </td>
                <td className="v-align-middle sorting_1">
                    <p>{u.nombre}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.apellidos}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.username}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.email}</p>
                </td>
                <td className="v-align-middle">
                    <p>{u.telefono}</p>
                </td>
            </tr>)
    })
}
