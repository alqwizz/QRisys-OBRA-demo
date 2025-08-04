import React from 'react'
import { Modal } from '../../Modal/Modal';
import { AdquisicionForm } from '../Form/AdquisicionForm'

export function ModalFormAdquisiciones({ adquisicion, doCargar, idProyecto, idEmpresa, modalOpen, setModalOpen }) {
    const str = adquisicion ? "Editando" : "Creando"
    const header = str + " recurso."
    const subHeader = "Introduzca los datos del recurso."
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
            body={<AdquisicionForm modalOpen={modalOpen} adquisicion={adquisicion} idProyecto={idProyecto} idEmpresa={idEmpresa} close={close} />} />
    )
}