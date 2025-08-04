import React from 'react';
import { Modal } from "../Modal/Modal";
import EmpresaSubForm from "./EmpresaSubForm";
export default function NuevaEmpresaSub({ openModal, setOpenModal, idProyecto, doCargar, empresa }) {


    const bodyEmpresa =
        <div>
            <EmpresaSubForm empresa={empresa} proyectoId={idProyecto} setOpenModal={setOpenModal} modalOpen={openModal} doCargar={doCargar} />
        </div>;


    const onCloseModal = () => {
        setOpenModal(false);
    };

    const makeHeader = () => {
        return empresa ? "Editar empresa" : "Crear empresa";
    }


    return (
        <Modal modalOpen={openModal} setModalOpen={setOpenModal} header={makeHeader()} body={bodyEmpresa} onClose={onCloseModal} />
    )
}
