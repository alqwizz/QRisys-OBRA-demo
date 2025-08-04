import React, { useState, useEffect } from 'react';
import { findByPersonal } from "../../utils/EmpresasSubcontrataUtils";
import ListaEmpresasPersonal from "./ListaEmpresasPersonal";
import { findByProyecto } from '../../utils/ParteAsistenciaUtils';
import ListaPartes from "./ListaPartes";
import './GestorPersonal.css';
import useGlobal from "../../store/store";

export default function GestorPersonal({ proyecto }) {
    const [activeTab, setActiveTab] = useState(null);
    const [search, setSearch] = useState('')
    const [empresasPersonal, setEmpresasPersonal] = useState([]);
    const [cargar, setCargar] = useState(false);

    const [partesProyecto, setPartesProyecto] = useState([]);

    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();
    useEffect(() => {
        if (hasPermission("VGPE")) setActiveTab('personal')
        else setActiveTab('partes')
    }, [])
    useEffect(() => {
        findByPersonal(proyecto._id, search).then(response => {
            setEmpresasPersonal(response.data.empresasSubcontratas);
        });
        findByProyecto(proyecto._id).then(response => {
            setPartesProyecto(response.data.partesAsistencia);
        })
    }, [search, setEmpresasPersonal, cargar, proyecto._id]);


    const showTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const doCargar = () => {
        setCargar(!cargar);
    };



    return (
        <div className={'section-body'}>
            <div className={'section-body--header'} style={{ marginBottom: '15px', justifyContent: 'center' }}>
                <div className={'selectors'}>
                    {hasPermission("VGPE") && <span className={'selector_item' + (activeTab === 'personal' ? ' active' : '')} onClick={() => showTab('personal')}>Personal</span>}
                    {hasPermission("VGPPT") && <span className={'selector_item' + (activeTab === 'partes' ? ' active' : '')} onClick={() => showTab('partes')}>Partes</span>}
                </div>

            </div>
            <div className={'section-body--body'} >
                {activeTab === 'personal' && <ListaEmpresasPersonal empresas={empresasPersonal} doCargar={doCargar} />}
                {activeTab === 'partes' && <ListaPartes partes={partesProyecto} doCargar={doCargar} />}
            </div>

        </div>
    )
}
