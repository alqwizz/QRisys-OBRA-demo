import React, { useEffect, useState } from 'react';
import { empresaValidations } from '../../../utils/FormsUtils'
import { sendLogo, create, edit } from '../../../utils/EmpresasUtils';
import { emptyEmpresa, falseEmpresa, trueEmpresa } from '../../../utils/Empresa/Form/Form';
import { API_URL } from '../../../config/config';

export function EmpresaForm({ empresa, close, modalOpen }) {

    let [editEmpresa, setEditEmpresa] = useState(emptyEmpresa);
    let [touched, setTouched] = useState(falseEmpresa);
    let [errors, setErrors] = useState(emptyEmpresa);
    let [image, setImage] = useState(null);

    useEffect(() => {
        let unmounted = false;
        if (empresa && !unmounted) {
            setEditEmpresa(empresa);
        }
        else if (!unmounted) setEditEmpresa(emptyEmpresa);
        return () => { unmounted = true };
    }, [empresa]);

    useEffect(() => {
        let unmounted = false;
        if (!modalOpen) {
            if (!unmounted) {
                setEditEmpresa(emptyEmpresa);
                setErrors(emptyEmpresa);
                setTouched(falseEmpresa);
                close();
            }
        }
        return () => { unmounted = true };
    }, [modalOpen])

    const handleBlur = (field) => (event) => {
        setTouched({ ...touched, [field]: true })
    };

    const handleChanges = (field) => (event) => {
        setEditEmpresa({ ...editEmpresa, [field]: event.target.value });
    };

    const validate = (editEmpresa, touched) => {
        let nombreError = touched.nombre ? empresaValidations.validateNombre(editEmpresa.nombre) : '';
        let nombreContactoError = touched.nombreContacto ? empresaValidations.validateNombreContacto(editEmpresa.nombreContacto) : '';
        let cifError = touched.cif ? empresaValidations.validateCif(editEmpresa.cif) : '';
        let telefonoError = touched.telefono ? empresaValidations.validateTelefono(editEmpresa.telefono) : '';
        let emailError = touched.email ? empresaValidations.validateEmail(editEmpresa.email) : '';
        let direccionError = touched.direccion ? empresaValidations.validateDireccion(editEmpresa.direccion) : '';

        return {
            nombre: nombreError,
            nombreContacto: nombreContactoError,
            cif: cifError,
            telefono: telefonoError,
            email: emailError,
            direccion: direccionError
        };
    };

    useEffect(() => {
        let unmounted = false;
        if (!unmounted) setErrors(validate(editEmpresa, touched));
        return () => { unmounted = true };
    }, [editEmpresa, touched]);

    const handleImages = (event) => {
        const file = event.target.files[0];
        setImage(file);
    };
    const resetForm = () => {
        if (!empresa) setEditEmpresa(emptyEmpresa);
        setErrors(emptyEmpresa);
        setTouched(falseEmpresa);
        close();
    };
    const handleConfirmar = () => {
        setTouched(trueEmpresa);
        const err = validate(editEmpresa, trueEmpresa);
        setErrors(err);
        if (err.nombre === '' && err.nombreContacto === '' &&
            err.cif === '' &&
            err.telefono === '' &&
            err.email === '' &&
            err.direccion === '') {
            if (editEmpresa._id) {
                edit(editEmpresa).then(response => {
                    if (response.status === 200) {
                        if (image) {
                            const data = new FormData();
                            data.append('file', image);
                            sendLogo(response.data.empresa._id, data).then(res => {
                                resetForm()
                            })
                        }
                        if (!image) close.call();
                    }
                    if (response.status === 400) {
                        console.error(response.message);
                    }
                }).catch(err => window.alert("Se ha prodcuido un error al crear una empresa. Compruebe que no ha insertado información duplicada o en conflicto con otras empresas del sistema."));

            } else {
                create(editEmpresa).then(response => {
                    if (response.status === 200) {
                        if (image) {
                            const data = new FormData();
                            data.append('file', image);
                            sendLogo(response.data.empresa._id, data).then(res => {
                                resetForm()
                            })
                        }
                        if (!image) close.call();
                    }
                    if (response.status === 400) {
                        console.error(response.message);
                    }
                }).catch(err => window.alert("Se ha prodcuido un error al crear una empresa. Compruebe que no ha insertado información duplicada o en confilcto con otras empresas del sistema."));
            }
        }
    }

    return (
        <React.Fragment>
            <div className={'modal-body'}>
                <form>
                    <div className="form-group">
                        <div className={'row'}>
                            <div className="col-xs-6">
                                <div className={"form-group form-group-default required" + (errors.nombre.length > 0 ? " has-error" : "")}>
                                    <label>Nombre</label>
                                    <input value={editEmpresa.nombre} onChange={handleChanges('nombre')} type={"text"} onBlur={handleBlur('name')} className={"form-control"} />
                                    {errors.nombre.length > 0 && <label id={'name-error'}>{errors.nombre}</label>}
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className={"form-group form-group-default required" + (errors.cif.length > 0 ? " has-error" : "")}>
                                    <label>CIF</label>
                                    <input value={editEmpresa.cif} onBlur={handleBlur('cif')} onChange={handleChanges('cif')} type="text" className="form-control" />
                                    {errors.cif.length > 0 && <label id="cif-error" className="error" htmlFor="cif">{errors.cif}</label>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className={"form-group form-group-default required" + (errors.nombreContacto.length > 0 ? " has-error" : "")}>
                                    <label>Nombre de contacto</label>
                                    <input value={editEmpresa.nombreContacto} onBlur={handleBlur('nombreContacto')} onChange={handleChanges('nombreContacto')} type="text" className="form-control" />
                                    {errors.nombreContacto.length > 0 && <label id="nombreContacto-error" className="error" htmlFor="nombreContacto">{errors.nombreContacto}</label>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-12">
                                <div className={"form-group form-group-default" + (errors.direccion.length > 0 ? " has-error" : "")}>
                                    <label>Dirección</label>
                                    <input value={editEmpresa.direccion} onBlur={handleBlur('direccion')} onChange={handleChanges('direccion')} className="form-control" />
                                    {errors.direccion.length > 0 && <label id="direccion-error" className="error" htmlFor="direccion">{errors.direccion}</label>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6">
                                <div className={"form-group form-group-default required" + (errors.email.length > 0 ? " has-error" : "")}>
                                    <label>Email</label>
                                    <input value={editEmpresa.email} onBlur={handleBlur('email')} onChange={handleChanges('email')} type="email" className="form-control" />
                                    {errors.email.length > 0 && <label id="email-error" className="error" htmlFor="email">{errors.email}</label>}
                                </div>
                            </div>
                            <div className="col-xs-6">
                                <div className={"form-group form-group-default" + (errors.telefono.length > 0 ? " has-error" : "")}>
                                    <label>Teléfono</label>
                                    <input value={editEmpresa.telefono} onBlur={handleBlur('telefono')} onChange={handleChanges('telefono')} type="tel" className="form-control" />
                                    {errors.telefono.length > 0 && <label id="telefono-error" className="error" htmlFor="telefono">{errors.telefono}</label>}
                                </div>
                            </div>
                        </div>
                        <div className={'row'}>
                            <div className={'col-sm-12'}>
                                <React.Fragment>
                                    <div className={"form-group form-group-default"}>
                                        <label>Logotipo</label>
                                        <input id={'logo-empresa'} onChange={handleImages} accept="image/*" type="file" style={{ display: 'none' }} className="form-control" />
                                        <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'flex-end' }}>
                                            <label htmlFor={'logo-empresa'} style={{ textAlign: 'right' }}>
                                                <i className={'fa fa-camera'} style={{ fontSize: '2em', margin: '0', color: 'var(--verde-agua)' }} />
                                            </label>
                                            {image || (editEmpresa && editEmpresa.logo) ?
                                                (
                                                    image ?
                                                        <div style={{ position: 'relative', width: 'fit-content' }}>
                                                            <i className={'fa fa-times close-icon'} onClick={() => setImage(null)} />
                                                            <img src={URL.createObjectURL(image)} alt={'logo empresa'} style={{ width: '8em', objectFit: 'contain' }} />
                                                        </div>
                                                        :
                                                        <div style={{ position: 'relative' }}>
                                                            <i className={'fa fa-times close-icon'} onClick={() => { setEditEmpresa({ ...editEmpresa, logo: null });}} />
                                                            <img alt={'empresa' + empresa.cif} style={{ width: '8em', objectFit: 'contain' }} src={API_URL + '/' + empresa.logo} className={'m-b-15'} />
                                                        </div>
                                                )
                                                :
                                                ""
                                            }
                                        </div>
                                    </div>
                                </React.Fragment>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div className="modal-footer" style={{ backgroundColor: 'var(--main-color)' }}>
                <div style={empresa ? { backgroundColor: 'var(--border-color)' } : { backgroundColor: 'var(--verde-agua)' }} >
                    <button onClick={handleConfirmar} type="button" className="qr-btn confirm-btn">{empresa ? "Confirmar" : "Crear"}</button>
                </div>
            </div>
        </React.Fragment>
    )

}
