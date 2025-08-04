import React, { useState, useEffect } from 'react';
import { findById } from '../../utils/PedidosUtils'
import { DetalleMaquinaQR } from './DetalleMaquinaQR'

export function DetalleAdquisicionQR({ idPedido, idAdquisicion, number }) {
    const [pedido, setPedido] = useState(null)
    const [adquisicion, setAdquisicion] = useState(null)

    useEffect(() => {
        if (idPedido && idAdquisicion) {

            findById(idPedido).then(res => {
                const ped = res.data.pedido;
                const adquisicion = ped.adquisiciones.find(x => x._id + '' === idAdquisicion + '')
                setPedido(ped)
                setAdquisicion(adquisicion);
            })
        }
    }, [idPedido, idAdquisicion])
    console.log('que pasa tron')
    if (!(pedido && adquisicion)) return <div />
    if (adquisicion.tipo === "MAQUINA") return <DetalleMaquinaQR maquina={adquisicion} idPedido={idPedido} number={number} />
    else if (adquisicion.tipo === "MATERIAL") return <div />
    else return <p>En desarrollo.</p>
}