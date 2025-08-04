import React, { useEffect, useState } from 'react';
import { useRoutes } from 'hookrouter';
import { routes } from '../config/routes';
import useGlobal from "../store/store";
import './App.css';
import { Header } from './Header/Header';
import { check } from '../utils/AuthenticationUtils';
import Loader from '../components/Globales/Loader';

import '../assets/plugins/bootstrapv3/css/bootstrap.min.css';
import '../assets/plugins/font-awesome/css/all.min.css';

import '../pages/css/pages.css';

import axios from 'axios';
import moment from 'moment'
import localization from 'moment/locale/es'
import { HeaderQR } from "./Header/HeaderQR";
import { ModalAviso } from './Avisos/Modal/ModalAviso';
import { navigate } from 'hookrouter'
import { title } from 'process';
moment().locale("es", localization);


function App() {
  const [state, actions] = useGlobal();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (loaded && !state.userSession && (window.location.pathname.split('/')[1] !== 'login' || window.location.pathname.split('/')[1] !== 'QR')) {
      navigate('/login')
    } /*else {
      if (state.userSession.pantallaOrigen === '/empresas') {
        navigate('/empresas')
      } else {
        let idProyecto = state.userSession && state.userSession.proyectos && state.userSession.proyectos[0] ? state.userSession.proyectos[0] : ':idProyecto'

        let pantallaOrigen = state.userSession.pantallaOrigen.replace(':idProyecto', idProyecto);
        navigate(pantallaOrigen)
      }
    }*/
  }, [state.userSession])
  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios.interceptors.request.use((config) => {
      // trigger 'loading=true' event here
      actions.addRequest();
      return config;
    }, (error) => {
      // trigger 'loading=false' event here      
      actions.removeRequest();
      return Promise.reject(error);
    });
    axios.interceptors.response.use(response => {
      actions.removeRequest();
      return response;
    }, error => {

      if (error.response && error.response.status === 401) {
        actions.setUserSession(null);
      }
      actions.removeRequest();
      return Promise.reject(error);
    });

    check().then(response => {
      actions.setUserSession(response.data.user);
      setLoaded(true);
    }).catch(err => {
      setLoaded(true);
    });
  }, [actions]);

  const [title, setTitle] = useState("QRISYS")
  const routeResult = useRoutes(routes(state.userSession, actions.hasPermission(), setTitle));
  const esQR = window.location.pathname.split('/')[1] === "QR";

  return (
    <div className="App">
      {loaded && <div className="main-container">
        {!esQR && <Header title={title} />}
        {esQR && <HeaderQR />}
        <div className={'container-fluid'} style={esQR ? { marginBottom: '30px' } : {}}>
          {routeResult || 'No se encuentra la página'}
        </div>
        <ModalAviso />
      </div >}
      <Loader visible={state.loader > 0} />
    </div>
  );
}

export default App;
