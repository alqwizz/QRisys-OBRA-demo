import React, { useState, useEffect } from 'react';
import Lista from "../Globales/Lista";
import parteIcon from '../../assets/img/requirement.svg';
import workerIcon from '../../assets/img/worker.svg';
import ModalAddPersonal from "./ModalAddPersonal";
import ModalAddParte from "./ModalAddParte";
import useGlobal from "../../store/store";

export default function ListaEmpresas({ empresas, doCargar }) {

    const [selectEmpresa, setSelectEmpresa] = useState(null);
    const [openAddPersonal, setOpenAddPersonal] = useState(false);
    const [openCreateParte, setOpenCreateParte] = useState(false);

    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    const crearParte = (e) => () => {
        setSelectEmpresa(e);
        setOpenCreateParte(true);
    };

    const añadirPersonal = (e) => () => {
        setSelectEmpresa(e);
        setOpenAddPersonal(true);
    };

    useEffect(() => {
        if (!openAddPersonal && !openCreateParte) {
            setSelectEmpresa(null);
        }
    }, [openAddPersonal, openCreateParte]);


    const buttons = [
        { icon: null, title: 'Crear parte', color: 'var(--verde-agua)', action: crearParte, image: parteIcon, hasPermission: hasPermission("CPT") },
        { icon: null, title: 'Añadir personal', color: 'var(--verde-agua)', action: añadirPersonal, image: workerIcon, hasPermission: hasPermission("CTB") }
    ];

    return (
        <React.Fragment>
            {empresas && empresas.length > 0 && <Lista items={empresas} titlePropertys={['nombre']} buttons={buttons} />}
            {selectEmpresa && <ModalAddPersonal empresa={selectEmpresa} open={openAddPersonal} setOpen={setOpenAddPersonal} doCargar={doCargar} />}
            {selectEmpresa && selectEmpresa.personal && <ModalAddParte empresa={selectEmpresa} open={openCreateParte} setOpen={setOpenCreateParte} doCargar={doCargar} />}
        </React.Fragment>
    )
}
