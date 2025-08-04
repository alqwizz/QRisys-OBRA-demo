import React from 'react';
import { UsuarioForm } from '../Form/UsuarioForm'
import { Modal } from '../../Modal/Modal';
export function ModalFormUsuarios({ usuario, roles, doCargar, options, modalOpen, setModalOpen }) {
    const header = usuario ? 'Está editando un usuario.' : 'Introduzca los datos del nuevo usuario.'
    const close = () => {
        doCargar();
        setModalOpen(false);
    }
    return (
        <Modal modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            body={<UsuarioForm roles={roles} usuario={usuario} options={options} close={close} />} />
    )
}