import React from 'react';
import { Modal } from '../../Modal/Modal';
import { DetallePedido } from '../DetallePedido.js';
import pedidoIcon from '../../../assets/img/icons/delivery.svg';
export function ModalDetallePedido({ pedido, doCargar, modalOpen, setModalOpen }) {

    const header = <div >
        <img src={pedidoIcon} alt={'icono de pedido'} height={14}/>
        </div>;

    const onClose = () => {
        setModalOpen(false);
        doCargar();
    }
    if (!pedido) return <div />
    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            onClose={onClose}
            body={<DetallePedido pedido={pedido} open={modalOpen} close={onClose}/>} alone/>
    )

}
