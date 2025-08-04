import React, { useEffect, useState } from 'react';
import { DetalleAviso } from '../DetalleAviso';
import { findToday } from '../../../utils/AvisosUtils'
import { Modal } from '../../Modal/Modal';
import useGlobal from "../../../store/store";

export function ModalAviso() {
    const header = '';
    const [avisos, setAvisos] = useState([])
    const [modalOpen, setModalOpen] = useState(false);

    const state = useGlobal()[0];
    useEffect(() => {
        findToday().then(res => {
            const avisosRes = res.data.avisos;
            if (avisosRes.length > 0) {
                setAvisos(res.data.avisos);
                setModalOpen(true);
            } else {
                setAvisos([]);
                setModalOpen(false);
            }
        })
    }, [state.userSession])
    const close = (aviso) => {
        let avisosOld = [...avisos]
        avisosOld = avisosOld.filter(x => x._id + '' !== aviso._id + '');
        setAvisos(avisosOld)
        if (avisosOld.length === 0)
            setModalOpen(false)
    }
    const body = avisos.map(aviso => {
        return <DetalleAviso key={aviso._id} aviso={aviso} leido={true} close={close} />
    })
    if (state.userSession)
        return (
            <Modal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                header={header}
                body={body} alone />
        )
    return <div />
}
