import React from 'react';
import { Tabla } from '../../Tablas/Tabla/Tabla';
import { header, makeBody } from '../../../utils/Adquisiciones/Tabla/Tabla'
export function TablaAdquisiciones({ adquisiciones }) {

    return (
        <Tabla head={header} body={makeBody(adquisiciones)} />
    )
}
