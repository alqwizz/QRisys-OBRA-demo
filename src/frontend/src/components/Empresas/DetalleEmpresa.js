import React, { useState, useEffect } from 'react';
import { findById } from '../../utils/EmpresasUtils'
import useGlobal from "../../store/store";
import { ModalFormEmpresas } from './Modales/ModalFormEmpresas';
import { UsuariosEmpresa } from '../Usuarios/UsuariosEmpresa';
import { API_URL } from '../../config/config'
import { navigate } from 'hookrouter'
import logo from "../../assets/img/logo_qrysis.png";

export function DetalleEmpresa({ idEmpresa }) {

    let [empresa, setEmpresa] = useState(null);
    let [cargar, setCargar] = useState(false);
    let [loaded, setLoaded] = useState(false);
    let [modalOpen, setModalOpen] = useState(false);
    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    useEffect(() => {
        let unmounted = false;
        findById(idEmpresa).then(res => {
            const empresaRes = res.data.empresa;
            if (empresaRes) {
                if (!unmounted) {
                    setEmpresa(res.data.empresa);
                    setLoaded(true);
                }
            } else
                navigate('/empresas')

        });
        return () => { unmounted = true };
    }, [cargar, idEmpresa, setEmpresa, setLoaded]);

    useEffect(() => {
        if (loaded) {
            const breadcrumb = [
                { link: '/empresas', name: 'Empresas' },
                { link: '/detalleEmpresa/' + idEmpresa, name: empresa.cif }
            ]
            actions.setBreadcrumb(breadcrumb)
        }
    }, [loaded, empresa, actions, idEmpresa])

    // const handleUsuarios = () => {
    //     navigate('/usuarios/' + empresa._id)
    // }
    const handleEditar = () => {
        setModalOpen(true);
    }
    // const handleRoles = () => {
    //     navigate('/roles/' + empresa._id)
    // }
    const doCargar = () => {
        setCargar(!cargar)
    };

    if (!loaded) return <p>Cargando...</p>;
    if (loaded && !empresa) return <p>No se ha encontrado la empresa indicada o se ha producido un error.</p>;

    return (
        <div className={'section'}>
            <div className={'section-heading'}>
                <div className={'title'}>
                    <h3>
                        Gestión de la empresa - {empresa.nombre ? empresa.nombre : empresa.cif}
                    </h3>
                </div>
            </div>
            <div className={'section-content'}>
                <div className={'empresa-info'} style={{ marginTop: '30px', minHeight: '100px' }}>
                    <img alt={'empresa' + empresa.cif} src={API_URL + '/' + empresa.logo} onError={(e) => e.target.src = logo} />
                    <b className="title">{empresa.nombre || empresa.nombreContacto}</b>
                    {hasPermission("EE") && <i className={'fas fa-pencil-alt'} style={{ color: 'var(--verde-agua)', cursor: 'pointer', justifySelf: 'flex-end' }} onClick={handleEditar} />}
                </div>
                {hasPermission("GU") && <UsuariosEmpresa idEmpresa={idEmpresa} />}
            </div>
            <ModalFormEmpresas doCargar={doCargar} empresa={empresa} modalOpen={modalOpen} setModalOpen={setModalOpen} />
        </div>
    )

}
