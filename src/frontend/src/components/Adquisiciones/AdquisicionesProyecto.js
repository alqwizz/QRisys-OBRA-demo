import React, { useState, useEffect } from 'react'
import { findByProyecto } from '../../utils/AdquisicionesUtils';
import { TablaAdquisiciones } from './Tablas/TablaAdquisiciones';
import { ModalFormAdquisiciones } from './Modales/ModalFormAdquisiciones';
import ModalTareasAdquisiciones from "./Modales/ModalTareas";

export function AdquisicionesProyecto({ proyecto }) {

    let [cargar, setCargar] = useState(true);
    let [modalOpenForm, setModalOpenForm] = useState(false);
    let [selectedAdquisicion, setSelectedAdquisicion] = useState(null)
    let [adquisiciones, setAdquisiciones] = useState([]);
    const [openTareas, setOpenTareas] = useState(false);

    useEffect(() => {
        let unmounted = false;
        findByProyecto(proyecto._id).then(res => {
            if (!unmounted) setAdquisiciones(res.data.adquisiciones);
        });
        return () => { unmounted = true };
    }, [cargar, proyecto]);

    const handleEditar = (adquisicion) => () => {
        setSelectedAdquisicion(adquisicion);
        setModalOpenForm(true);
    };
    const handleTareas = (adquisicion) => () => {
        setSelectedAdquisicion(adquisicion);
        setOpenTareas(true);
    }
    const buttons = [
        { icon: 'fa fa-edit', title: 'Editar', action: handleEditar, hasPermission: true },
        { icon: 'fa fa-look', title: 'Tareas', action: handleTareas, hasPermission: true }
    ];


    const handleNuevaAdquisicion = () => {
        if (selectedAdquisicion) setSelectedAdquisicion(null);
        setModalOpenForm(true)
    }

    const doCargar = () => {
        setCargar(!cargar)
    }


    return (
        <div>
            <div className="panel panel-transparent">
                <div className="panel-heading">
                    <div className="panel-title">Adquisiciones
                </div>
                    <div className={"btn-group pull-right m-b-10"}>
                        <button onClick={handleNuevaAdquisicion} type="button" className="btn btn-default">Nueva adquisicion</button>
                    </div>
                    <div className="clearfix"></div>
                </div>
                <div className="panel-body">
                    <TablaAdquisiciones adquisiciones={adquisiciones} buttons={buttons} />
                </div>
            </div>
            <ModalTareasAdquisiciones modalOpen={openTareas} adquisicion={selectedAdquisicion} setModalOpen={setOpenTareas} />

            <ModalFormAdquisiciones adquisicion={selectedAdquisicion} doCargar={doCargar} idProyecto={proyecto._id} idEmpresa={proyecto.empresa._id ? proyecto.empresa._id : proyecto.empresa} modalOpen={modalOpenForm} setModalOpen={setModalOpenForm} />
        </div >
    )
}
