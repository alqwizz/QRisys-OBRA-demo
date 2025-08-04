import React, { useState, useEffect } from 'react';
import { findByProyecto, asignarTarea, quitarTarea } from '../../../utils/UsuariosUtils';
import { Modal } from '../../Modal/Modal';
import { TablaUsuario } from '../Tablas/TablaUsuario';
export function ModalAsignarUsuariosTarea({ doCargar, idProyecto, idTarea, modalOpen, setModalOpen }) {

    let [recargar, setRecargar] = useState(false)
    let [usuarios, setUsuarios] = useState([])

    useEffect(() => {
        let unmounted = false;
        if (idProyecto) {
            findByProyecto(idProyecto).then(res => {
                if (!unmounted) setUsuarios(res.data.users);
            })
        }
        return () => { unmounted = true };
    }, [recargar, idProyecto, idTarea])

    const handleAsignar = (u) => () => {
        asignarTarea(u._id, idTarea).then(res => {
            setRecargar(!recargar);
        })
    }
    const handleQuitar = (u) => () => {
        quitarTarea(u._id, idTarea).then(res => {
            setRecargar(!recargar);
        })
    }
    const handleConditionAsignar = (idTarea) => (usuario) => {
        return !usuario.tareas.includes(idTarea)
    }
    const handleConditionQuitar = (idTarea) => (usuario) => {
        return usuario.tareas.includes(idTarea)
    }

    const buttons = [
        { icon: 'fa fa-plus', title: 'Asignar a tarea', action: handleAsignar, hasPermission: true, condition: handleConditionAsignar(idTarea) },
        { icon: 'fa fa-minus', title: 'Quitar de tarea', action: handleQuitar, hasPermission: true, condition: handleConditionQuitar(idTarea) }
    ]
    const header = "Gestión de usuarios."
    const subHeader = "Pulse en el usuario deseado para asignarlo a la tarea."
    return (
        <Modal
            onClose={doCargar}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            subHeader={subHeader}
            body={<TablaUsuario usuarios={usuarios} buttons={buttons} />} />
    )
}