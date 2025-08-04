import React from 'react';
import { Modal } from '../../Modal/Modal';
import { ProyectoForm } from '../Form/ProyectoForm'

export function ModalFormProyecto({ proyecto, doCargar, modalOpen, setModalOpen, options }) {
    const str = proyecto ? 'Editando' : 'Creando';
    const header = str + ' proyecto.';
    const subHeader = 'Introduzca los datos del proyecto.';
    const close = () => {
        doCargar();
        setModalOpen(false);
    }
    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            subHeader={subHeader}
            body={<ProyectoForm proyecto={proyecto} close={close} options={options} modalOpen={modalOpen} />} />
    )
}
