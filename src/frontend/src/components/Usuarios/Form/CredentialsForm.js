import React, { useState, useEffect } from 'react';
import { credentialsEmpty } from '../../../utils/Usuario/Form/Form'
import { editCredentials } from '../../../utils/UsuariosUtils';

export function CredentialsForm({ idUsuario, close }) {

    let [credentials, setCredentials] = useState(credentialsEmpty)
    let [errors, setErrors] = useState(credentialsEmpty)
    const resetForm = (isClosing = true) => {
        setCredentials(credentialsEmpty)
        setErrors(credentialsEmpty)
        if (isClosing) close()
    }
    useEffect(() => {
        if (idUsuario) {
            setCredentials(credentialsEmpty)
            setErrors(credentialsEmpty)
        }
    }, [idUsuario])



    const handleChanges = (field) => (event) => {
        setCredentials({ ...credentials, [field]: event.target.value });
    }

    const handleConfirmar = () => {
        let errors = {
            password: '',
            password2: ''
        }
        let hasErrors = false;
        if (credentials.password.length === 0) {
            errors.password = 'Hay que introducir una contraseña.'
            hasErrors = true;
        } else if (credentials.password2.length === 0) {
            errors.password2 = 'Introduzca la contraseña de nuevo.'
            hasErrors = true;
        } else if (credentials.password !== credentials.password2) {
            errors.password2 = 'Las contraseñas no coinciden.'
            hasErrors = true;
        }
        if (hasErrors) {
            setErrors(errors);
        } else {
            editCredentials(idUsuario, { password: credentials.password }).then(res => {
                resetForm()
            })
        }

    }
    return (
        <div>
            <form>
                <div className="form-group-attached">
                    <div className="row">
                        <div className="col-sm-5">
                            <div className={"form-group form-group-default" + (errors.password.length > 0 ? " has-error" : "")}>
                                <label>Contraseña</label>
                                <input value={credentials.password || ''} onChange={handleChanges('password')} type="password" className="form-control" />
                                {errors.password.length > 0 && <label id="password-error" className="error" htmlFor="password">{errors.password}</label>}
                            </div>
                        </div>
                        <div className="col-sm-7">
                            <div className={"form-group form-group-default" + (errors.password2.length > 0 ? " has-error" : "")}>
                                <label>Repetir contraseña</label>
                                <input value={credentials.password2 || ''} onChange={handleChanges('password2')} type="password" className="form-control" />
                                {errors.password2.length > 0 && <label id="password2-error" className="error" htmlFor="password2">{errors.password2}</label>}
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