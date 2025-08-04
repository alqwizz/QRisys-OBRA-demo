import React, { useEffect, useState } from 'react';
import { AutocompleteSelect } from "../Globales/AutocompleteSelect/AutocompleteSelect";
import Adquisicion from "../../entidades/Adquisicion";
import { findByEmpresaSub, findByProyectoNombre, findByNombre } from '../../utils/AdquisicionesUtils';
import EmpresaSubcontrata from "../../entidades/Empresa";
import useGlobal from "../../store/store";

export default function EmpresaSubForm({ proyectoId, setOpenModal, modalOpen, empresa, doCargar, fromPedido }) {

    const state = useGlobal()[0];
    const [nuevaEmpresa, setNuevaEmpresa] = useState(new EmpresaSubcontrata(empresa ? empresa : { proyecto: proyectoId }));

    const [addingAdquisicion, setAddingAdquisicion] = useState(false);

    const [errorsEmpresa, setErrorsEmpresa] = useState(false);
    const [errorsAdquisicion, setErrorsAdquisicion] = useState(null);
    const [nuevaAdquisicion, setNuevaAdquisicion] = useState(new Adquisicion({ proyecto: proyectoId }));
    const [adquisicionesProyecto, setAdquisicionesProyecto] = useState([]);
    const [adquisicionesEmpresa, setAdquisicionesEmpresa] = useState(empresa ? empresa.adquisiciones : []);


    useEffect(() => {
        setNuevaEmpresa(new EmpresaSubcontrata(empresa ? empresa : { proyecto: proyectoId }));
        //setAdquisicionesEmpresa(empresa ? empresa.adquisiciones : []);
        setAddingAdquisicion(false);
        setNuevaAdquisicion(new Adquisicion({ proyecto: proyectoId }));
        findByProyectoNombre(proyectoId).then(response => {
            setAdquisicionesProyecto(response.data.adquisiciones);
        });
        if (empresa && empresa._id)
            findByEmpresaSub(empresa._id).then(res => {
                setAdquisicionesEmpresa(res.data.adquisiciones);
            });
        else setAdquisicionesEmpresa([])
    }, [empresa, proyectoId]);


    function selectAdquisicion(option) {
        if (empresa && empresa._id) {
            findByNombre(proyectoId, empresa._id, option).then(response => {
                let adq = response.data.adquisicion;
                if (adq !== null) {
                    setNuevaAdquisicion({ nombre: adq.nombre, proyecto: proyectoId, empresaSubcontrata: empresa._id, precio: adq.precio, unidad: adq.unidad, tipo: adq.tipo, tareas: adq.tareas });
                } else {
                    setNuevaAdquisicion({ nombre: option, proyecto: proyectoId, empresaSubcontrata: empresa._id, tareas: [] });
                }
            }).catch(err => console.error(err));
        } else {
            setNuevaAdquisicion({ nombre: option, proyecto: proyectoId });
        }

    }

    const hasErrors = (errors) => {
        let res = false;
        for (let prop in errors) {
            if (errors.hasOwnProperty(prop) && errors[prop] !== '') {
                res = true;
                break;
            }
        }
        return res;
    };
    const handleXRecursos = (adquisicion) => () => {
        setAdquisicionesEmpresa(adquisicionesEmpresa.filter(x => x._id + '' !== adquisicion._id + ''))
    };

    const crearEmpresa = () => {
        let newEmpresa = new EmpresaSubcontrata(nuevaEmpresa);
        newEmpresa.setAdquisiciones(adquisicionesEmpresa);
        let errors = newEmpresa.validate();
        setErrorsEmpresa(errors);
        if (!hasErrors(errors)) {
            if (!empresa) {
                newEmpresa.save().then(res => {
                    setOpenModal(false);
                    doCargar();
                }).catch(e => console.error(e));
            }
            if (empresa) {
                newEmpresa.edit(empresa._id, state.userSession._id).then(response => {
                    if (response.data.status === 200) {
                        setOpenModal(false);
                        doCargar();
                    }
                });
            }
        }
    };

    function addAdquisicion(e) {
        e.preventDefault();
        const newAdquisicion = new Adquisicion(nuevaAdquisicion);
        const errors = newAdquisicion.validate();
        setErrorsAdquisicion(errors);
        if (!hasErrors(errors)) {
            if (newAdquisicion.nombre) {
                let actualAdquisiciones = [...adquisicionesEmpresa];
                let encontrada = false;
                for (let i = 0; i < actualAdquisiciones.length; i++) {
                    if (actualAdquisiciones[i].nombre === newAdquisicion.nombre) {
                        actualAdquisiciones[i] = newAdquisicion;
                        encontrada = true;
                        break;
                    }
                }
                if (encontrada) {
                    setAdquisicionesEmpresa(actualAdquisiciones);
                    if (fromPedido) empresa.setAdquisiciones(actualAdquisiciones);
                }
                if (!encontrada) {
                    setAdquisicionesEmpresa([...adquisicionesEmpresa, newAdquisicion]);
                    if (fromPedido) empresa.setAdquisiciones([...adquisicionesEmpresa, newAdquisicion]);
                }
                setAddingAdquisicion(false);
                setNuevaAdquisicion(new Adquisicion({ proyecto: proyectoId }));
            }
        }
    }


    return (
        <React.Fragment>
            <div className={'modal-body'}>
                <form>
                    <div className={'row'}>
                        <div className={'col-sm-12 col-md-6'}>
                            <div className={'form-group form-group-default required' + (errorsEmpresa && errorsEmpresa.nombre && errorsEmpresa.nombre.length > 0 ? " has-error" : "")}>
                                <label>Nombre empresa</label>
                                <input type={"text"} value={nuevaEmpresa.nombre} name={'name'} aria-required={true} className={'form-control'} onChange={(e) => {
                                    if (fromPedido) empresa.setNombre(e.target.value);
                                    setNuevaEmpresa({ ...nuevaEmpresa, nombre: e.target.value })
                                }
                                } />
                                {errorsEmpresa && errorsEmpresa.nombre && errorsEmpresa.nombre.length > 0 && <label id="error" className="error">{errorsEmpresa.nombre}</label>}
                            </div>
                        </div>
                        <div className={'col-sm-12 col-md-6'}>
                            <div className={'form-group form-group-default required' + (errorsEmpresa && errorsEmpresa.cif && errorsEmpresa.cif.length > 0 ? " has-error" : "")}>
                                <label>CIF empresa</label>
                                <input type={"text"} value={nuevaEmpresa.cif} name={'name'} aria-required={true} className={'form-control'} onChange={(e) => {
                                    if (fromPedido) empresa.setCif(e.target.value)
                                    setNuevaEmpresa({ ...nuevaEmpresa, cif: e.target.value })
                                }
                                } />
                                {errorsEmpresa && errorsEmpresa.cif && errorsEmpresa.cif.length > 0 && <label id="error" className="error">{errorsEmpresa.cif}</label>}
                            </div>
                        </div>
                    </div>

                    <div className={'row'}>
                        <div className={'col-sm-12 col-md-6'}>
                            <div className={'form-group form-group-default required' + (errorsEmpresa && errorsEmpresa.nombreContacto && errorsEmpresa.nombreContacto.length > 0 ? " has-error" : "")}>
                                <label>Nombre de contacto</label>
                                <input type={'text'} name={'nombreContacto'} value={nuevaEmpresa.nombreContacto} aria-required={true} className={'form-control'} onChange={(e) => {
                                    if (fromPedido) empresa.setNombreContacto(e.target.value);
                                    setNuevaEmpresa({ ...nuevaEmpresa, nombreContacto: e.target.value });
                                }} />
                                {errorsEmpresa && errorsEmpresa.nombreContacto && errorsEmpresa.nombreContacto.length > 0 && <label id="error" className="error">{errorsEmpresa.nombreContacto}</label>}
                            </div>
                        </div>
                        <div className={'col-sm-12 col-md-6'}>
                            <div className={'form-group form-group-default'}>
                                <label>Teléfono</label>
                                <input type={'text'} name={'phone'} aria-required={true} value={nuevaEmpresa.telefono} className={'form-control'} onChange={(e) => {
                                    if (fromPedido) empresa.setTelefono(e.target.value)
                                    setNuevaEmpresa({ ...nuevaEmpresa, telefono: e.target.value })
                                }} />
                            </div>
                        </div>
                    </div>

                    <div className={'row'}>
                        <div className={'col-sm-12'}>
                            <div className={'form-group form-group-default'}>
                                <label>Email</label>
                                <input type={'text'} name={'email'} aria-required={true} value={nuevaEmpresa.email} className={'form-control'} onChange={(e) => {
                                    if (fromPedido) empresa.setEmail(e.target.value)
                                    setNuevaEmpresa({ ...nuevaEmpresa, email: e.target.value })
                                }
                                } />
                            </div>
                        </div>
                    </div>
                </form>
                <b>Recursos</b>
                {errorsEmpresa && errorsEmpresa.adquisiciones.length > 0 && <label id="error" className="error">{errorsEmpresa.adquisiciones}</label>}
                <div style={{ overflow: 'scroll', maxHeight: '165px', boxShadow: 'inset var(--shadow-1)', marginBottom: '15px' }}>
                    {adquisicionesEmpresa.map((adquisicionEmpresa, i) => {
                        return (
                            <div key={i} style={{ backgroundColor: '#addead8c', padding: '8px', margin: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <span>{adquisicionEmpresa.nombre}</span> <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{adquisicionEmpresa.tipo}</span> <span style={{ fontWeight: 'bold' }}>. {(adquisicionEmpresa.precio || '-') + ' € /' + (adquisicionEmpresa.unidad ? adquisicionEmpresa.unidad : 'unidades')}</span>
                                </div>
                                <span onClick={handleXRecursos(adquisicionEmpresa)} style={{ cursor: 'pointer', border: 'solid 1px', padding: '0 4px', borderRadius: '4px' }}>X</span>
                            </div>)
                    })}
                </div>
                {
                    addingAdquisicion &&
                    <form onSubmit={addAdquisicion}>
                        <div className={'row'}>
                            <div className={'col-sm-12'}>
                                <AutocompleteSelect errorMessage={errorsAdquisicion && errorsAdquisicion.nombre} reset={!modalOpen} label={'Nombre recurso'} id={'adquisicion-name'} suggestions={adquisicionesProyecto} clickEvent={selectAdquisicion} onlyNames />
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm-12 col-md-4'}>
                                <div className={'form-group form-group-default required' + (errorsAdquisicion && errorsAdquisicion.precio && errorsAdquisicion.precio.length > 0 ? " has-error" : "")}>
                                    <label>Precio / Unidad</label>
                                    <input type={"number"} value={nuevaAdquisicion.precio || ''} name={'precio'} aria-required={true}
                                        className={'form-control'} onChange={(e) => setNuevaAdquisicion({ ...nuevaAdquisicion, precio: e.target.value })} id={'adquisicion-price'} />
                                    {errorsAdquisicion && errorsAdquisicion.precio.length > 0 && <label id="error" className="error">{errorsAdquisicion.precio}</label>}
                                </div>
                            </div>
                            <div className={'col-sm-12 col-md-4'}>
                                <div className={'form-group form-group-default required'}>
                                    <label>Tipo</label>
                                    <select value={nuevaAdquisicion.tipo} disabled={nuevaAdquisicion._id} onChange={(e) => setNuevaAdquisicion({ ...nuevaAdquisicion, tipo: e.target.value })} className="form-control">
                                        <option disabled value={"default"}>Seleccione una opción</option>
                                        <option value={'MATERIAL'}>MATERIAL</option>
                                        <option value={'MANO DE OBRA'}>MANO DE OBRA</option>
                                        <option value={'MAQUINA'}>MAQUINA</option>
                                        <option value={'OTROS'}>OTROS GASTOS</option>
                                    </select>
                                </div>
                            </div>
                            <div className={'col-sm-12 col-md-4'}>
                                <div className={'form-group form-group-default required' + (errorsAdquisicion && errorsAdquisicion.unidad && errorsAdquisicion.unidad.length > 0 ? " has-error" : "")}>
                                    <label>Unidad</label>
                                    <input type={"text"} value={nuevaAdquisicion.unidad || ''} name={'unidad'} aria-required={true} className={'form-control'} onChange={(e) => setNuevaAdquisicion({ ...nuevaAdquisicion, unidad: e.target.value })} id={'adquisicion-unidad'} />
                                    {errorsAdquisicion && errorsAdquisicion.unidad && errorsAdquisicion.unidad.length > 0 && <label id="error" className="error">{errorsAdquisicion.unidad}</label>}
                                </div>
                            </div>
                        </div>
                        <button type={'submit'} className={'qr-btn add-btn'} style={{ padding: '8px 30px' }}>Añadir recurso</button>
                    </form>
                }
                {
                    !addingAdquisicion && <button type={'button'} className={'qr-btn add-btn'} onClick={() => setAddingAdquisicion(true)} style={{ width: 'fit-content' }}><i className={'fa fa-plus'} /> <b>Recurso</b></button>
                }
            </div>
            {!fromPedido &&
                <div className={'modal-footer'} style={{ backgroundColor: 'var(--main-color)' }}>
                    <div style={{ backgroundColor: 'var(--verde-agua)' }}>
                        <button type={'button'} onClick={crearEmpresa} className={'qr-btn confirm-btn'}>{empresa ? "Guardar" : "Crear"}</button>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}
