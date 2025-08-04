import React, { useEffect, useState } from 'react';
import { findAll, edit, create } from '../../utils/RolesUtils'
import { findAll as findAllPermisos } from '../../utils/PermisosUtils'
import useGlobal from "../../store/store";
import {navigate} from "hookrouter";
import './Roles.css';

const nuevoRolDefault = { nombre: 'NUEVOROL', permisos: [] }

export function Roles() {

    let [roles, setRoles] = useState([]);
    let [permisos, setPermisos] = useState([]);
    let [loaded, setLoaded] = useState(false);
    let [rolSelected, setRolSelected] = useState(null);
    let [doingChanges, setDoingChanges] = useState(false)
    let [reset, setReset] = useState(true);
    let [creando, setCreando] = useState(false)
    const actions = useGlobal()[1];
    useEffect(() => {
        let unmounted = false;
        let p1 = findAll().then(res => {
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
        Promise.all([p1, p2]).then(values => {
            if (!unmounted) {
                setDoingChanges(false);
                setLoaded(true);
                setCreando(false);
            }
        })
        return () => { unmounted = true };
    }, [reset])
    useEffect(() => {
        const breadcrumb = [{ link: '/roles', name: 'Roles' }]
        actions.setBreadcrumb(breadcrumb)
    }, [actions])
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
            edit(rolSelected).then(res => {
                const rol = res.data.rol;
                setRolSelected(rol)
                setReset(!reset)
                setDoingChanges(false);
            })
        else
            create(rolSelected).then(res => {
                setReset(!reset)
            })
    }
    const doReset = () => {
        setReset(!reset);
    }
    const handleNuevoRol = () => {
        setCreando(true);
        setRolSelected(nuevoRolDefault);
        setDoingChanges(true);
    }
    const handleChangePantallas = (pantalla) => () => {
        setRolSelected({ ...rolSelected, pantallaOrigen: pantalla })
    }
    if (!loaded) return <p>Cargando...</p>
    return (
        <div className={'section'}>
            <div className="section-heading">
                <div className="panel-heading">
                    <div className={'title'} style={{ width: '100%', textAlign: 'center' }}>
                        <h3 style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
                            GESTIÓN DE ROLES
                        </h3>
                    </div>
                </div>
            </div>
            <div className={'section-content'}>
                <div className="section-body">
                    <div className="rol-panel">
                        <div className="rol-title">ROLES</div>
                        <div className="roles-container">
                            {roles.map(rol => {
                                return (
                                    <div className={'form-group'} style={{marginBottom:'0'}}>
                                        <div key={'input' + (rol && rol._id ? rol._id : 'rolnuevo')} className={'radio radio-success'} style={{ display: 'flex', marginTop: '0' }}>
                                            <input disabled={doingChanges}
                                                   onChange={() => setRolSelected(rol)}
                                                   type="radio"
                                                   value={rol._id}
                                                   name="optionyes"
                                                   id={rol._id}/>
                                            <label htmlFor={rol._id}> {!(doingChanges && rolSelected && rolSelected._id === rol._id) && rol.nombre}</label>
                                            {(doingChanges && rolSelected && rolSelected._id === rol._id) && <input onChange={(event) => setRolSelected({ ...rolSelected, nombre: event.target.value })} type="text" value={rolSelected.nombre || ''} />}
                                        </div>
                                    </div>
                                    // <div key={'input' + (rol && rol._id ? rol._id : 'rolnuevo')}>
                                    //     <input
                                    //         disabled={doingChanges}
                                    //         onChange={() => setRolSelected(rol)}
                                    //         type="radio"
                                    //         value={rol._id}
                                    //         name="optionyes"
                                    //         id={rol._id} />

                                    // {!(doingChanges && rolSelected && rolSelected._id === rol._id) && rol.nombre}
                                    // </div>
                                )
                            })}
                            {creando && < div key={'inputnuevorol'}>
                                <input disabled={doingChanges} checked={true} type="radio" value={0} name="optionyes" id={'nuevorol'} />
                                <input onChange={(event) => setRolSelected({ ...rolSelected, nombre: event.target.value })} type="text" value={rolSelected ? rolSelected.nombre : ''} />
                            </div>}
                        </div>
                        <div>
                            {!doingChanges && <button disabled={!rolSelected || doingChanges} onClick={() => setDoingChanges(true)} className="qr-btn blue m-r-15">Modificar</button>}
                            {!doingChanges && <button disabled={doingChanges} onClick={handleNuevoRol} className="qr-btn add-btn"><i className={'fa fa-plus'}/><b>rol</b></button>}
                            {doingChanges && <button onClick={handleGuardarEditar} className="qr-btn green m-r-15"><b style={{color:'white'}}>Guardar</b></button>}
                            {doingChanges && < button onClick={() => { doReset() }} className="qr-btn red"><b style={{color:'white'}}>Cancelar</b></button>}
                        </div>
                    </div>

                    <div className={'rol-panel'}>
                        <div className="rol-title">PERMISOS</div>
                        {
                            permisos && Object.keys(permisos).map(function (key) {
                                return (
                                    <div key={key} className="permisos-panel">
                                        <div className="rol-title">{key.toLocaleUpperCase()}</div>
                                        <div className="roles-container">
                                            {permisos[key].map(perm => {
                                                return (
                                                    <div key={perm._id} className={'form-group'} style={{marginBottom:'0'}}>
                                                        <div  className={'checkbox check-success'}>
                                                            <input id={perm._id} disabled={!doingChanges} type="checkbox" onChange={handleChangeSelectPermisos(perm)} checked={rolSelected ? (rolSelected.permisos.includes(perm._id) ? true : false) : false} />
                                                            <label htmlFor={perm._id}>{perm.nombre}</label>
                                                        </div>
                                                    </div>
                                                    )
                                            })}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className={'rol-panel'}>
                        <div className="rol-title">PANTALLAS</div>
                        <div className={'roles-container'}>
                            <div className={'form-group'} style={{marginBottom:'0'}}>
                                <div className={'radio radio-success'} style={{ display: 'flex', marginTop: '0' }}>
                                    <input id={'empresas'} checked={(rolSelected && rolSelected.pantallaOrigen === '/empresas') ? true : false} value="/empresas" onChange={handleChangePantallas('/empresas')} disabled={!doingChanges} type="radio" name="pantallas" />
                                    <label htmlFor={'empresas'}>Gestión de empresas y proyectos</label>
                                </div>
                            </div>
                            <div className={'form-group'} style={{marginBottom:'0'}}>
                                <div className={'radio radio-success'} style={{ display: 'flex', marginTop: '0' }}>
                                    <input id='tareas' checked={(rolSelected && rolSelected.pantallaOrigen === '/detalleProyecto/:idProyecto/tareasOrdenadas') ? true : false} value="/detalleProyecto/:idProyecto/tareasOrdenadas" onChange={handleChangePantallas('/detalleProyecto/:idProyecto/tareasOrdenadas')} disabled={!doingChanges} type="radio" name="pantallas" />
                                    <label htmlFor={'tareas'}>Listado de tareas ordenadas</label>
                                </div>
                            </div>
                            <div className={'form-group'} style={{marginBottom:'0'}}>
                                <div className={'radio radio-success'} style={{ display: 'flex', marginTop: '0' }}>
                                    <input id={'all-tareas'} checked={(rolSelected && rolSelected.pantallaOrigen === '/detalleProyecto/:idProyecto/tareas') ? true : false} value='/detalleProyecto/:idProyecto/tareas' onChange={handleChangePantallas('/detalleProyecto/:idProyecto/tareas')} disabled={!doingChanges} type="radio" name="pantallas" />
                                    <label htmlFor={'all-tareas'}>Listado completo de tareas</label>
                                </div>
                            </div>
                            <div className={'form-group'} style={{marginBottom:'0'}}>
                                <div className={'radio radio-success'} style={{ display: 'flex', marginTop: '0' }}>
                                    <input id={'compras'} checked={(rolSelected && rolSelected.pantallaOrigen === '/detalleProyecto/:idProyecto/compras') ? true : false} value='/detalleProyecto/:idProyecto/compras' onChange={handleChangePantallas('/detalleProyecto/:idProyecto/compras')} disabled={!doingChanges} type="radio" name="pantallas" />
                                    <label htmlFor={'compras'}>Gestor de compras</label>
                                </div>
                            </div>
                            <div className={'form-group'} style={{marginBottom:'0'}}>
                                <div className={'radio radio-success'} style={{ display: 'flex', marginTop: '0' }}>
                                    <input id={'personal'} checked={(rolSelected && rolSelected.pantallaOrigen === '/detalleProyecto/:idProyecto/personal') ? true : false} value='/detalleProyecto/:idProyecto/personal' onChange={handleChangePantallas('/detalleProyecto/:idProyecto/personal')} disabled={!doingChanges} type="radio" name="pantallas" />
                                    <label htmlFor={'personal'}>Gestor de personal</label>
                                </div>
                            </div>
                            <div className={'form-group'} style={{marginBottom:'0'}}>
                                <div className={'radio radio-success'} style={{ display: 'flex', marginTop: '0' }}>
                                    <input id={'dashboard'} checked={(rolSelected && rolSelected.pantallaOrigen === '/detalleProyecto/:idProyecto/dashboard') ? true : false} value='/detalleProyecto/:idProyecto/dashboard' onChange={handleChangePantallas('/detalleProyecto/:idProyecto/dashboard')} disabled={!doingChanges} type="radio" name="pantallas" />
                                    <label htmlFor={'dashboard'}>Dashboard</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >)
}
