import React, { useEffect, useState } from 'react';
import { Modal } from "../../Modal/Modal";
import TableTareas from "../../Tareas/Tablas/TablaTareas";
import { findByProyecto } from '../../../utils/TareasUtils';
import { asociarTarea } from '../../../utils/AdquisicionesUtils'

export default function ModalTareasAdquisiciones({ adquisicion, doCargar, modalOpen, setModalOpen }) {
    let [tareas, setTareas] = useState([])
    let [subHeader, setSubHeader] = useState(null)
    let [buttonsTabla, setButtonsTabla] = useState([])
    useEffect(() => {
        if (adquisicion) {
            if (adquisicion.nombre) setSubHeader('Tareas asociadas a ' + adquisicion.nombre);
            if (adquisicion.tareas && adquisicion.tareas.length > 0) setTareas(adquisicion.tareas);
        }
    }, [adquisicion])

    if (adquisicion !== null) {
        const adquisicionHasTarea = (tarea) => {
            const find = adquisicion.tareas.find(x => '' + x._id === tarea._id + '');
            if (find) return false;
            return true;
        }
        const handleAsociar = (tarea) => () => {
            asociarTarea(adquisicion._id, tarea._id).then(res => {
                doCargar()
            })
        }
        const handleTablaAsociar = () => () => {

            findByProyecto(adquisicion.proyecto).then(res => {
                setSubHeader('Asociando tareas a la adquisicion ' + adquisicion.nombre);
                setTareas(res.data.tareas);
                setButtonsTabla([{ icon: 'fa fa-plus', title: 'Asociar tarea', action: handleAsociar, condition: adquisicionHasTarea, hasPermission: true }])
            })
        }
        const buttonsModal = [
            { icon: 'fa fa-plus', title: 'Asociar tareas', action: handleTablaAsociar, hasPermission: true },
        ];
        return <Modal modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            header={'Tareas'}
            buttons={buttonsModal}
            subHeader={subHeader}
            body={<TableTareas buttons={buttonsTabla} tareas={tareas} />} />
    } else {
        return <div></div>
    }
}
