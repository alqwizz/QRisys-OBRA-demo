import React, { useState, useEffect } from 'react';
import Lista from "../Globales/Lista";
import { findByProyecto } from '../../utils/PedidosUtils';
import { anular } from "../../utils/PedidosUtils";
import { ModalDetallePedido } from '../Pedidos/Modales/ModalDetallePedido';

export default function ListaPedidos({ search, idProyecto }) {
    const [pedidos, setPedidos] = useState([]);
    const [openDetallePedido, setOpenDetallePedido] = useState(false);
    const [cargar, setCargar] = useState(false);
    const [viewingPedido, setViewingPedido] = useState(null);

    useEffect(() => {
        findByProyecto(idProyecto, search).then(response => {
            if (response.data.status === 200) {
                setPedidos(response.data.pedidos);
            }
        })
    }, [idProyecto, search, cargar]);

    const doCargar = () => {
        setCargar(!cargar);
    }

    const cancelPedido = (pedido) => () => {
        anular(pedido._id).then(response => {
            if (response.data.status === 200) {
                window.alert('pedido anulado');
            } else {
                window.alert('error');
            }
        }).catch(err => console.error(err));
    };
    const verPedido = (pedido) => () => {
        setOpenDetallePedido(true);
        setViewingPedido(pedido)
    }

    const buttons = [
        { icon: 'fa fa-times', title: 'anular pedido', color: 'black', action: cancelPedido },
        { icon: 'fa fa-search', title: 'Ver detalle pedido', color: 'var(--blue)', action: verPedido }
    ];

    const colorStyle = (pedido) => {
        const result = {};
        switch (pedido.estado) {
            case 'ENTREGADO':
                result.backgroundColor = 'var(--green-lighter)';
                break;
            case 'RECHAZADO':
                result.backgroundColor = 'var(--red)';
                break;
            case 'ANULADO':
                result.backgroundColor = '#d7d7d7';
                break;
            case 'PENDIENTE':
                if (new Date(pedido.fechaEsperada) > new Date()) {
                    result.backgroundColor = '#FFFFFF';
                } else {
                    result.backgroundColor = 'var(--orange)';
                }
                break;
            default:
                result.backgroundColor = 'white';
                break;
        }
        return result;
    }

    return (
        <div>
            <Lista items={pedidos} titlePropertys={['empresaSubcontrata']} subniveles={['nombre']} separator={' -'} secondInfo={'cantidad'} buttons={buttons} colorStyle={colorStyle} />
            <ModalDetallePedido pedido={viewingPedido} doCargar={doCargar} modalOpen={openDetallePedido} setModalOpen={setOpenDetallePedido} />
        </div>

    )
}
