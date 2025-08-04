import React from 'react';
import { Modal } from '../../Modal/Modal';
import { cancelar } from '../../../utils/TareasUtils'

export function ModalCancelarTarea({ tarea, doCargar, modalOpen, setModalOpen }) {
    const header = tarea.nombre;
    const close = () => {
        doCargar();
        setModalOpen(false);
    };

    function goBack(){
        setModalOpen(false);
    }

    const cancelTask = () => {
        cancelar(tarea._id).then(() => {
            close();
        })
    };
    const body =
        <React.Fragment>
            <div className={'modal-body'} style={{textAlign:'center'}}>
                <b>¿Está seguro de que quiere cancelar esta tarea?</b>
            </div>
            <div className={'modal-footer'} style={{backgroundColor:'var(--main-color)'}}>
                <div className={'cancel-container'}>
                    <button onClick={goBack} className="qr-btn cancel-btn" style={{ marginRight: '8px' }}>Cancelar</button>
                </div>
                <div style={{backgroundColor:'var(--verde-agua)'}}>
                    <button onClick={cancelTask} className="qr-btn confirm-btn">Confirmar</button>
                </div>
            </div>
        </React.Fragment>;

    if (!tarea) return <div />
    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            body={body} />
    )
}
