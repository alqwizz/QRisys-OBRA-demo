import React, { useEffect, useState } from 'react';
import { findById as findByIdEmpresa } from '../../utils/EmpresasUtils'
import { findAllByEmpresa, edit, create } from '../../utils/RolesUtils'
import { findAll as findAllPermisos } from '../../utils/PermisosUtils'
import useGlobal from "../../store/store";

const nuevoRolDefault = { nombre: 'NUEVOROL', permisos: [] }

export function RolesEmpresa({ idEmpresa }) {

    let [roles, setRoles] = useState([]);
    let [permisos, setPermisos] = useState([]);
    let [empresa, setEmpresa] = useState(null);
    let [loaded, setLoaded] = useState(false);
    let [rolSelected, setRolSelected] = useState(null);
    let [doingChanges, setDoingChanges] = useState(false)
    let [reset, setReset] = useState(true);
    let [creando, setCreando] = useState(false)
    const actions = useGlobal()[1];
    useEffect(() => {
        let unmounted = false;
        let p1 = findAllByEmpresa(idEmpresa).then(res => {
            const rolesRes = res.data.roles;
            if (!unmounted) setRoles(rolesRes)
        })
        let p2 = findAllPermisos().then(res => {
            const per = res.data.permisos;
            if (per) {
                let result = per.reduce(function (r, a) {
                    r[a.tipo] = r[a.tipo] || [];
                    r[a.tipo].push(a);
                    return r;
                }, Object.create(null));
                if (!unmounted) setPermisos(result);
            }
        })
        let p3 = findByIdEmpresa(idEmpresa).then(res => {
            if (!unmounted) setEmpresa(res.data.empresa)
        })
        Promise.all([p1, p2, p3]).then(values => {
            if (!unmounted) {
                setDoingChanges(false);
                setLoaded(true);
                setCreando(false);
            }
        })
        return () => { unmounted = true };
    }, [reset, idEmpresa])
    /*useEffect(() => {
        let unmounted = false;
        if (rolSelected && !unmounted) {
            setRolSelected(roles.find(x => x._id === rolSelected._id))
        }
        return () => { unmounted = true };
    }, [roles, rolSelected])*/
    useEffect(() => {
        if (empresa) {
            const breadcrumb = [
                { link: '/empresas', name: 'Empresas' },
                { link: '/detalleEmpresa/' + idEmpresa, name: empresa.cif },
                { link: '/roles', name: 'Roles' }]
            actions.setBreadcrumb(breadcrumb)
        }
    }, [actions, empresa, idEmpresa])
    const handleChangeSelectPermisos = (perm) => () => {

        if (rolSelected) {
            if (rolSelected.permisos.includes(perm._id)) {
                let permisosArray = JSON.parse(JSON.stringify(rolSelected.permisos));
                permisosArray.splice(permisosArray.indexOf(perm._id), 1);
                setRolSelected({ ...rolSelected, permisos: permisosArray })
            } else
                setRolSelected({ ...rolSelected, permisos: [...rolSelected.permisos, perm._id] })
        }
    }
    const handleGuardarEditar = () => {
        if (rolSelected._id)
            edit(rolSelected).then(res => setReset(!reset))
        else
            create(rolSelected).then(res => setReset(!reset))
    }
    const doReset = () => {
        setReset(!reset);
    }
    const handleNuevoRol = () => {
        setCreando(true);
        setRolSelected({ ...nuevoRolDefault, empresa: idEmpresa });
        setDoingChanges(true);
    }
    if (!loaded) return <p>Cargando...</p>
    return (
        <div>
            <div className="panel panel-transparent">
                <div className="panel-heading">
                    <div className="panel-title">GESTIÓN DE ROLES</div>
                    <div className="clearfix"></div>
                </div>
            </div>
            <div className="panel panel-transparent">
                <div className="panel-heading">
                    <div className="panel-title">ROL</div>
                    <div className="clearfix"></div>
                </div>
                <div className="col">
                    {roles.map(rol => {
                        return (
                            <div key={'input' + rol._id}>
                                <input disabled={doingChanges} onChange={() => setRolSelected(rol)} type="radio" value={rol._id} name="optionyes" id={rol._id} />
                                {(doingChanges && rolSelected && rolSelected._id === rol._id) && <input onChange={(event) => setRolSelected({ ...rolSelected, nombre: event.target.value })} type="text" value={rolSelected.nombre || ''} />}
                                {!(doingChanges && rolSelected && rolSelected._id === rol._id) && rol.nombre}
                            </div>
                        )
                    })}
                    {creando && < div key={'inputnuevorol'}>
                        <input disabled={doingChanges} checked={true} type="radio" value={0} name="optionyes" id={'nuevorol'} />
                        <input onChange={(event) => setRolSelected({ ...rolSelected, nombre: event.target.value })} type="text" value={rolSelected ? rolSelected.nombre : ''} />
                    </div>}
                    {!doingChanges && <button disabled={!rolSelected || doingChanges} onClick={() => setDoingChanges(true)} className="btn">Modificar</button>}
                    {!doingChanges && <button disabled={doingChanges} onClick={handleNuevoRol} className="btn">Nuevo rol</button>}
                    {doingChanges && <button onClick={handleGuardarEditar} className="btn">Guardar</button>}
                    {doingChanges && < button onClick={() => { doReset() }} className="btn">Cancelar</button>}
                </div>
            </div>
            {
                permisos && Object.keys(permisos).map(function (key) {
                    return (
                        <div key={key} className="panel panel-transparent">
                            <div className="panel-heading">
                                <div className="panel-title">{key.toLocaleUpperCase()}</div>
                                <div className="clearfix"></div>
                            </div>
                            <div className="row">
                                {permisos[key].map(perm => {
                                    return (
                                        <div key={perm._id}>
                                            <input disabled={!doingChanges} type="checkbox" onChange={handleChangeSelectPermisos(perm)} checked={rolSelected ? (rolSelected.permisos.includes(perm._id) ? true : false) : false} />{perm.nombre}
                                        </div>)
                                })}
                            </div>
                        </div>
                    )
                })
            }
        </div >)
}