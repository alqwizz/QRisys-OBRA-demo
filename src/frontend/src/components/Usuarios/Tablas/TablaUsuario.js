import React from 'react';
import { Tabla } from '../../Tablas/Tabla/Tabla';
import { header, makeBody } from '../../../utils/Usuario/Tabla/Tabla';


export function TablaUsuario({ usuarios, buttons }) {

    return <Tabla head={header} body={makeBody(usuarios, buttons)} />
}