import React from 'react';
import { Modal } from '../../Modal/Modal';
import { ReporteProduccionForm } from '../Form/ReporteProduccionForm'
import reporteIcon from '../../../assets/img/icons/cone.svg';
export function ModalReportar({ reporte, doCargar, modalOpen, setModalOpen, tarea }) {
    const header = <img  src={reporteIcon} alt={'icono de reporte'} style={{height:'1.5em',objectFit:'contain'}}/>;
    const close = () => {
        doCargar();
        setModalOpen(false);
    }
    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            body={<ReporteProduccionForm reporte={reporte} modalOpen={modalOpen} close={close} tarea={tarea} />} />
    )
}
