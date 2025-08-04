import React from 'react'
import { TareaForm } from '../Form/TareaForm';
import { Modal } from '../../Modal/Modal';

export function ModalFormTareas({ tarea, doCargar, options, modalOpen, setModalOpen }) {

    const header = tarea ? 'Editando una tarea.' : 'Creando una partida contradictoria.';
    //const subHeader = "Introduzca los datos de la tarea."
    const close = () => {
        doCargar();
        setModalOpen(false);
    }

    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            body={<TareaForm tarea={tarea} options={options} close={close} modalOpen={modalOpen} />} />
    )
}