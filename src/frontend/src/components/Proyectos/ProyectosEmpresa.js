import React, { useState, useEffect } from 'react'
import { findById as findByIdEmpresa } from '../../utils/EmpresasUtils'
import { findByEmpresa, findByUser } from '../../utils/ProyectosUtils';
import { navigate } from 'hookrouter';
import { TablaProyecto } from './Tablas/TablaProyecto'
import useGlobal from "../../store/store";
import { ModalFormProyecto } from './Modales/ModalFormProyecto';

export function ProyectosEmpresa({ idEmpresa }) {

    let [cargar, setCargar] = useState(true);
    let [proyectos, setProyectos] = useState([]);
    let [idEmpresaSelected, setIdEmpresaSelected] = useState(null);
    let [empresa, setEmpresa] = useState(null);
    let [loaded, setLoaded] = useState(false);
    let [modalOpen, setModalOpen] = useState(false);
    let [editProyecto, setEditProyecto] = useState(null);
    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();
    useEffect(() => {
        let unmounted = false;
        const hasPermission2 = actions.hasPermission();
        let promesas = []

        promesas.push(findByEmpresa(idEmpresaSelected).then(res => {
            if (!unmounted) setProyectos(res.data.proyectos);
        }))
        promesas.push(findByIdEmpresa(idEmpresaSelected).then(res => {
            if (!unmounted) setEmpresa(res.data.empresa);
        }))

        Promise.all(promesas).then(res => {
            if (!unmounted) setLoaded(true);
        })
        return () => { unmounted = true };
    }, [cargar, idEmpresaSelected, actions])

    useEffect(() => {
        let unmounted = false;
        if (idEmpresa && !unmounted) setIdEmpresaSelected(idEmpresa)
        return () => { unmounted = true };
    }, [idEmpresa])

    useEffect(() => {
        let unmounted = false;
        if (loaded) {
            let breadcrumb = [{ link: '/proyectos/' + idEmpresa, name: 'Proyectos' }]
            if (idEmpresa && empresa)
                breadcrumb = [
                    { link: '/empresas', name: 'Empresas' },
                    { link: '/detalleEmpresa/' + idEmpresa, name: empresa.cif },
                    { link: '/proyectos/' + idEmpresa, name: 'Proyectos' }
                ]
            if (!unmounted) actions.setBreadcrumb(breadcrumb)
        }
        return () => { unmounted = true };
    }, [loaded, empresa, actions, idEmpresa])

    const handleGestionar = (u) => () => {
        navigate('/detalleProyecto/' + u._id)
    }
    const handleEditar = (u) => () => {
        setEditProyecto(u)
        setModalOpen(true);
    }

    const handleNuevoProyecto = () => {
        if (editProyecto) setEditProyecto(null)
        setModalOpen(true);
    };
    const doCargar = () => {
        setCargar(!cargar);
    }
    const buttons = [
        { icon: 'fa fa-search', title: 'Ver proyecto', action: handleGestionar, hasPermission: true, color: 'var(--red)' },
        { icon: 'fa fa-edit', title: 'Editar proyecto', action: handleEditar, hasPermission: true, color: 'var(--blue)' }
    ]

    if (!loaded) return <p>Cargando...</p>
    return (
        <div className={'section'}>
            <div className={'section-heading'}>
                <div className={'title'}>
                    <h3>{empresa && empresa.cif} - GESTIÓN DE PROYECTOS</h3>
                </div>
                {hasPermission("CP") && <button onClick={handleNuevoProyecto} type="button" className="btn btn-info main">
                    <i className={'fa fa-plus'} />
                    <b>Nuevo proyecto</b>
                </button>}
            </div>
            <div className={'section-content'}>
                <TablaProyecto proyectos={proyectos} buttons={buttons} />
            </div>
            <ModalFormProyecto options={{ empresa: idEmpresa }} proyecto={editProyecto} doCargar={doCargar} modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </div >
    );
}
