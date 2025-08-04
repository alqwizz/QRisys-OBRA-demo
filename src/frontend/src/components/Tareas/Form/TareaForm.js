import React, { useState, useEffect } from 'react';
import { formatDate } from '../../../utils/FormsUtils'
import { edit, create } from '../../../utils/TareasUtils';
import { emptyTarea, trueBooleanTarea, falseBooleanTarea } from '../../../utils/Tarea/Form/Form';
import { tareaValidations } from '../../../utils/FormsUtils';
export function TareaForm({ tarea, options, close, modalOpen }) {

    let [editTarea, setEditTarea] = useState(emptyTarea);
    let [touched, setTouched] = useState(falseBooleanTarea);
    let [errors, setErrors] = useState(emptyTarea);

    useEffect(() => {
        let unmounted = false;
        if (tarea && !unmounted) setEditTarea(tarea);
        else if (!unmounted) setEditTarea(emptyTarea)
        return () => { unmounted = true };
    }, [tarea]);
    useEffect(() => {
        let unmounted = false;
        if (!modalOpen) {
            if (!unmounted) {
                setEditTarea(emptyTarea);
                setErrors(emptyTarea);
                setTouched(falseBooleanTarea);
                close();
            }
        }
        return () => { unmounted = true };
    }, [modalOpen]);

    const handleBlur = (field) => (event) => {
        setTouched({ ...touched, [field]: true })
    }

    const handleChanges = (field) => (event) => {
        setEditTarea({ ...editTarea, [field]: event.target.value });
    }
    const validate = (editTarea, touched) => {
        let nombreError = touched.nombre ? tareaValidations.validateNombre(editTarea.nombre) : '';
        let presupuestoError = touched.presupuesto ? tareaValidations.validatePresupuesto(editTarea.presupuesto) : '';
        let unidadError = touched.unidad ? tareaValidations.validateUnidad(editTarea.unidad) : '';
        let medicionError = touched.medicion ? tareaValidations.validateMedicion(editTarea.medicion) : '';
        let fInicioError = touched.fInicio ? tareaValidations.validateFInicio(editTarea.fInicio) : '';
        let fFinError = touched.fFin ? tareaValidations.validateFFin(editTarea.fFin) : '';
        let idPlanificacionError = touched.idPlanificacion ? tareaValidations.validateIdPlanificacion(editTarea.idPlanificacion) : '';
        let idPresupuestoError = touched.idPresupuesto ? tareaValidations.validateIdPresupuesto(editTarea.idPresupuesto) : '';
        let idPredecesoraError = touched.idPredecesora ? tareaValidations.validateIdPredecesora(editTarea.idPredecesora) : '';

        return {
            nombre: nombreError,
            presupuesto: presupuestoError,
            unidad: unidadError,
            medicion: editTarea && editTarea._id ? '' : medicionError,
            fInicio: fInicioError,
            fFin: fFinError,
            idPlanificacion: idPlanificacionError,
            idPresupuesto: idPresupuestoError,
            idPredecesora: idPredecesoraError
        };
    }

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) setErrors(validate(editTarea, touched));
        return () => { unmounted = true };
    }, [editTarea, touched])


    const resetForm = () => {
        setEditTarea(emptyTarea);
        setErrors(emptyTarea);
        setTouched(falseBooleanTarea);
        close();
    }
    const handleConfirmar = () => {
        setTouched(trueBooleanTarea)
        const err = validate(editTarea, trueBooleanTarea)
        setErrors(err)
        if (!hasErrors(err)) {
            if (editTarea._id) {
                edit(editTarea).then(response => {
                    resetForm()
                })
            } else {
                create({ ...editTarea, ...options }).then(response => {
                    resetForm()
                })
            }
        }
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
        <React.Fragment>
            <div className={'modal-body'}>
                <form>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-sm-12">
                                <div className={"form-group form-group-default" + (errors.nombre.length > 0 ? " has-error" : "")}>
                                    <label>Nombre</label>
                                    <input value={editTarea.nombre || ''} onBlur={handleBlur('nombre')} onChange={handleChanges('nombre')} type="text" className="form-control" />
                                    {errors.nombre.length > 0 && <label id="nombre-error" className="error" htmlFor="nombre">{errors.nombre}</label>}
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className="col-sm-12 col-md-6">
                                <div className={"form-group form-group-default" + (errors.presupuesto.length > 0 ? " has-error" : "")}>
                                    <label>Presupuesto</label>
                                    <input value={editTarea.presupuesto || ''} onBlur={handleBlur('presupuesto')} onChange={handleChanges('presupuesto')} type="text" className="form-control" />
                                    {errors.presupuesto.length > 0 && <label id="presupuesto-error" className="error" htmlFor="presupuesto">{errors.presupuesto}</label>}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6">
                                <div className={"form-group form-group-default" + (errors.unidad.length > 0 ? " has-error" : "")}>
                                    <label>Unidad</label>
                                    <input value={editTarea.unidad || ''} onBlur={handleBlur('unidad')} onChange={handleChanges('unidad')} className="form-control" />
                                    {errors.unidad.length > 0 && <label id="unidad-error" className="error" htmlFor="unidad">{errors.unidad}</label>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-4">
                                <div className={"form-group form-group-default" + (errors.medicion.length > 0 ? " has-error" : "")}>
                                    <label>Medición</label>
                                    <input value={editTarea.medicion || ''} onBlur={handleBlur('medicion')} onChange={handleChanges('medicion')} className="form-control" />
                                    {errors.medicion.length > 0 && <label id="medicion-error" className="error" htmlFor="medicion">{errors.medicion}</label>}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-4">
                                <div className={"form-group form-group-default" + (errors.fInicio.length > 0 ? " has-error" : "")}>
                                    <label>Fecha inicio</label>
                                    <input type="date" value={formatDate(editTarea.fInicio)} onBlur={handleBlur('fInicio')} onChange={handleChanges('fInicio')} className="form-control" />
                                    {errors.fInicio.length > 0 && <label id="fInicio-error" className="error" htmlFor="fInicio">{errors.fInicio}</label>}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-4">
                                <div className={"form-group form-group-default" + (errors.fFin.length > 0 ? " has-error" : "")}>
                                    <label>Fecha fin</label>
                                    <input type="date" value={formatDate(editTarea.fFin)} onBlur={handleBlur('fFin')} onChange={handleChanges('fFin')} className="form-control" />
                                    {errors.fFin.length > 0 && <label id="fFin-error" className="error" htmlFor="fFin">{errors.fFin}</label>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12 col-md-4">
                                <div className={"form-group form-group-default" + (errors.idPlanificacion.length > 0 ? " has-error" : "")}>
                                    <label>Id planificación</label>
                                    <input value={editTarea.idPlanificacion || ''} onBlur={handleBlur('idPlanificacion')} onChange={handleChanges('idPlanificacion')} className="form-control" />
                                    {errors.idPlanificacion.length > 0 && <label id="idPlanificacion-error" className="error" htmlFor="idPlanificacion">{errors.idPlanificacion}</label>}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-4">
                                <div className={"form-group form-group-default" + (errors.idPresupuesto.length > 0 ? " has-error" : "")}>
                                    <label>Id presupuesto</label>
                                    <input value={editTarea.idPresupuesto || ''} onBlur={handleBlur('idPresupuesto')} onChange={handleChanges('idPresupuesto')} className="form-control" />
                                    {errors.idPresupuesto.length > 0 && <label id="idPresupuesto-error" className="error" htmlFor="idPresupuesto">{errors.idPresupuesto}</label>}
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-4">
                                <div className={"form-group form-group-default" + (errors.idPredecesora.length > 0 ? " has-error" : "")}>
                                    <label>Id predecesora</label>
                                    <input value={editTarea.idPredecesora || ''} onBlur={handleBlur('idPredecesora')} onChange={handleChanges('idPredecesora')} className="form-control" />
                                    {errors.idPredecesora.length > 0 && <label id="idPredecesora-error" className="error" htmlFor="idPredecesora">{errors.idPredecesora}</label>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className={'modal-footer'} style={{ backgroundColor: 'var(--main-color)' }}>
                <div style={{ backgroundColor: 'var(--verde-agua)' }}>
                    <button onClick={handleConfirmar} type="button" className="qr-btn confirm-btn">{tarea ? "EDITAR"  : "CREAR"}</button>
                </div>
            </div>
        </React.Fragment>
    )
}
