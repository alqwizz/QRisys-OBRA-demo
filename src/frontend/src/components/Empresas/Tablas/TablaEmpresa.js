import React, { useRef, useState } from 'react';
import { ModalFormProyecto } from "../../Proyectos/Modales/ModalFormProyecto";
import { importPlanificacion } from "../../../utils/ProyectosUtils";
import { navigate } from "hookrouter";
import useGlobal from "../../../store/store";
import { API_URL } from "../../../config/config";
import logo from "../../../assets/img/logo_qrysis.png";

export function TablaEmpresa({ empresas, doCargar }) {

    const inputRef = useRef(null);
    const [openModal, setOpenModal] = useState(false);
    const [editProyecto, setEditProyecto] = useState(null);
    const [empresaActive, setEmpresaActive] = useState(null);
    const [state, actions] = useGlobal();
    const hasPermission = actions.hasPermission();

    const handleNuevoProyecto = (idEmpresa) => {
        setOpenModal(true);
        setEditProyecto(null);
        setEmpresaActive(idEmpresa);
    };

    const handleEditProyecto = (proyecto) => {
        setEditProyecto(proyecto);
        setOpenModal(true);
    };

    const handleInputChange = (idProyecto) => (event) => {
        const file = event.target.files[0];
        let r = window.confirm("¿Está seguro que quieres importar los datos del archivo " + file.name);

        if (r) {
            const data = new FormData();
            data.append('file', file);
            importPlanificacion(idProyecto, data).then(response => {
                // doCargar()
                inputRef.current.value = "";
            });
        } else {
            inputRef.current.value = ""
        }
    };

    const goToProyect = (proyecto) => {
        if (hasPermission("VEP") || canClickProyect(proyecto))
            navigate('/detalleProyecto/' + proyecto._id)
    };

    const goToEmpresa = (idEmpresa) => {
        if (hasPermission("VEP") || canClickEmpresa(idEmpresa))
            navigate('/detalleEmpresa/' + idEmpresa)
    }
    const canClickProyect = (proyecto) => {
        if (hasPermission("VEP") && hasPermission(["VAT", "VTO", "VG", "VGCP", "VGCPE", "VGPE", "VGPPT", "VDH"])) return true;
        if (state.userSession && state.userSession.proyectos) {
            const proyectosUser = state.userSession.proyectos;
            const find = proyectosUser.find(x => x + '' === proyecto._id);
            return find ? true && hasPermission(["VAT", "VTO", "VG", "VGCP", "VGCPE", "VGPE", "VGPPT", "VDH"]) : false;
        }
        return false;
    }
    const canClickEmpresa = (idEmpresa) => {
        if (hasPermission("VEP")) return true;
        if (state.userSession && state.userSession.empresas) {
            const empresasUser = state.userSession.empresas;
            const find = empresasUser.find(x => x + '' === idEmpresa);
            return find ? true : false;
        }
        return false;
    }
    const getLateralColor = (estado) => {
        switch (estado) {
            case 'iniciado':
                return { backgroundColor: 'var(--verde-agua)' };
            case 'completado':
                return { backgroundColor: 'var(--main-color)' };
            case 'cancelado':
                return { backgroundColor: 'var(--red)' };
            case 'cerrado':
                return { backgroundColor: '#2a2a2a' };
            default:
                return { backgroundColor: 'var(--border-color)' };

        }
    }
    const makeRows = (empresas) => {

        return empresas.map(empresa => {
            return (
                <div key={empresa._id} style={{ marginBottom: '30px' }}>
                    <div className={'empresa-info'}>
                        <img alt={'empresa' + empresa.cif} src={API_URL + '/' + empresa.logo} onError={(e) => e.target.src = logo} />
                        <b className="title" style={{ cursor: canClickEmpresa(empresa._id) ? 'pointer' : '' }} onClick={() => goToEmpresa(empresa._id)}>{empresa.nombre || empresa.nombreContacto}</b>
                        {hasPermission("CP") &&
                            <button className={'qr-btn add-btn not-mobile'} style={{ fontSize: '.8em', justifySelf: 'flex-end' }} onClick={() => handleNuevoProyecto(empresa._id)}>
                                <i className={'fa fa-plus'} />
                                <b>Proyecto</b>
                            </button>}
                    </div>

                    <div className={'children-container'}>
                        {
                            empresa && empresa.proyectos && empresa.proyectos.map(proyecto => {
                                return (
                                    <div className={'proyecto-item'} key={proyecto._id}>
                                        <div style={getLateralColor(proyecto.estado)} className={'lateral-indicator'}></div>
                                        <span className={'title'}
                                            style={{ cursor: canClickProyect(proyecto) ? 'pointer' : '' }}
                                            onClick={() => goToProyect(proyecto)}>{proyecto.nombre}</span>
                                        <div className={'buttons-row'}>
                                            {hasPermission("EP") && <i className={'fas fa-pencil-alt'} style={{ color: 'var(--verde-agua)', cursor: 'pointer' }} onClick={() => handleEditProyecto(proyecto)} />}
                                            {hasPermission("IP") && <div>
                                                <label htmlFor={proyecto._id}>
                                                    <i className={'fas fa-cogs'} style={{ color: 'var(--verde-agua)', cursor: 'pointer' }} />
                                                </label>
                                                <input id={proyecto._id} onChange={handleInputChange(proyecto._id)} ref={inputRef} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .xls" type="file" style={{ display: 'none' }} />
                                            </div>}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>)
        })
    };



    return (
        <React.Fragment>
            {makeRows(empresas)}
            <ModalFormProyecto options={empresaActive && { empresa: empresaActive }} proyecto={editProyecto} modalOpen={openModal} setModalOpen={setOpenModal} doCargar={doCargar} />
        </React.Fragment>
    );
}
