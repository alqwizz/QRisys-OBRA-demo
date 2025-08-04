import React, { useState } from 'react'
import { downloadFiles } from '../../../utils/PedidosUtils';
import { ModalDetallePedido } from "../Modales/ModalDetallePedido";
import useGlobal from "../../../store/store";
import '../Pedidos.css';

export function TablaPedidos({ pedidos, doCargar }) {

    const [editPedido, setEditPedido] = useState(null);
    const [modalOpenSeePedido, setModalOpenSeePedido] = useState(false);

    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    // function hasFiles(pedido) {
    //     let result = false;
    //     for (let type in pedido.files) {
    //         if (pedido.files.hasOwnProperty(type) && pedido.files[type].length > 0) {
    //             result = true;
    //             break;
    //         }
    //     }
    //     return result;
    // }

    const getPedidoStyle = (estado) => {
        switch(estado){
            case 'ENTREGADO':
                return {backgroundColor:'rgba(113,175,113,.2)'};
            case 'ACOPIADO':
                return {backgroundColor:'rgba(113,115,175,.2)'};
            case 'ANULADO':
                return {opacity:.4};
            case 'RECHAZADO':
                return {backgroundColor:'rgba(175,113,175,.2)'};
            case 'EN USO':
                return {backgroundColor:'rgba(113,175,113,.2)'};
            case 'PENDIENTE':
                return {backgroundColor:'rgba(113,115,113,.2)'};
        }
    }

    function handleDownload(pedido) {
        downloadFiles(pedido._id).then(response => {
            const link = document.createElement('a');
            link.href = 'data:text/plain;base64,' + response.data;
            link.setAttribute('download', `${pedido._id}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => console.error(err));
    }

    function handleShowPedido(pedido) {
        setEditPedido(pedido);
        setModalOpenSeePedido(true);
        console.log(pedido);
    }


    return (
        <React.Fragment>
            {
                pedidos && pedidos.length > 0 && pedidos.map(pedido => {
                    return <div key={pedido._id} className={'pedido-info'} style={getPedidoStyle(pedido.estado)}>
                        <div className={'pedido-info--content'}>
                            <div className={'item'} style={{gridArea:'1/1'}}><span>Fecha</span>
                                <b>{new Date(pedido.fechaPedido).toLocaleDateString()}</b></div>
                            <div className={'item'}  style={{gridArea:'2/1'}}>
                                <span>Nombre proveedor</span>
                                <b>{pedido.empresaSubcontrata && pedido.empresaSubcontrata.nombre}</b>
                            </div>
                            <div className={'item'} style={{gridArea:'2/2'}}>
                                <span>Nº Albarán </span>
                                <b>{pedido._id}</b>
                            </div>
                            <div className={'item'} style={{gridArea:'2/3'}}>
                                <span>Fecha esperada</span>
                                <b>{pedido.fechaEsperada && (new Date(pedido.fechaEsperada)).toLocaleDateString()}</b>
                            </div>
                            <div className={'item'} style={{gridArea:'2/4'}}>
                                <span>Fecha recepción</span>
                                <b>{pedido.fechaRecepcion && (new Date(pedido.fechaRecepcion)).toLocaleDateString()}</b>
                            </div>
                            <div style={{textAlign: 'end',gridArea:'1/4' }}>
                                {hasPermission("DDPE") && <i className={'fas fa-file-download'} onClick={() => handleDownload(pedido)} />}
                                {hasPermission("VP") && <i className={'fas fa-eye'} onClick={() => handleShowPedido(pedido)} />}
                            </div>
                        </div>
                        <div className={'comment'}>
                            <div className={'item'}>
                                <span>Usuario</span>
                                <b>{pedido.updated_for && (pedido.updated_for.nombre + ', ' + pedido.updated_for.apellidos)}</b>
                            </div>
                            <div className={'item'}>
                                <span>Comentario </span>
                                <b>{pedido.description && pedido.description.solicitar}</b>
                            </div>
                        </div>

                    </div>
                })
            }
            {!(pedidos && pedidos.length > 0) && <p>No hay pedidos disponibles.</p>}
            <ModalDetallePedido doCargar={doCargar} pedido={editPedido} modalOpen={modalOpenSeePedido} setModalOpen={setModalOpenSeePedido} />
        </React.Fragment>
    )
}
