import React, { useState, useEffect } from 'react'
import { findAll } from '../../utils/EmpresasUtils';
import { usePath, navigate } from 'hookrouter'
import useGlobal from "../../store/store";
import { ModalFormEmpresas } from './Modales/ModalFormEmpresas';
import { TablaEmpresa } from './Tablas/TablaEmpresa';
import './Empresas.css';

export function Empresas({setTitle}) {
    let [cargar, setCargar] = useState(true)
    let [empresas, setEmpresas] = useState([])
    let [loaded, setLoaded] = useState(false)
    let [modalOpen, setModalOpen] = useState(false);
    let [empresa, setEmpresa] = useState(null);
    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();
    const path = usePath();

    if (path !== '/empresas')
        navigate('/empresas');
    useEffect(() => {
        let unmounted = false;
        findAll().then(res => {
            const empresas = res.data.empresas;
            if (!unmounted) {
                setEmpresas(empresas);
                setLoaded(true);
            }

        });
        return () => { unmounted = true };
    }, [cargar]);

    useEffect(() => {
        let unmounted = false;
        setTitle("Empresas y Proyectos")
        const breadcrumb = [{ link: '/empresas', name: 'Empresas' }]
        if (!unmounted) actions.setBreadcrumb(breadcrumb)
        return () => { unmounted = true };
    }, [actions]);

    const handleNuevaEmpresa = () => {
        if (empresa) setEmpresa(null);
        setModalOpen(true)
    };
    const doCargar = () => {
        setCargar(!cargar)
    };
    if (!loaded) return <p>Cargando...</p>
    return (
        <div className={'section'}>
            <div className={'section-content'}>
                <div className={'section-body'}>
                    <div className={'section-body--body'}>
                        {hasPermission("CE") &&
                        <button onClick={handleNuevaEmpresa} type="button" className="qr-btn add-btn">
                            <i className={'fa fa-plus'} />
                            <b>Empresa</b>
                        </button>}
                        <TablaEmpresa empresas={empresas} doCargar={doCargar} />
                    </div>
                </div>
            </div>
            <ModalFormEmpresas empresa={empresa} doCargar={doCargar} modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </div>
    );
}
