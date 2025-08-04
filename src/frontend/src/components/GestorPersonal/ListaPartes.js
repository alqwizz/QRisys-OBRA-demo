import React, { useState } from 'react';
import { findByEmpresaAndDate } from "../../utils/ParteAsistenciaUtils";
import ModalSeeParte from "./ModalSeePartes";
import useGlobal from "../../store/store";

export default function ListaPartes({ partes, doCargar }) {

    const [partesActive, setPartesActive] = useState([]);
    const [openPartes, setOpenPartes] = useState(false);
    const [empresaActive, setEmpresaActive] = useState(null);

    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    const getPartes = (e, parte) => {
        if (canSeePartes())
            findByEmpresaAndDate(e._id, parte).then(response => {
                setPartesActive(response.data.partesAsistencia);
                setEmpresaActive(e);
                setOpenPartes(true);
            });
    };
    const canSeePartes = () => {
        if (hasPermission("VPT")) return true;
        return false;
    }
    return (
        <React.Fragment>
            {partes.length > 0 && partes.map((parte, i) => {
                return <div className={'list_item'} key={i}>
                    <div className={'date-info'}><span style={{ opacity: '.4' }}>Fecha</span> <span style={{ opacity: '1' }}>{parte._id}</span></div>
                    {parte.empresas && parte.empresas.map((empresa) => { return <div key={empresa._id} style={{ cursor: canSeePartes() ? 'pointer' : '' }} className={'parte-info'} onClick={() => getPartes(empresa, parte._id)}><b>{empresa.nombre}</b></div> })}
                </div>
            })}
            {partesActive.length > 0 && empresaActive && <ModalSeeParte open={openPartes} setOpen={setOpenPartes} empresa={empresaActive} partes={partesActive} doCargar={doCargar} />}
        </React.Fragment>
    )
}
