import React, { useEffect, useRef, useState } from 'react';
import Presupuesto from "../../../entidades/Presupuesto";
import { AutocompleteSelect } from "../../Globales/AutocompleteSelect/AutocompleteSelect";
import { findByEmpresaSub, findByProyecto } from '../../../utils/AdquisicionesUtils';
import AdquisicionPresupuesto from "../../../entidades/AdquisicionPresupuesto";
import { solicitarPresupuesto } from '../../../utils/PedidosUtils'


export function PresupuestoForm({ empresa, modalOpen, idProyecto, presupuesto, empresaDisabled, adquisicionSelected, }) {

    const [nuevoPresupuesto, setNuevoPresupuesto] = useState(new Presupuesto(presupuesto ? presupuesto : (empresa ? { empresaSubcontrata: empresa._id, proyecto: idProyecto } : { proyecto: idProyecto })));

    const [errors, setErrors] = useState(null);
    const [errorsAdquisicion, setErrorsAdquisicion] = useState(null);
    const [nuevaAdquisicionPresupuesto, setNuevaAdquisicionPresupuesto] = useState(new AdquisicionPresupuesto(adquisicionSelected ? { adquisicion: adquisicionSelected, precio: adquisicionSelected.precio } : {}));


    const [adquisicionesPedido, setAdquisicionesPedido] = useState([]);
    const [addingAdquisicion, setAddingAdquisicion] = useState(true);

    const thisRef = useRef();
    const [adquisionesProyecto, setAdquisicionesProyecto] = useState(false);
    const [adquisionesProyectoNombres, setAdquisicionesProyectoNombres] = useState(false);
    const [adquisicionesEmpresaNombres, setAdquisicionesEmpresaNombres] = useState(false);

    useEffect(() => {
        if (modalOpen === false) {
            setNuevoPresupuesto(new Presupuesto(presupuesto ? presupuesto : (empresa ? { empresaSubcontrata: empresa._id, proyecto: idProyecto } : { proyecto: idProyecto })))
            setNuevaAdquisicionPresupuesto(new AdquisicionPresupuesto(adquisicionSelected ? { adquisicion: adquisicionSelected, precio: adquisicionSelected.precio } : {}))
            setAdquisicionesPedido([]);
            setAddingAdquisicion(true);
            setErrors(null);
            setErrorsAdquisicion(null);
        }
    }, [modalOpen, adquisicionSelected, empresa, idProyecto, presupuesto])

    const hasErrors = (errors) => {
        let res = false;
        for (var prop in errors) {
            if (Object.prototype.hasOwnProperty.call(errors, prop)) {
                if (errors[prop] !== '') {
                    res = true;
                    break;
                }
            }
        }
        return res;
    }


    useEffect(() => {
        //Obtengo las adquisiciones.
        if (empresa) {
            getAdquisiciones(empresa._id);
        }
        findByProyecto(idProyecto).then(response => {
            const adqRes = response.data.adquisiciones;
            const unique = [...new Set(adqRes.map(item => item.nombre))];
            setAdquisicionesProyecto(adqRes);
            setAdquisicionesProyectoNombres(unique)
        })
    }, [empresa]);

    const getAdquisiciones = (empresa) => {
        findByEmpresaSub(empresa).then(response => {
            if (response.data.status === 200) {
                const adqRes = response.data.adquisiciones;
                const unique = [...new Set(adqRes.map(item => item.nombre))];
                setAdquisicionesEmpresaNombres(unique);
            } else {
                console.error('error al obtener las adquisiciones');
            }
        }).catch(err => console.error(err));
    }

    function addAdquisicion(e) {
        e.preventDefault();
        const newAdquisicion = new AdquisicionPresupuesto(nuevaAdquisicionPresupuesto);
        const errors = newAdquisicion.validate();
        setErrorsAdquisicion(errors);
        if (!hasErrors(errors)) {
            setAddingAdquisicion(false);
            adquisicionesPedido.push(JSON.parse(JSON.stringify(newAdquisicion)))
            setAdquisicionesPedido(adquisicionesPedido);
            setNuevaAdquisicionPresupuesto(new AdquisicionPresupuesto({}))
        }
    }

    function selectAdquisicion(option) {
        if (option) {
            const find = adquisionesProyecto.find(x => x.nombre === option);
            setNuevaAdquisicionPresupuesto({
                precio: find.precio,
                unidad: find.unidad,
                tipo: find.tipo,
                nombre: find.nombre,
                _id: find._id
            })
        }
    }

    const handleXRecursos = (adquisicion) => () => {
        setAdquisicionesPedido(adquisicionesPedido.filter(x => x._id + '' !== adquisicion._id + ''))
    }
    const handleSolicitar = () => {
        const presupuestoCreate = new Presupuesto({ ...nuevoPresupuesto, adquisiciones: adquisicionesPedido, empresaSubcontrata: empresa._id });
        const errors = presupuestoCreate.validate()

        setErrors(errors);
        if (!hasErrors(errors)) {
            solicitarPresupuesto(presupuestoCreate).then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'presupuesto.xlsx');
                document.body.appendChild(link);
                link.click();
            })
        }
    }
    if (empresa)
        return (
            <React.Fragment>
                <div ref={thisRef} className={'modal-body'}>
                    <b style={{ color: '#b7b5b5', fontSize: '.9em' }}>Presupuesto para</b>
                    {empresaDisabled && empresa && <p style={{ fontWeight: 'bold' }}>{empresa.nombre}</p>}
                    {errors && errors.adquisiciones.length > 0 && <label id="error" className="error">{errors.adquisiciones}</label>}
                    <div style={{ textAlign: 'center' }}>
                        <b style={{ margin: '8px 15px' }}>Recursos</b><br />
                        {adquisicionesPedido.map((adquisicionPedido, i) => {
                            return (
                                <div key={i} style={{ backgroundColor: '#addead8c', padding: '8px', margin: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span>{adquisicionPedido.nombre}</span> <span style={{ fontWeight: 'bold' }}> - {adquisicionPedido.cantidad + ' ' + adquisicionPedido.unidad}</span>
                                    </div>
                                    <span onClick={handleXRecursos(adquisicionPedido)} style={{ cursor: 'pointer', border: 'solid 1px', padding: '0 4px', borderRadius: '4px' }}>X</span>
                                </div>)
                        })}
                        {
                            addingAdquisicion &&
                            <form onSubmit={addAdquisicion} style={{ textAlign: 'left', marginTop: '8px' }}>
                                <div className={'row'}>
                                    <div className={'col-sm-12'}>
                                        <AutocompleteSelect
                                            showNew={false}
                                            errorMessage={errorsAdquisicion && errorsAdquisicion.nombre}
                                            reset={!modalOpen}
                                            label={'Nombre recurso'}
                                            id={'adquisicion-name'}
                                            onlyNames={true}
                                            suggestions={adquisionesProyectoNombres}
                                            initialSuggestions={adquisicionesEmpresaNombres}
                                            clickEvent={selectAdquisicion}
                                            defaultValue={adquisicionSelected ? adquisicionSelected.nombre : ''} />
                                    </div>
                                </div>
                                <div className={'row'}>
                                    <div className={'col-sm-6'}>
                                        <div className={'form-group form-group-default required' + (errorsAdquisicion && errorsAdquisicion.cantidad && errorsAdquisicion.cantidad.length > 0 ? " has-error" : "")}>
                                            <label>Medición</label>
                                            <input type={"text"} name={'cantidad'} aria-required={true} className={'form-control'} onChange={(e) => setNuevaAdquisicionPresupuesto({ ...nuevaAdquisicionPresupuesto, cantidad: e.target.value })} id={'adquisicion-cantidad'} />
                                            {errorsAdquisicion && errorsAdquisicion.cantidad && errorsAdquisicion.cantidad.length > 0 && <label id="error" className="error">{errorsAdquisicion.cantidad}</label>}
                                        </div>
                                    </div>
                                    <div className={'col-sm-6'}>
                                        <div className={'form-group form-group-default required' + (errorsAdquisicion && errorsAdquisicion.unidad && errorsAdquisicion.unidad.length > 0 ? " has-error" : "")}>
                                            <label>Unidad</label>
                                            <input type={"text"} value={nuevaAdquisicionPresupuesto.unidad || ''} name={'unidad'} aria-required={true} className={'form-control'} onChange={(e) => setNuevaAdquisicionPresupuesto({ ...nuevaAdquisicionPresupuesto, unidad: e.target.value })} id={'adquisicion-unidad'} />
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

                </div>
                <div className={'modal-footer'} style={{ backgroundColor: 'var(--main-color)' }}>
                    <div style={{ backgroundColor: 'var(--verde-agua)' }}>
                        <button type={'button'} onClick={handleSolicitar} className={'qr-btn confirm-btn'}>Generar presupuesto</button>
                    </div>
                </div>
            </React.Fragment >
        )
    return <div />
}

