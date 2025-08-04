import React from 'react';
import { Modal } from "../../Modal/Modal";
import { API_URL } from "../../../config/config";
import { downloadFiles } from '../../../utils/ReportesProduccionUtils';

export default function ModalFiles({ modalOpen, setModalOpen, reporte,tarea }) {


    const handleDownload = () => {
        downloadFiles(reporte._id).then(res => {
            const link = document.createElement('a');
            link.href = 'data:text/plain;base64,' + res.data;
            link.setAttribute('download', `${reporte._id}.zip`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }).catch(err => console.error(err));
    };

    const makeBody = (reporte) => {
        return (
            <div className={'modal-body'}>
                {reporte && reporte.usuario && <div className={'qr-modal-title'}>
                    Reporte de <b>{reporte.usuario.nombre + ', ' + reporte.usuario.apellidos}</b>
                </div>}
                <div className={'reporte-detail--info'}>
                    <div>
                        <span>Fecha del reporte:</span>
                        <b>{new Date(reporte.fechaCreacion).toLocaleDateString()}</b>
                    </div>
                    <div className={'avance'}>
                        <span>Avance reportado:</span>
                        <b>{reporte.numero && reporte.porcentaje ? reporte.numero.toFixed(2) : (reporte.numero / tarea.medicion * 100).toFixed(2)}%</b>
                    </div>
                    <div className={'problem-tag'}>
                        {reporte.tipo === 'problema' ? <b style={{ color: 'var(--red)' }}>PROBLEMA</b> : <b style={{ color: 'var(--green-lighter)' }}>NO FUE UN PROBLEMA</b>}
                    </div>
                    <div>
                        {reporte.completar ? <span style={{ color: 'var(--blue)', fontWeight: 'bold' }}>SE COMPLETÓ LA TAREA</span> : ''}
                    </div>
                    <div>
                        {
                            reporte.description &&
                            <React.Fragment>
                                <b>Comentario asociado</b>
                                <p>{reporte.description}</p>
                            </React.Fragment>
                        }
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: '15px' }}>
                        {reporte.files.map((file, i) => {
                            return <img src={API_URL + '/' + file} style={{ maxWidth: '250px', objectFit: 'contain', margin: '8px' }} alt={'imagen del reporte'} key={i} />
                        })}
                    </div>
                    {/*<div>*/}
                    {/*    {reporte.files.length > 0 && <span style={{ marginTOp: '15px' }} className={'link'} onClick={handleDownload}>Descargar los archivos.</span>}*/}
                    {/*</div>*/}
                </div>
            </div>
        )
    };

    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={"Detalles del reporte"}
            subHeader={"Reporte " + reporte._id}
            body={makeBody(reporte)}
            close={() => setModalOpen(false)}
            alone
        />
    )
}
