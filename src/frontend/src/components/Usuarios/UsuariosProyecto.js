import React, { useState, useEffect } from 'react';
import { ModalFormUsuarios } from './Modales/ModalFormUsuarios';
import { quitarProyecto, findByProyecto } from '../../utils/UsuariosUtils';
import useGlobal from "../../store/store";
import { ModalTareasUsuarios } from '../Tareas/Modales/ModalTareasUsuarios';

import { findAllByEmpresa as findRolesByEmpresa } from '../../utils/RolesUtils'
import Lista from "../Globales/Lista";

export function UsuariosProyecto({ cargar, setCargar, idEmpresa, idProyecto }) {


    let [modalOpenUsuariosTareas, setModalOpenUsuariosTareas] = useState(false);
    let [modalOpenFormUsuarios, setModalOpenFormUsuarios] = useState(false);
    let [usuarios, setUsuarios] = useState([])
    let [loaded, setLoaded] = useState(false);
    let [roles, setRoles] = useState([]);
    let [usuarioEdit, setUsuarioEdit] = useState(null);
    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    useEffect(() => {
        let unmounted = false;
        let p2 = findByProyecto(idProyecto).then(res => {
            if (!unmounted) setUsuarios(res.data.users);
        })
        findRolesByEmpresa(idEmpresa).then(res => {
            if (!unmounted) setRoles(res.data.roles)
        })
        Promise.all([p2]).then(values => setLoaded(true));
        return () => { unmounted = true };
    }, [cargar, idProyecto, idEmpresa])



    const handleEditarUsuario = (usuario) => () => {
        setUsuarioEdit(usuario);
        setModalOpenFormUsuarios(true);
    }
    const handleTareasUsuario = (usuario) => () => {
        setUsuarioEdit(usuario);
        setModalOpenUsuariosTareas(true);
    }

    const handleNuevoUsuario = () => {
        setUsuarioEdit(null);
        setModalOpenFormUsuarios(true);
    }
    const handleQuitarUsuario = (usuario) => () => {
        quitarProyecto(idProyecto, usuario._id).then(res => {
            setCargar(!cargar);
        })
    }
    const doCargar = () => {
        setCargar(!cargar)
    };

    const buttons = [
        { icon: 'fa fa-edit', title: 'Editar', action: handleEditarUsuario, hasPermission: true ,color:'var(--blue)'},
        { icon: 'fa fa-tasks', title: 'Tareas asignadas', action: handleTareasUsuario, hasPermission: true, color:'var(--green)' },
        { icon: 'fa fa-trash-alt', title: 'Eliminar de proyecto', action: handleQuitarUsuario, hasPermission: true ,color:'var(--red)'}
    ];

    if (!loaded) return <div />
    return (
        <div>
            <div className="panel-body">
                <div className={"btn-group pull-right m-b-10"}>
                    {hasPermission(["CU", "CUP"]) && hasPermission("VAR") && <button onClick={handleNuevoUsuario} type="button" className="btn btn-default">Nuevo usuario</button>}
                </div>
                <div className="clearfix"></div>
                <Lista items={usuarios} titlePropertys={['nombre', 'apellidos']} buttons={buttons} />
                {/*<TablaUsuario usuarios={usuarios} buttons={buttons} />*/}
            </div>
            {usuarioEdit && <ModalTareasUsuarios idUsuario={usuarioEdit ? usuarioEdit._id : null} idProyecto={idProyecto} cargar={cargar} setCargar={setCargar} modalOpen={modalOpenUsuariosTareas} setModalOpen={setModalOpenUsuariosTareas} />}
            <ModalFormUsuarios roles={roles} usuario={usuarioEdit} doCargar={doCargar} options={{ idProyectos: [idProyecto], idEmpresas: [idEmpresa] }} modalOpen={modalOpenFormUsuarios} setModalOpen={setModalOpenFormUsuarios} />
        </div>
    )
}
