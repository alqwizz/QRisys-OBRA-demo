import React, { useState, useEffect } from 'react'
import useGlobal from "../../store/store";
import { findById as findEmpresaById, edit } from '../../utils/EmpresasUtils';
import { findByEmpresa } from '../../utils/UsuariosUtils';
import { findAll as findAllRoles } from '../../utils/RolesUtils'
import { ModalFormUsuarios } from './Modales/ModalFormUsuarios';
import { TablaUsuario } from './Tablas/TablaUsuario'
import { ModalFormCredentials } from './Modales/ModalFormCredentials';
import { ModalAsignarUsuariosProyecto } from './Modales/ModalAsignarUsuariosProyecto';
export function UsuariosEmpresa({ idEmpresa }) {

    let [cargar, setCargar] = useState(true)
    let [editUsuario, setEditUsuario] = useState(null)
    let [usuarios, setUsuarios] = useState([])
    let [empresa, setEmpresa] = useState(null)
    let [proyectos, setProyectos] = useState([])
    let [roles, setRoles] = useState([]);
    let [loaded, setLoaded] = useState(false)
    let [modalOpen, setModalOpen] = useState(false);
    let [modalOpenCredentials, setModalOpenCredentials] = useState(false);
    let [modalOpenProyectos, setModalOpenProyectos] = useState(false);

    const actions = useGlobal()[1];

    useEffect(() => {
        let unmounted = false;
        let p1 = findByEmpresa(idEmpresa).then(res => {
            if (!unmounted) setUsuarios(res.data.users);
        });
        let p2 = findEmpresaById(idEmpresa).then(res => {
            if (!unmounted) {
                setProyectos(res.data.proyectos);
                setEmpresa(res.data.empresa);
            }
        });
        findAllRoles(idEmpresa).then(res => {
            if (!unmounted) setRoles(res.data.roles)
        })
        Promise.all([p1, p2]).then(res => {
            if (!unmounted) setLoaded(true);
        })
        return () => { unmounted = true };
    }, [cargar, idEmpresa])
    useEffect(() => {
        if (editUsuario && editUsuario._id) {
            const find = usuarios.find(x => x._id + '' === editUsuario._id + '');
            setEditUsuario(find)
        }
    }, [usuarios])
    useEffect(() => {
        let unmounted = false;
        if (loaded) {
            const breadcrumb = [
                { link: '/empresas', name: 'Empresas' },
                { link: '/detalleEmpresa/' + idEmpresa, name: empresa.cif },
                { link: '/usuarios/' + idEmpresa, name: 'Usuarios' }]
            if (!unmounted) actions.setBreadcrumb(breadcrumb)
        }
        return () => { unmounted = true };
    }, [loaded, actions, empresa, idEmpresa])
    const doCargar = () => {
        setCargar(!cargar)
    }
    const handleNuevo = () => {
        if (editUsuario) setEditUsuario(null)
        setModalOpen(true)
    }
    const handleButtonEditar = (u) => () => {
        setEditUsuario(u)
        setModalOpen(true)
    }
    const handleButtonCredentials = (u) => () => {
        setEditUsuario(u)
        setModalOpenCredentials(true)
    }
    const handleGestionarProyectos = (u) => () => {
        setModalOpenProyectos(true)
        setEditUsuario(u);
    }
    const buttons = [
        { icon: 'fa fa-user-edit', title: '', action: handleButtonEditar, hasPermission: true,color:'var(--verde-agua)' },
        { icon: 'fa fa-tasks', title: '', action: handleGestionarProyectos, hasPermission: true,color:'var(--verde-agua)' },
        { icon: 'fa fa-key', title: '', action: handleButtonCredentials, hasPermission: true,color:'var(--verde-agua)' }
    ]

    if (!loaded) return <p>Cargando</p>
    return (
        <div className={'section-body'}>
            <div className="section-body--header" style={{display:'flex'}}>
                <div className="title" style={{width:'max-content'}}> <b>GESTIÓN DE USUARIOS</b>
                </div>
                <button className={'qr-btn add-btn'} onClick={handleNuevo} >
                    <i className={'fa fa-plus'} />
                    <b>Usuario</b>
                </button>
            </div>
            <div className="section-body--body">
                <TablaUsuario usuarios={usuarios} buttons={buttons} />
            </div>
            <ModalFormCredentials
                idUsuario={editUsuario ? editUsuario._id : null}
                doCargar={doCargar}
                modalOpen={modalOpenCredentials}
                setModalOpen={setModalOpenCredentials} />
            <ModalFormUsuarios
                roles={roles}
                usuario={editUsuario}
                doCargar={doCargar}
                options={{ empresas: [idEmpresa] }}
                modalOpen={modalOpen}
                setModalOpen={setModalOpen} />
            <ModalAsignarUsuariosProyecto usuario={editUsuario} doCargar={doCargar} proyectos={proyectos} modalOpen={modalOpenProyectos} setModalOpen={setModalOpenProyectos} />
        </div >
    );

}
