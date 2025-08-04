import React from 'react';
import { CredentialsForm } from '../Form/CredentialsForm'
import { Modal } from '../../Modal/Modal';
export function ModalFormCredentials({ idUsuario, doCargar, modalOpen, setModalOpen }) {
    const header = 'Gestión de contraseñas.';
    const subHeader = 'Está cambiando la contraseña del usuario'
    const close = () => {
        doCargar();
        setModalOpen(false);
    }
    return (
        <Modal modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            subHeader={subHeader}
            body={<CredentialsForm idUsuario={idUsuario} close={close} />} />
    )
}