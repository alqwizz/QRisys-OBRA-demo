import React from 'react';
import { asignarProyecto, quitarProyecto } from '../../../utils/UsuariosUtils';
import { Modal } from '../../Modal/Modal';
import { TablaProyecto } from '../../Proyectos/Tablas/TablaProyecto';
export function ModalAsignarUsuariosProyecto({ doCargar, usuario, proyectos, modalOpen, setModalOpen }) {

    const handleAsignar = (proyecto) => () => {
        asignarProyecto(proyecto._id, usuario._id).then(res => {
            doCargar();
        })
    }
    const handleQuitar = (proyecto) => () => {
        quitarProyecto(proyecto._id, usuario._id).then(res => {
            doCargar();
        })
    }
    const canAsignar = (proyecto) => {
        if (usuario && usuario.proyectos) {
            const find = usuario.proyectos.find(x => x === proyecto._id + '');
            return find ? false : true;
        }
        return true;
    }
    const canRemove = (proyecto) => {
        if (usuario && usuario.proyectos) {
            const find = usuario.proyectos.find(x => x === proyecto._id + '');
            return find ? true : false;
        }
        return false;
    }
    const buttons = [
        { icon: 'fa fa-plus', title: 'Asignar proyecto', action: handleAsignar, hasPermission: true, condition: canAsignar },
        { icon: 'fa fa-minus', title: 'Retirar proyecto', action: handleQuitar, hasPermission: true, condition: canRemove }
    ]
    const header = "Gestión de proyectos."
    const subHeader = "Usuario " + (usuario ? usuario.email : '');

    return (
        <Modal
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={header}
            subHeader={subHeader}
            body={<TablaProyecto proyectos={proyectos} buttons={buttons} />} />
    )
}
