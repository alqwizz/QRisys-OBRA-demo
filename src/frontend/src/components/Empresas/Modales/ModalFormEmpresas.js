import React from 'react';
import { Modal } from '../../Modal/Modal';
import { EmpresaForm } from '../Form/EmpresaForm';

export function ModalFormEmpresas({ empresa, doCargar, modalOpen, setModalOpen }) {
    const str = empresa ? 'Editando' : 'Creando'
    const header = str + ' empresa.';
    const close = () => {
        doCargar();
        setModalOpen(false);
    }

    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            body={<EmpresaForm empresa={empresa} close={close} modalOpen={modalOpen} />} />
    )
}
