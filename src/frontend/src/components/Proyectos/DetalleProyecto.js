import React, { useState, useEffect } from 'react';
import { findById } from '../../utils/ProyectosUtils'
import { TareasProyecto } from '../Tareas/TareasProyecto';
import useGlobal from "../../store/store";
import { ModalFormProyecto } from './Modales/ModalFormProyecto';
import GestorCompras from "../GestorCompras/GestorCompras";
import GestorPersonal from "../GestorPersonal/GestorPersonal";
import { navigate } from 'hookrouter'
import Dashboard from '../Dashboard/Dashboard';

export function DetalleProyecto({ idProyecto, origin, setTitle }) {

    let [proyecto, setProyecto] = useState(null);
    let [loaded, setLoaded] = useState(false);
    let [cargar, setCargar] = useState(false);
    //let [openUsuarios, setOpenUsuarios] = useState(false);
    //let [openAdquisiciones, setOpenAdquisiciones] = useState(false);

    let [openTareas, setOpenTareas] = useState(null);
    const [openGestor, setOpenGestor] = useState(false);
    const [openPersonal, setOpenPersonal] = useState(false);
    const [openDashboard, setOpenDashboard] = useState(false);

    let [modalOpenForm, setModalOpenForm] = useState(false);
    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    useEffect(() => {
        let unmounted = false;
        if (origin) {
            if (origin === 'tareasOrdenadas' || origin === 'tareas') {
                if (hasPermission(['VTO', 'VAT', 'VG'])) {
                    if (!unmounted) {
                        setOpenTareas(true)
                        setOpenGestor(false);
                        setOpenPersonal(false)
                        setOpenDashboard(false)
                    }
                }
            }
            if (origin === 'compras') {
                if (!unmounted) {
                    setOpenTareas(false)
                    setOpenGestor(true);
                    setOpenPersonal(false)
                    setOpenDashboard(false)
                }
            }
            if (origin === 'personal') {
                if (!unmounted) {
                    setOpenTareas(false)
                    setOpenGestor(false);
                    setOpenPersonal(true)
                    setOpenDashboard(false)
                }
            }
            if (origin === 'dashboard') {
                setOpenTareas(false)
                setOpenGestor(false);
                setOpenPersonal(false)
                setOpenDashboard(true)
            }
        } else {
            if (hasPermission(['VTO', 'VAT', 'VG'])) {
                if (!unmounted) {
                    setOpenTareas(true)
                    setOpenGestor(false);
                    setOpenPersonal(false)
                    setOpenDashboard(false)
                }
            }
            else if (hasPermission(['VGCP', 'VGPE'])) {
                if (!unmounted) {
                    setOpenTareas(false)
                    setOpenGestor(true);
                    setOpenPersonal(false)
                    setOpenDashboard(false)
                }
            }
            else if (hasPermission(['VGPPT', 'VGPE'])) {
                if (!unmounted) {
                    setOpenTareas(false)
                    setOpenGestor(false);
                    setOpenPersonal(true)
                    setOpenDashboard(false)
                }
            } else if (hasPermission(['VDH', 'VCO', 'VMR'])) {
                setOpenTareas(false)
                setOpenGestor(false);
                setOpenPersonal(false)
                setOpenDashboard(true)
            }
            else navigate('/empresas')
        }
        return () => { unmounted = true };
    }, [origin])

    useEffect(() => {
        let unmounted = false;
        findById(idProyecto).then(res => {
            const proy = res.data.proyecto
            if (!unmounted) {
                if (proy) {
                    setProyecto(proy);
                    setLoaded(true);
                } else navigate('/empresas')
            }
        })
        return () => { unmounted = true };
    }, [cargar, idProyecto]);

    useEffect(() => {
        let unmounted = false;
        if (loaded) {
            setTitle(proyecto.nombre)
            const breadcrumb = [
                { link: '/empresas', name: 'Empresas' },
                { link: '/detalleEmpresa/' + proyecto.empresa._id, name: proyecto.empresa.cif },
                { link: '/detalleProyecto/' + idProyecto, name: proyecto.nombre }];
            if (!unmounted) actions.setBreadcrumb(breadcrumb);
            return () => { unmounted = true };
        }
    }, [loaded, proyecto, actions, idProyecto]);

    // const handleUsuarios = () => {
    //     if (!openUsuarios) setOpenUsuarios(true);
    //     if (openTareas) setOpenTareas(false);
    //     if (openAdquisiciones) setOpenAdquisiciones(false);
    //     if (openGestor) setOpenGestor(false);
    // }
    const handleTareas = () => {
        if (!openTareas) setOpenTareas(true);
        if (openGestor) setOpenGestor(false);
        if (openPersonal) setOpenPersonal(false);
        if (openDashboard) setOpenDashboard(false);
    };
    const handleGestorCompras = () => {
        if (openTareas) setOpenTareas(false);
        if (openPersonal) setOpenPersonal(false);
        if (!openGestor) setOpenGestor(true);
        if (openDashboard) setOpenDashboard(false);
    };
    const handlePersonal = () => {
        if (!openPersonal) setOpenPersonal(true);
        if (openTareas) setOpenTareas(false);
        if (openGestor) setOpenGestor(false);
        if (openDashboard) setOpenDashboard(false);
    };
    const handleDashboard = () => {
        if (!openDashboard) setOpenDashboard(true);
        if (openTareas) setOpenTareas(false);
        if (openGestor) setOpenGestor(false);
        if (openPersonal) setOpenPersonal(false);
    };

    const doCargar = () => {
        setCargar(!cargar);
    }
    const handleEditarProyecto = () => {
        setModalOpenForm(true);
    }
    if (!loaded) return <p>Cargando...</p>
    if (!proyecto) return <p>El proyecto indicado no existe o no tiene permisos para verlo.</p>

    return (
        <div className={'section'}>
            <div className={'section-heading'}>
                <div className={'selectors main'}>
                    {hasPermission(['VTO', 'VAT', 'VG']) && <span className={'selector_item' + (openTareas ? " active" : '')} onClick={handleTareas}>
                        Tareas
                    </span>}
                    {hasPermission(['VGCP', 'VGCPE']) && <span className={'selector_item' + (openGestor ? " active" : '')} onClick={handleGestorCompras}>
                        Compras
                    </span>}
                    {hasPermission(['VGPE', 'VGPPT']) && <span className={'selector_item' + (openPersonal ? " active" : "")} onClick={handlePersonal}>
                        Personal
                    </span>}
                    {hasPermission(['VDH', 'VCO', 'VMR']) && <span className={'selector_item' + (openDashboard ? " active" : "")} onClick={handleDashboard} >
                        Dashboard
                    </span>}
                    {hasPermission("CA") && <button onClick={() => { navigate('/avisos/' + proyecto._id) }} className={'qr-btn add-btn not-mobile'} style={{position:'absolute',fontSize:'12px',right:'15px',tranasform:'translateY(-50%)'}}>
                            <i className="fa fa-bell" />
                            <b>Avisos</b>
                        </button>}
                </div>
            </div>
            <div className={'section-content'}>

                {proyecto && <ModalFormProyecto proyecto={proyecto} doCargar={doCargar} modalOpen={modalOpenForm} setModalOpen={setModalOpenForm} />}
                {/*{openUsuarios && <UsuariosProyecto idProyecto={idProyecto} idEmpresa={proyecto.empresa._id} cargar={cargar} setCargar={setCargar} />}*/}
                {openTareas && <TareasProyecto origin={origin} proyecto={proyecto} doCargar={doCargar} />}
                {openGestor && <GestorCompras proyecto={proyecto} />}
                {openPersonal && <GestorPersonal proyecto={proyecto} />}
                {openDashboard && <Dashboard proyecto={proyecto} />}

            </div>
        </div >
    )

}
