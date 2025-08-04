import React, { useEffect, useState } from 'react';
import ListaEmpresas from "./ListaEmpresas";
import NuevaEmpresaSub from "./NuevaEmpresaSub";
import { TablaPedidos } from "../Pedidos/Tablas/TablaPedidos";
import { findByProyecto } from '../../utils/PedidosUtils';
import { findByProyecto as findEmpresas } from '../../utils/EmpresasSubcontrataUtils';
import { ModalFormPedidos } from "../Pedidos/Modales/ModalFormPedidos";
import { ModalFormPresupuesto } from '../Pedidos/Modales/ModalPresupuesto';
import useGlobal from "../../store/store";
import Buscador from "../Proyectos/Buscador";

export default function GestorCompras({ proyecto }) {
    const [activeTab, setActiveTab] = useState('');

    const [cargar, setCargar] = useState(false);
    const [openEmpresa, setOpenEmpresa] = useState(false);
    const [openPresupuesto, setOpenPresupuesto] = useState(false);
    const [editEmpresa, setEditEmpresa] = useState(null);
    const [openPedidos, setOpenPedidos] = useState(false);

    const [pedidos, setPedidos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    const [search, setSearch] = useState('');

    const showTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };
    useEffect(() => {
        if (hasPermission("VGCP"))
            setActiveTab('empresa')
        else if (hasPermission("VGCPE"))
            setActiveTab('pedidos')
    }, [])
    useEffect(() => {
        if (!openEmpresa && !openPedidos && !openPresupuesto) {
            setEditEmpresa(null);
        }
    }, [openEmpresa, openPedidos, setEditEmpresa, openPresupuesto]);

    useEffect(() => {
        findByProyecto(proyecto._id, search).then(res => {
            console.log(res);
            setPedidos(res.data.pedidos);
        });
        findEmpresas(proyecto._id, search).then(response => {
            setEmpresas(response.data.empresasSubcontratas)
        }).catch(err => console.error(err));

    }, [setPedidos, cargar, search, proyecto]);

    const doCargar = () => {
        setCargar(!cargar);
        setEditEmpresa(null);
    }



    return (
        <div className={'section-body'}>
            <div className={'section-body--header'} style={{ marginBottom: '15px', justifyContent: 'space-evenly' }}>
                <div className={'selectors'}>
                    {hasPermission("VGCP") && <span className={'selector_item' + (activeTab === 'empresa' ? ' active' : '')} onClick={() => showTab('empresa')}>Empresas</span>}
                    {hasPermission("VGCPE") && <span className={'selector_item' + (activeTab === 'pedidos' ? ' active' : '')} onClick={() => showTab('pedidos')}>Pedidos</span>}
                </div>
                <Buscador setSearch={setSearch} />
            </div>
            <div className={'section-body--body'}>
                {activeTab === 'empresa' &&
                    <div>
                        {hasPermission("CPV") && <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <button className={'qr-btn add-btn'} onClick={() => { setOpenEmpresa(true) }} >
                                <i className={'fa fa-plus'} />
                                <b>Empresa</b>
                            </button>
                        </div>}
                        <ListaEmpresas idProyecto={proyecto._id} empresas={empresas} doCargar={doCargar} setEditEmpresa={setEditEmpresa} setOpenEmpresa={setOpenEmpresa} setOpenPedidos={setOpenPedidos} setOpenPresupuesto={setOpenPresupuesto} />
                        <NuevaEmpresaSub empresa={editEmpresa} idProyecto={proyecto._id} openModal={openEmpresa} setOpenModal={setOpenEmpresa} empresas={empresas} doCargar={doCargar} />
                        <ModalFormPresupuesto empresa={editEmpresa} empresaDisabled={!!editEmpresa} idProyecto={proyecto._id} modalOpen={openPresupuesto} setModalOpen={setOpenPresupuesto} callbackPedido={() => { setOpenPresupuesto(false); doCargar(); }} />
                        <ModalFormPedidos empresa={editEmpresa} empresaDisabled={!!editEmpresa} idProyecto={proyecto._id} modalOpen={openPedidos} setModalOpen={setOpenPedidos} callbackPedido={() => { setOpenPedidos(false); doCargar(); }} />
                    </div>
                }
                {activeTab === 'pedidos' && <React.Fragment>
                    <div className={'m-b-30'}>
                        {hasPermission("CP") && <button className={'qr-btn add-btn'} style={{ boxShadow: 'var(--shadow-1)', fontWeight: 'bold' }} onClick={() => setOpenPedidos(true)}>
                            <i className={'fa fa-plus'} />
                            <b>Pedido</b>
                        </button>}
                    </div>
                    <TablaPedidos pedidos={pedidos} doCargar={doCargar} />
                    <ModalFormPedidos empresa={editEmpresa} empresaDisabled={!!editEmpresa} idProyecto={proyecto._id} modalOpen={openPedidos} setModalOpen={setOpenPedidos} callbackPedido={() => { setOpenPedidos(false); doCargar(); }} />
                </React.Fragment>}
            </div>
        </div>
    )
}
