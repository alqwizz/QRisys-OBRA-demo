import React, { useEffect, useState } from 'react';
import { PresupuestoForm } from '../Form/PresupuestoForm';
import { Modal } from '../../Modal/Modal';

export function ModalFormPresupuesto({ modalOpen, setModalOpen, tarea, idProyecto, adquisiciones, empresa, empresaDisabled, callBack, adquisicionSelected }) {
    const [modalContent, setModalContent] = useState({});

    useEffect(() => {
        setModalContent({
            header: "Solicitar presupuesto",
            body: <PresupuestoForm modalOpen={modalOpen} idProyecto={idProyecto} empresa={empresa} empresaDisabled={empresaDisabled} adquisicionSelected={adquisicionSelected} />
        })
    }, [modalOpen, adquisicionSelected, empresa, empresaDisabled, idProyecto, tarea]);

    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={modalContent.header}
            body={modalContent.body} />
    )
}
