import React, { useEffect, useState } from 'react';
import { Modal } from '../../Modal/Modal'
import { findByProyectoAndUsuario } from '../../../utils/TareasUtils'
import TableTareas from '../Tablas/TablaTareas';

export function ModalTareasUsuarios({ modalOpen, setModalOpen, idUsuario, idProyecto }) {

    let [tareas, setTareas] = useState([])
    useEffect(() => {

        let unmounted = false;
        findByProyectoAndUsuario(idProyecto, idUsuario).then(res => {
            const tareasRes = res.data.tareas;
            if (!unmounted) setTareas(tareasRes);
        })
        return () => { unmounted = true };
    }, [idUsuario, idProyecto])

    const header = 'Tareas asignadas al usuario';
    return (< Modal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        header={header}
        body={<TableTareas tareas={tareas}/>} />)
}
