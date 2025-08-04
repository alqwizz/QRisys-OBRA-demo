import React from 'react';
import { Tabla } from '../../Tablas/Tabla/Tabla';
import { header, makeBody } from '../../../utils/Avisos/Tabla/Tabla';


export function TablaAviso({ avisos, buttons }) {

    return <Tabla head={header} body={makeBody(avisos, buttons)} />
}