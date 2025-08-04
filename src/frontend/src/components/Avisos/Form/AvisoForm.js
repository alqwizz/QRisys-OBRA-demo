import React, { useState, useEffect } from 'react';
import { create, edit } from '../../../utils/AvisosUtils';
import { formatDate, avisoValidations } from '../../../utils/FormsUtils'
import { defaultEmpty } from '../../../utils/Avisos/Form/Form'
import { findAll as findAllEmpresas } from '../../../utils/EmpresasUtils'
import { AutocompleteSelect } from "../../Globales/AutocompleteSelect/AutocompleteSelect";

const getMinutes = (minute) => {
    if (minute)
        if (minute.length === 1) return '0' + minute;
        else return minute;
    return '00'
}

const getHours = (hours) => {
    if (hours)
        if (hours.length === 1) return '0' + hours;
        else return hours
    return '00'
}
const getMinDate = () => {
    const date = new Date();
    const month = (date.getMonth() + 1) < 10 ? ('0' + (date.getMonth() + 1)) : ('' + (date.getMonth() + 1))
    const day = date.getDate() < 10 ? ('0' + (date.getDate() + '')) : (date.getDate() + '')
    return date.getFullYear() + '-' + month + '-' + day;
}
export function AvisoForm({ aviso, close, openModal, proyecto }) {
    let [editAviso, setEditAviso] = useState(defaultEmpty);
    let [errors, setErrors] = useState(defaultEmpty);
    let [empresas, setEmpresas] = useState([]);
    let [proyectos, setProyectos] = useState([])


    useEffect(() => {
        let unmounted = false;
        if (aviso && !unmounted) {
            const av = Object.assign({}, aviso);
            const fecha = new Date(av.fecha)
            const hora = getHours(fecha.getHours())
            const minuto = getMinutes(fecha.getMinutes());
            const horaInicio = hora + ':' + minuto;
            if (av._id) {
                if (!unmounted) setEditAviso({ ...av, fecha: fecha, horaInicio: horaInicio })

            } else
                if (!unmounted) setEditAviso({ ...defaultEmpty, fecha: fecha, horaInicio: horaInicio })
        }
        else if (!unmounted) setEditAviso(defaultEmpty)
        return () => { unmounted = true };
    }, [aviso])

    useEffect(() => {
        let unmounted = false;
        findAllEmpresas().then(res => {
            const empresasRes = res.data.empresas;
            setEmpresas(empresasRes);
            if (empresasRes && empresasRes.length > 0 && editAviso && editAviso._id && editAviso.proyecto) {
                const empresa = empresasRes.find(empresa => {
                    const proyecto = empresa.proyectos.find(x => x._id + '' === editAviso.proyecto)
                    if (proyecto) return true;
                    return false;
                })
                if (empresa)
                    setProyectos(empresa.proyectos)
            }
        })
        return () => { unmounted = true };
    }, [openModal, aviso])
    useEffect(() => {
        let unmounted = false;
        if (!openModal) {
            setEditAviso(defaultEmpty)
            setErrors(defaultEmpty)
        }
        return () => { unmounted = true };
    }, [openModal])

    const validate = () => {
        let titulo = avisoValidations.validateTitulo(editAviso.titulo);
        let descripcion = avisoValidations.validateDescripcion(editAviso.descripcion);
        let fecha = avisoValidations.validateFecha(editAviso.fecha);
        let horaInicio = '';
        return {
            titulo,
            descripcion,
            fecha,
            horaInicio
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

    const handleConfirmar = () => {
        const errors = validate()
        setErrors(errors);
        if (!hasErrors(errors)) {
            const f = new Date(editAviso.fecha);
            const dia = f.getDate()
            const mes = f.getMonth();
            const year = f.getFullYear();
            const horas = editAviso.horaInicio.split(':')[0]
            const minutos = editAviso.horaInicio.split(':')[1]
            const fecha = new Date(year, mes, dia, horas, minutos, 0, 0).getTime()
            const avisoForm = {
                titulo: editAviso.titulo,
                descripcion: editAviso.descripcion,
                fecha: fecha,
                proyecto: editAviso.proyecto
            }
            if (editAviso._id) {
                edit({
                    ...avisoForm,
                    _id: editAviso._id,
                    _version: editAviso._version,
                    updated_for: editAviso.updated_for
                }).then(res => {
                    resetForm();
                })
            } else {
                create({ ...avisoForm, proyecto: proyecto._id }).then(res => {
                    resetForm();
                })
            }
        }
    }
    const resetForm = () => {
        setEditAviso(defaultEmpty)
        setErrors(defaultEmpty)
        close()
    }
    const handleChangesAviso = (field) => (event) => {
        setEditAviso({ ...editAviso, [field]: event.target.value });
    }
    const handleClickEmpresa = (empresaSelected) => {
        setProyectos(empresaSelected.proyectos)
        setEditAviso({ ...editAviso, proyecto: null })
    }
    const handleClickProyecto = (proyectoSelected) => {
        setEditAviso({ ...editAviso, proyecto: proyectoSelected._id })
    }
    const getDefaultEmpresa = () => {
        if (empresas && empresas.length > 0 && editAviso && editAviso._id && editAviso.proyecto) {
            const empresa = empresas.find(empresa => {
                const proyecto = empresa.proyectos.find(x => x._id + '' === editAviso.proyecto)
                if (proyecto) return true;
                return false;
            })
            if (empresa)
                return empresa.nombre;
        }
        return '';
    }
    const getDefaultProyecto = () => {
        let res = ''
        if (empresas && empresas.length > 0 && editAviso && editAviso._id && editAviso.proyecto) {
            empresas.find(empresa => {
                const proyecto = empresa.proyectos.find(x => x._id + '' === editAviso.proyecto)
                if (proyecto) {
                    res = proyecto.nombre;
                    return true;
                }
                return false;
            })
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
                                <div className={"form-group form-group-default" + (errors.titulo.length > 0 ? " has-error" : "")}>
                                    <label>Título</label>
                                    <input value={editAviso.titulo} onChange={handleChangesAviso('titulo')} type="text" className="form-control" />
                                    {errors.titulo.length > 0 && <label id="titulo-error" className="error" htmlFor="titulo">{errors.titulo}</label>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className={"form-group form-group-default" + (errors.descripcion.length > 0 ? " has-error" : "")}>
                                    <label>Descripción</label>
                                    <input type="textarea" value={editAviso.descripcion} onChange={handleChangesAviso('descripcion')} type="descripcion" className="form-control" />
                                    {errors.descripcion.length > 0 && <label id="descripcion-error" className="error" htmlFor="descripcion">{errors.descripcion}</label>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6">
                                <div className={"form-group form-group-default" + (errors.fecha.length > 0 ? " has-error" : "")}>
                                    <label>Fecha lanzamiento</label>
                                    <input min={getMinDate()} type="date" value={formatDate(editAviso.fecha)} onChange={handleChangesAviso('fecha')} className="form-control" />
                                    {errors.fecha.length > 0 && <label id="fecha-error" className="error" htmlFor="fecha">{errors.fecha}</label>}
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className={"form-group form-group-default" + (errors.horaInicio.length > 0 ? " has-error" : "")}>
                                    <label>Hora lanzamiento:</label>
                                    <input type="time" value={editAviso.horaInicio || ''} onChange={handleChangesAviso('horaInicio')} className="form-control" />
                                    {errors.horaInicio.length > 0 && <label id="horaInicio-error" className="error" htmlFor="horaInicio">{errors.horaInicio}</label>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer" style={{ backgroundColor: 'var(--main-color)' }}>
                <div style={{ backgroundColor: 'var(--verde-agua)' }}>
                    <button onClick={handleConfirmar} type="button" className="qr-btn confirm-btn">Confirmar</button>
                </div>
            </div>
        </React.Fragment>
    )
}
