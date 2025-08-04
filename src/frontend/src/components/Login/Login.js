import React, { useState, useEffect } from 'react';
import './Login.css';
import Logo from '../../assets/img/logo_qrysis.png';
import LoginPic from '../../assets/img/loginPic.jpg';
import useGlobal from "../../store/store";
import { login } from '../../utils/AuthenticationUtils';
import { navigate } from 'hookrouter'

export function Login() {

    const [state, actions] = useGlobal();
    let [credentials, setCredentials] = useState({ username: '', password: '' });
    let [touched, setTouched] = useState({ username: false, password: false });
    let [errors, setErrors] = useState({ username: '', password: '' })

    useEffect(() => {
        let unmounted = false;
        const validate = (credentials) => {
            let usernameError = '';
            let passwordError = '';
            if (touched.username && credentials.username.length === 0) usernameError = 'Hay que introducir un email.';
            if (touched.password && credentials.password.length === 0) passwordError = 'Hay que introducir una contraseña.';
            return { username: usernameError, password: passwordError };
        }
        if (!unmounted) setErrors(validate(credentials));
        return () => { unmounted = true };
    }, [credentials, touched])
    useEffect(() => {
        if (state.userSession)
            if (state.userSession.pantallaOrigen === '/empresas') {
                navigate('/empresas')
            } else {
                let idProyecto = state.userSession && state.userSession.proyectos && state.userSession.proyectos[0] ? state.userSession.proyectos[0] : ':idProyecto'

                let pantallaOrigen = state.userSession.pantallaOrigen.replace(':idProyecto', idProyecto);
                navigate(pantallaOrigen)
            }
    }, [state.userSession])

    const handleSubmit = (event) => {
        event.preventDefault();
        login({ email: credentials.username, password: credentials.password }).then(response => {
            const userSessionRes = response.data.user;
            actions.setUserSession(userSessionRes);
            if (userSessionRes.pantallaOrigen === '/empresas') {
                navigate('/empresas')
            } else {
                let idProyecto = userSessionRes && userSessionRes.proyectos && userSessionRes.proyectos[0] ? userSessionRes.proyectos[0] : ':idProyecto'

                let pantallaOrigen = userSessionRes.pantallaOrigen.replace(':idProyecto', idProyecto);
                navigate(pantallaOrigen)
            }

        }).catch(err => {
            if (err && err.response && err.response.status === 401) {
                setErrors({
                    username: 'Se ha producido un error.',
                    password: 'Los datos introducidos no son correctos.'
                })
            }
        })
    }

    const handleBlur = (field) => (event) => {
        setTouched({ ...touched, [field]: true })
    }

    return (
        <div className="login-wrapper ">
            <div className="bg-pic">
                <img src={LoginPic} data-src={LoginPic} alt="" className="lazy" />
            </div>
            <div className="login-container bg-white">
                <div className="p-l-50 m-l-20 p-r-50 m-r-20 p-t-50 m-t-30 sm-p-l-15 sm-p-r-15 sm-p-t-40">
                    <img src={Logo} alt="logo" data-src={Logo} width="100" height="50" style={{ objectFit: 'contain' }} />
                    <p className="p-t-35">Inicia sesión en Qrisys</p>
                    <form onSubmit={handleSubmit} id="form-login" className="p-t-15">
                        <div className={"form-group form-group-default" + (errors.username.length > 0 ? " has-error" : "")}>
                            <label>Login</label>
                            <div className={'controls' + (errors.username.length > 0 ? ' has-error' : '')}>
                                <input onBlur={handleBlur('username')} onChange={event => setCredentials({ ...credentials, username: event.target.value })} type="text" name="username" placeholder="Email" className="form-control" required />
                            </div>
                        </div>
                        {errors.username.length > 0 && <label id="username-error" className="error" htmlFor="username">{errors.username}</label>}
                        <div className={"form-group form-group-default" + (errors.password.length > 0 ? " has-error" : "")}>
                            <label>Password</label>
                            <div className={'controls' + (errors.password.length > 0 ? ' has-error' : '')}>
                                <input onBlur={handleBlur('password')} onChange={event => setCredentials({ ...credentials, password: event.target.value })} type="password" className="form-control" name="password" placeholder="Contraseña" required />
                            </div>
                        </div>
                        {errors.password.length > 0 && <label id="password-error" className="error" htmlFor="password">{errors.password}</label>}
                        <button className="btn btn-primary btn-cons m-t-10" type="submit">Sign in</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
