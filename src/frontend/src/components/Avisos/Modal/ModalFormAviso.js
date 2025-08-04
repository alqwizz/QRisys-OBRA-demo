import React from 'react';
import { AvisoForm } from '../Form/AvisoForm'
import { Modal } from '../../Modal/Modal';
export function ModalFormAviso({ aviso, proyecto, doCargar, modalOpen, setModalOpen }) {
    const header = aviso ? aviso._id ? 'Editando un aviso.' : 'Introduzca los datos del nuevo aviso.' : 'Introduzca los datos del nuevo aviso.'

    const close = () => {
        doCargar();
        setModalOpen(false);
    }
    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            body={<AvisoForm aviso={aviso} proyecto={proyecto} close={close} openModal={modalOpen} />} />
    )
}