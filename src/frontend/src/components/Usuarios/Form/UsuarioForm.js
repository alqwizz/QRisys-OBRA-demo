import React, { useState, useEffect } from 'react';
import { create, edit } from '../../../utils/UsuariosUtils';
import { userValidations } from '../../../utils/FormsUtils'
import { usuarioDefaultEmpty, usuarioDefaultFalse } from '../../../utils/Usuario/Form/Form'
export function UsuarioForm({ usuario, roles, options, close }) {
    let [editUsuario, setEditUsuario] = useState(usuarioDefaultEmpty);
    let [touched, setTouched] = useState(usuarioDefaultFalse);
    let [errors, setErrors] = useState(usuarioDefaultEmpty);

    useEffect(() => {
        let unmounted = false;
        if (usuario && !unmounted) setEditUsuario(usuario)
        else if (!unmounted) setEditUsuario(usuarioDefaultEmpty)
        return () => { unmounted = true };
    }, [usuario])

    const handleConfirmar = () => {
        let nombreError = userValidations.validateNombre(editUsuario.nombre);
        let usernameError = userValidations.validateUsername(editUsuario.username);
        let apellidosError = userValidations.validateApellidos(editUsuario.apellidos);
        let telefonoError = userValidations.validateTelefono(editUsuario.telefono);
        let emailError = userValidations.validateEmail(editUsuario.email);
        let passwordError = '';
        let password2Error = '';
        if (editUsuario._id) {
            //MODO EDITANDO, DEJAMOS QUE NO CAMBIE LA CONTRASEÑA SINO QUIERE
            if (editUsuario.password && editUsuario.password.length !== 0)
                if (editUsuario.password2 !== editUsuario.password) password2Error = 'Las contraseñas no coinciden.';
        } else {
            passwordError = userValidations.validatePassword(editUsuario.password);
            if (editUsuario.password2 !== editUsuario.password) password2Error = 'Las contraseñas no coinciden.';
        }
        if (nombreError !== '' ||
            usernameError !== '' ||
            apellidosError !== '' ||
            telefonoError !== '' ||
            emailError !== '' ||
            passwordError !== '' ||
            password2Error !== '') {
            setErrors({
                username: usernameError,
                nombre: nombreError,
                apellidos: apellidosError,
                telefono: telefonoError,
                email: emailError,
                password: passwordError,
                password2: password2Error
            });
        } else {
            Reflect.deleteProperty(editUsuario, 'password2');
            if (editUsuario._id) {
                edit(editUsuario).then(response => {
                    resetForm()
                })
            } else {
                create({ ...editUsuario, ...options }).then(response => {
                    resetForm()
                })
            }

        }
    }
    const handleBlurUsuario = (field) => (event) => {
        setTouched({ ...touched, [field]: true })
    }
    const resetForm = () => {
        setEditUsuario(usuarioDefaultEmpty)
        setTouched(usuarioDefaultFalse)
        setErrors(usuarioDefaultEmpty)
        close()
    }
    const handleChangesUsuario = (field) => (event) => {
        setEditUsuario({ ...editUsuario, [field]: event.target.value });
    }

    return (
        <React.Fragment>
            <div className={'modal-body'}>
                <form>
                    <div className="form-group">
                        <div className="row">
                            <div className={'radio radio-success'} style={{ display: 'flex', flexWrap: 'wrap', marginTop: '0' }}>
                                {roles && roles.map(rol => {
                                    return (
                                        <div key={rol._id}> <input id={rol._id} type="radio" checked={rol._id === editUsuario.rol} onChange={() => { setEditUsuario({ ...editUsuario, rol: rol._id }) }} /> <label htmlFor={rol._id}>{rol.nombre}</label></div>)
                                })}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-4">
                                <div className={"form-group form-group-default" + (errors.nombre.length > 0 ? " has-error" : "")}>
                                    <label>Nombre de usuario</label>
                                    <input value={editUsuario.username} onBlur={handleBlurUsuario('username')} onChange={handleChangesUsuario('username')} type="text" className="form-control" />
                                    {errors.username.length > 0 && <label id="username-error" className="error" htmlFor="username">{errors.username}</label>}
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className={"form-group form-group-default" + (errors.nombre.length > 0 ? " has-error" : "")}>
                                    <label>Nombre</label>
                                    <input value={editUsuario.nombre} onBlur={handleBlurUsuario('nombre')} onChange={handleChangesUsuario('nombre')} type="text" className="form-control" />
                                    {errors.nombre.length > 0 && <label id="nombre-error" className="error" htmlFor="nombre">{errors.nombre}</label>}
                                </div>
                            </div>
                            <div className="col-sm-4">
                                <div className={"form-group form-group-default" + (errors.apellidos.length > 0 ? " has-error" : "")}>
                                    <label>Apellidos</label>
                                    <input value={editUsuario.apellidos} onBlur={handleBlurUsuario('apellidos')} onChange={handleChangesUsuario('apellidos')} type="text" className="form-control" />
                                    {errors.apellidos.length > 0 && <label id="apellidos-error" className="error" htmlFor="apellidos">{errors.apellidos}</label>}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-5">
                                <div className={"form-group form-group-default" + (errors.email.length > 0 ? " has-error" : "")}>
                                    <label>Email</label>
                                    <input value={editUsuario.email} onBlur={handleBlurUsuario('email')} onChange={handleChangesUsuario('email')} type="email" className="form-control" />
                                    {errors.email.length > 0 && <label id="email-error" className="error" htmlFor="email">{errors.email}</label>}
                                </div>
                            </div>
                            <div className="col-sm-7">
                                <div className={"form-group form-group-default" + (errors.telefono.length > 0 ? " has-error" : "")}>
                                    <label>Teléfono</label>
                                    <input value={editUsuario.telefono} onBlur={handleBlurUsuario('telefono')} onChange={handleChangesUsuario('telefono')} className="form-control" />
                                    {errors.telefono.length > 0 && <label id="telefono-error" className="error" htmlFor="telefono">{errors.telefono}</label>}
                                </div>
                            </div>
                        </div>
                        {editUsuario && !editUsuario._id && <div className="row">
                            <div className="col-sm-5">
                                <div className={"form-group form-group-default" + (errors.password.length > 0 ? " has-error" : "")}>
                                    <label>Contraseña</label>
                                    <input value={editUsuario.password || ''} onBlur={handleBlurUsuario('password')} onChange={handleChangesUsuario('password')} type="password" className="form-control" />
                                    {errors.password.length > 0 && <label id="password-error" className="error" htmlFor="password">{errors.password}</label>}
                                </div>
                            </div>
                            <div className="col-sm-7">
                                <div className={"form-group form-group-default" + (errors.password2.length > 0 ? " has-error" : "")}>
                                    <label>Repetir contraseña</label>
                                    <input value={editUsuario.password2 || ''} onBlur={handleBlurUsuario('password2')} onChange={handleChangesUsuario('password2')} type="password" className="form-control" />
                                    {errors.password2.length > 0 && <label id="password2-error" className="error" htmlFor="password2">{errors.password2}</label>}
                                </div>
                            </div>
                        </div>}
                    </div>
                </form>
            </div>
            <div className={'modal-footer'} style={{ backgroundColor: 'var(--main-color)' }}>
                <div style={{ backgroundColor: 'var(--verde-agua)' }}>
                    <button onClick={handleConfirmar} type="button" className="qr-btn confirm-btn">Confirmar</button>
                </div>
            </div>
        </React.Fragment>
    )
}
