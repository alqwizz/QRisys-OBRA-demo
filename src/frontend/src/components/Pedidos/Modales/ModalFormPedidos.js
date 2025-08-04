import React, { useEffect, useState } from 'react';
import PedidoForm from '../../GestorCompras/PedidoForm';
import { Modal } from '../../Modal/Modal';

export function ModalFormPedidos({ pedido, doCargar, modalOpen, setModalOpen, tarea, idProyecto, adquisiciones, empresa, empresaDisabled, callbackPedido, adquisicionSelected }) {
    const [modalContent, setModalContent] = useState({});

    useEffect(() => {
        setModalContent({
            header: "Hacer pedido" + (tarea ? ` para ${tarea.nombre}` : ''),
            body: <PedidoForm tarea={tarea} modalOpen={modalOpen} setModalContent={setModalContent} idProyecto={idProyecto} empresa={empresa} pedido={pedido} empresaDisabled={empresaDisabled} callbackPedido={callbackPedido} adquisicionSelected={adquisicionSelected} adquisiciones={adquisiciones} />
        })
    }, [modalOpen]);

    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={modalContent.header}
            body={modalContent.body} />
    )
}
