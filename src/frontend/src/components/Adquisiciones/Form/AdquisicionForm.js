import React, { useState, useEffect } from 'react';
import { adquisicionValidations } from '../../../utils/FormsUtils'
import { create, edit } from '../../../utils/AdquisicionesUtils';
import { emptyEmpresa } from '../../../utils/Empresa/Form/Form'
import { emptyAdquisicion, falseBooleanAdquisicion, trueBooleanAdquisicion } from '../../../utils/Adquisiciones/Form/Form';
import { empresaEmpty, empresaFalse, empresaTrue } from '../../../utils/EmpresaSubcontrata/Form/Form';
import { findByProyecto, create as createEmpresa, edit as editEmpresa } from '../../../utils/EmpresasSubcontrataUtils'

const empty = { empresa: empresaEmpty, adquisicion: emptyAdquisicion }
const falso = { empresa: empresaFalse, adquisicion: falseBooleanAdquisicion };
const touchedTrue = { empresa: empresaTrue, adquisicion: trueBooleanAdquisicion }
export function AdquisicionForm({ modalOpen, adquisicion, idProyecto, idEmpresa, close }) {
    let [editAdquisicion, setEditAdquisicion] = useState(emptyAdquisicion);
    let [touched, setTouched] = useState(falso);
    let [errors, setErrors] = useState(empty);
    let [empresaOriginal, setEmpresaOriginal] = useState(null)
    let [valueSelectEmpresa, setValueSelectEmpresa] = useState("default")
    let [disabledEmpresa, setDisabledEmpresa] = useState(true)
    let [empresasSubcontratas, setEmpresasSubcontratas] = useState([])
    let [editEmpresaSubcontrata, setEditEmpresaSubcontrata] = useState(empresaEmpty)
    useEffect(() => {
        let unmounted = false;
        if (adquisicion && !unmounted) {
            if (!unmounted) setEditAdquisicion(adquisicion);
            /*findByAdquisicion(adquisicion._id).then(res => {
                if (!unmounted) setEmpresasSubcontratas(res.data.empresasSubcontratas)
            })*/
        }
        else if (!unmounted) {
            setEditAdquisicion(emptyAdquisicion)
        }
        findByProyecto(idProyecto).then(res => {
            const empresas = res.data.empresasSubcontratas
            setEmpresasSubcontratas(empresas)
            if (adquisicion) {
                const empresa = empresas.find(x => x.adquisiciones.includes(adquisicion._id))
                if (empresa) {
                    setEditEmpresaSubcontrata(empresa)
                    setValueSelectEmpresa(empresa._id)
                    setEmpresaOriginal(empresa);
                }
            }
        })
        return () => { unmounted = true };
    }, [adquisicion, idProyecto])

    useEffect(() => {
        if (!modalOpen) {
            setTouched(falso)
            setErrors(empty)
            setEditAdquisicion(emptyAdquisicion)
            setEditEmpresaSubcontrata(empresaEmpty)
            setValueSelectEmpresa("default")
            setDisabledEmpresa(true)
        }
    }, [modalOpen])

    const handleBlur = (entity, field) => (event) => {
        setTouched({ ...touched, [entity]: { ...touched[entity], [field]: true } })
    }
    const handleChangesEmpresa = (field) => (event) => {
        setEditEmpresaSubcontrata({ ...editEmpresaSubcontrata, [field]: event.target.value });
    }
    const handleChangesAdquisicion = (field) => (event) => {
        setEditAdquisicion({ ...editAdquisicion, [field]: event.target.value });
    }
    const validate = (editAdquisicion, touched) => {
        let idAquisicionError = touched.adquisicion.idAdquisicion ? adquisicionValidations.validateIdAquisicion(editAdquisicion.idAdquisicion) : '';
        let tipoError = touched.adquisicion.tipo ? adquisicionValidations.validateTipo(editAdquisicion.tipo) : '';
        let nombreAdquisicionError = touched.adquisicion.nombre ? adquisicionValidations.validateNombreAdquisicion(editAdquisicion.nombre) : '';
        let unidadError = touched.adquisicion.unidad ? adquisicionValidations.validateUnidad(editAdquisicion.unidad) : '';

        let nombreSubcontrataError = touched.empresa.nombreSubcontrata ? adquisicionValidations.validateNombreSubcontrata(editEmpresaSubcontrata.nombreSubcontrata) : '';
        let nombreContactoError = touched.empresa.nombreContacto ? adquisicionValidations.validateNombreContacto(editEmpresaSubcontrata.nombre) : '';
        let emailError = touched.empresa.email ? adquisicionValidations.validateEmail(editEmpresaSubcontrata.email) : '';
        let telefonoError = touched.empresa.telefono ? adquisicionValidations.validateTelefono(editEmpresaSubcontrata.telefono) : '';

        return {
            adquisicion: {
                idAdquisicion: idAquisicionError,
                tipo: tipoError,
                nombre: nombreAdquisicionError,
                unidad: unidadError
            },
            empresa: {
                nombre: nombreSubcontrataError,
                nombreContacto: nombreContactoError,
                email: emailError,
                telefono: telefonoError,
            }
        };
    }
    useEffect(() => {
        let unmounted = false;
        const valid = (editAdquisicion, touched) => {
            let idAquisicionError = touched.adquisicion.idAdquisicion ? adquisicionValidations.validateIdAquisicion(editAdquisicion.idAdquisicion) : '';
            let tipoError = touched.adquisicion.tipo ? adquisicionValidations.validateTipo(editAdquisicion.tipo) : '';
            let nombreAdquisicionError = touched.adquisicion.nombre ? adquisicionValidations.validateNombreAdquisicion(editAdquisicion.nombre) : '';
            let unidadError = touched.adquisicion.unidad ? adquisicionValidations.validateUnidad(editAdquisicion.unidad) : '';

            let nombreSubcontrataError = touched.empresa.nombreSubcontrata ? adquisicionValidations.validateNombreSubcontrata(editEmpresaSubcontrata.nombreSubcontrata) : '';
            let nombreContactoError = touched.empresa.nombreContacto ? adquisicionValidations.validateNombreContacto(editEmpresaSubcontrata.nombre) : '';
            let emailError = touched.empresa.email ? adquisicionValidations.validateEmail(editEmpresaSubcontrata.email) : '';
            let telefonoError = touched.empresa.telefono ? adquisicionValidations.validateTelefono(editEmpresaSubcontrata.telefono) : '';

            return {
                adquisicion: {
                    idAdquisicion: idAquisicionError,
                    tipo: tipoError,
                    nombre: nombreAdquisicionError,
                    unidad: unidadError
                },
                empresa: {
                    nombre: nombreSubcontrataError,
                    nombreContacto: nombreContactoError,
                    email: emailError,
                    telefono: telefonoError,
                }
            };
        }
        if (!unmounted) setErrors(valid(editAdquisicion, touched));
        return () => { unmounted = true };
    }, [editAdquisicion, editEmpresaSubcontrata, touched])

    const resetForm = () => {
        setTouched(falso)
        setErrors(empty)
        setEditAdquisicion(emptyAdquisicion)
        setEditEmpresaSubcontrata(empresaEmpty)
        setValueSelectEmpresa("default")
        setDisabledEmpresa(true)
        close()
    }
    const handleConfirmar = () => {
        setTouched(touchedTrue)
        const err = validate(editAdquisicion, touchedTrue)
        setErrors(err)
        if (!hasErrors(err.adquisicion) && !hasErrors(err.empresa)) {
            if (editAdquisicion._id) {
                const promises = [];
                if (empresaOriginal && empresaOriginal._id && empresaOriginal._id !== editEmpresaSubcontrata._id) {
                    const adqsNueva = editEmpresaSubcontrata.adquisiciones ? editEmpresaSubcontrata.adquisiciones : [];
                    let adqsOriginal = empresaOriginal.adquisiciones;
                    adqsNueva.push(editAdquisicion._id);
                    adqsOriginal = adqsOriginal.filter(x => x !== editAdquisicion._id);
                    let p1 = editEmpresaSubcontrata._id ? editEmpresa({ ...editEmpresaSubcontrata, adquisiciones: adqsNueva }) : createEmpresa({ ...editEmpresaSubcontrata, proyecto: idProyecto, adquisiciones: adqsNueva })
                    let p2 = editEmpresa({ ...empresaOriginal, proyecto: idProyecto, adquisiciones: adqsOriginal })
                    promises.push(p1, p2);
                }
                let p3 = edit(editAdquisicion);
                promises.push(p3);
                Promise.all(promises).then(values => {
                    resetForm();
                })
            } else {
                create({ ...editAdquisicion, proyecto: idProyecto, empresa: idEmpresa }).then(response => {
                    if (!editEmpresaSubcontrata._id) {
                        createEmpresa({ ...editEmpresaSubcontrata, proyecto: idProyecto, adquisiciones: [response.data.adquisicion._id] }).then(res => {
                            resetForm()
                        })
                    } else {
                        const adqs = editEmpresaSubcontrata.adquisiciones;
                        adqs.push(response.data.adquisicion._id)
                        editEmpresa({ ...editEmpresaSubcontrata, proyecto: idProyecto, adquisiciones: adqs }).then(res => {
                            resetForm()
                        })
                    }
                })
            }
        }
    }
    const handleSelectEmpresa = (event) => {
        const value = event.target.value;
        setValueSelectEmpresa(value)
        let emp = emptyEmpresa;
        if (value === '__createnueva__') {
            setDisabledEmpresa(false);
        }
        else {
            emp = empresasSubcontratas.find(x => x._id === value);
            if (!disabledEmpresa) setDisabledEmpresa(true);
        }
        setEditEmpresaSubcontrata(emp)
    }

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
    return (
        <div>
            <form>
                <div className="form-group-attached">
                    <div className="row">
                        <div className="col-sm-6">
                            <div className={"form-group form-group-default" + (errors.adquisicion.idAdquisicion.length > 0 ? " has-error" : "")}>
                                <label>Id</label>
                                <input value={editAdquisicion.idAdquisicion || ''} onBlur={handleBlur('adquisicion', 'idAdquisicion')} onChange={handleChangesAdquisicion('idAdquisicion')} type="text" className="form-control" />
                                {errors.adquisicion.idAdquisicion.length > 0 && <label id="idAdquisicion-error" className="error" htmlFor="idAdquisicion">{errors.adquisicion.idAdquisicion}</label>}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className={"form-group form-group-default" + (errors.adquisicion.nombre.length > 0 ? " has-error" : "")}>
                                <label>Nombre</label>
                                <input value={editAdquisicion.nombre || ''} onBlur={handleBlur('adquisicion', 'nombre')} onChange={handleChangesAdquisicion('nombre')} className="form-control" />
                                {errors.adquisicion.nombre.length > 0 && <label id="nombre-error" className="error" htmlFor="nombre">{errors.adquisicion.nombre}</label>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className={"form-group form-group-default" + (errors.adquisicion.tipo.length > 0 ? " has-error" : "")}>
                                <label>Tipo</label>
                                <select value={editAdquisicion.tipo || 'default'} onBlur={handleBlur('adquisicion', 'tipo')} onChange={handleChangesAdquisicion('tipo')} type="text" className="form-control">
                                    <option disabled value={"default"}>Seleccione una opción</option>
                                    <option value={'MATERIAL'}>MATERIAL</option>
                                    <option value={'MANO DE OBRA'}>MANO DE OBRA</option>
                                    <option value={'MAQUINA'}>MAQUINA</option>
                                </select>{errors.adquisicion.tipo.length > 0 && <label id="tipo-error" className="error" htmlFor="tipo">{errors.adquisicion.tipo}</label>}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className={"form-group form-group-default" + (errors.adquisicion.unidad.length > 0 ? " has-error" : "")}>
                                <label>Unidad</label>
                                <input value={editAdquisicion.unidad || ''} onBlur={handleBlur('adquisicion', 'unidad')} onChange={handleChangesAdquisicion('unidad')} className="form-control" />
                                {errors.adquisicion.unidad.length > 0 && <label id="unidad-error" className="error" htmlFor="unidad">{errors.adquisicion.unidad}</label>}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className={"form-group form-group-default"}>
                                <label>Empresa subcontrata</label>
                                <select value={valueSelectEmpresa} onChange={handleSelectEmpresa} type="text" className="form-control">
                                    <option disabled value={"default"}>Seleccione una opción</option>
                                    <option value={"__createnueva__"}>Nueva empresa</option>
                                    {empresasSubcontratas.length > 0 && empresasSubcontratas.map(a => {
                                        return <option value={a._id} key={a._id}>{a.nombre}</option>
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className={"form-group form-group-default" + (errors.empresa.nombre.length > 0 ? " has-error" : "")}>
                                <label>Nombre subcontrata</label>
                                <input disabled={disabledEmpresa} value={editEmpresaSubcontrata.nombre || ''} onBlur={handleBlur('empresa', 'nombre')} onChange={handleChangesEmpresa('nombre')} type="text" className="form-control" />
                                {errors.empresa.nombre.length > 0 && <label id="nombreSubcontrata-error" className="error" htmlFor="nombreSubcontrata">{errors.empresa.nombreSubcontrata}</label>}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className={"form-group form-group-default" + (errors.empresa.nombreContacto.length > 0 ? " has-error" : "")}>
                                <label>Nombre contacto</label>
                                <input disabled={disabledEmpresa} value={editEmpresaSubcontrata.nombreContacto || ''} onBlur={handleBlur('empresa', 'nombreContacto')} onChange={handleChangesEmpresa('nombreContacto')} className="form-control" />
                                {errors.empresa.nombreContacto.length > 0 && <label id="nombreContacto-error" className="error" htmlFor="nombreContacto">{errors.empresa.nombreContacto}</label>}
                            </div>
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className={"form-group form-group-default" + (errors.empresa.email.length > 0 ? " has-error" : "")}>
                                <label>Email</label>
                                <input disabled={disabledEmpresa} value={editEmpresaSubcontrata.email || ''} onBlur={handleBlur('empresa', 'email')} type="email" onChange={handleChangesEmpresa('email')} className="form-control" />
                                {errors.empresa.email.length > 0 && <label id="email-error" className="error" htmlFor="email">{errors.empresa.email}</label>}
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className={"form-group form-group-default" + (errors.empresa.telefono.length > 0 ? " has-error" : "")}>
                                <label>Telefono</label>
                                <input disabled={disabledEmpresa} value={editEmpresaSubcontrata.telefono || ''} onBlur={handleBlur('empresa', 'telefono')} onChange={handleChangesEmpresa('telefono')} className="form-control" />
                                {errors.empresa.telefono.length > 0 && <label id="telefono-error" className="error" htmlFor="telefono">{errors.empresa.telefono}</label>}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            <div className="row">
                <div className="col-sm-8" />
                <div className="col-sm-4 m-t-10 sm-m-t-10">
                    <button onClick={handleConfirmar} type="button" className="btn btn-primary btn-block m-t-5">Confirmar</button>
                </div>
            </div>
        </div>
    )
}
