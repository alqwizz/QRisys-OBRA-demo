import React, { useState, useEffect } from 'react';
import { findById } from '../../utils/PedidosUtils'
import { DetallePedido } from "./DetallePedido";

export function DetallePedidoQR({ idPedido }) {
    const [pedido, setPedido] = useState(null)
    useEffect(() => {
        if (idPedido) {
            findById(idPedido).then(res => {
                setPedido(res.data.pedido)
            })
        }
    }, [idPedido])

    if (!pedido) return <div />
    // return (<div>
    //     <h1>Albarán</h1>
    //     <h2>Empresa: {pedido && pedido.empresaSubcontrata && pedido.empresaSubcontrata.nombre ? pedido.empresaSubcontrata.nombre : ''}</h2>
    //     {mostrarDetalle && < div >
    //         <p>Fecha esperada: {pedido.fechaEsperada ? new Date(pedido.fechaEsperada).toLocaleDateString() : 'Sin fecha esperada.'}</p>
    //         <p>Estado: {pedido.estado && showEstado(pedido.estado)}.</p>
    //         <div>
    //             <QRCode value={QRGenerator(pedido)} />
    //         </div>
    //         {pedido && pedido.adquisiciones && pedido.adquisiciones.length > 0 && < div >
    //             <p>Adquisiciones</p>
    //             <TablaAdquisicionesPedidos adquisiciones={pedido.adquisiciones} />
    //         </div>}
    //
    //         {pedido && pedido.estado === 'PENDIENTE' && <button onClick={handleRecibir} className="btn btn-success m-r-15 m-t-30">Recibir</button>}
    //         {pedido && pedido.estado === 'PENDIENTE' && <button onClick={handleRechazar} className="btn btn-danger  m-t-30">Rechazar</button>}
    //     </div>}
    //     {
    //         confirmandoRecibir === 1 && <div>
    //             <p>Pulse en confirmar para confirmar la correcta recepción del pedido.</p>
    //             <button onClick={handleConfirmarRecibir} className="btn btn-success m-r-15 m-t-30">Confirmar</button>
    //             <button onClick={handleCancelarRecibir} className="btn btn-danger  m-t-30">Cancelar</button>
    //         </div>
    //     }
    //     {confirmandoRecibir === 2 && <div><p>El pedido ha sido confirmado correctamente.</p></div>}
    //     {
    //         confirmandoRechazar === 1 && <div>
    //             <p>Pulse en confirmar para ejecutar el rechazo del pedido.</p>
    //             <button onClick={handleConfirmarRechazar} className="btn btn-success m-r-15 m-t-30">Confirmar</button>
    //             <button onClick={handleCancelarRechazar} className="btn btn-danger  m-t-30">Cancelar</button>
    //         </div>
    //     }
    //     {confirmandoRechazar === 2 && <div><p>El pedido ha sido rechazado correctamente.</p></div>}
    // </div >)

    return <DetallePedido pedido={pedido} QR />
}
