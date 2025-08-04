import React from 'react';
import useGlobal from "../../store/store";
import pedidosIcon from '../../assets/img/icons/delivery.svg';

export default function ListaEmpresas({ empresas, setEditEmpresa, setOpenEmpresa, setOpenPedidos, setOpenPresupuesto }) {

    const actions = useGlobal()[1];
    const hasPermission = actions.hasPermission();

    const hacerPedido = (e) => {
        setOpenPedidos(true);
        setEditEmpresa(e);
    };

    const editarEmpresa = (e) => {
        setEditEmpresa(e);
        setOpenEmpresa(true);
    };

    const doPresupuesto = (e) => {
        setEditEmpresa(e);
        setOpenPresupuesto(true);
    };

    return (
        <div>
            {empresas && empresas.length > 0 && empresas.map(empresa => {
                return <div className={'proyecto-item'} key={empresa._id}>
                    <div style={{ backgroundColor: 'var(--verde-agua)' }} className={'lateral-indicator'}></div>
                    <span className={'title'}>{empresa.nombre}</span>
                    <div style={{ display: 'flex' }}>
                        {hasPermission("CP") && <img src={pedidosIcon} alt={'icono del pedido'} onClick={() => hacerPedido(empresa)} style={{ cursor: 'pointer', marginRight: '8px', height: '1.3em' }} />}
                        {hasPermission("SP") && <i className="fas fa-hand-holding-usd" onClick={() => doPresupuesto(empresa)} style={{ color: 'var(--verde-agua)', cursor: 'pointer', marginRight: '8px', fontSize: '1.3em' }} />}
                        {hasPermission("EPR") && <i className={'fa fa-pencil-alt'} onClick={() => editarEmpresa(empresa)} style={{ color: 'var(--verde-agua)', cursor: 'pointer', fontSize: '1.2em' }} />}
                    </div>
                </div>
            })}
            {!(empresas && empresas.length > 0) && <p>No hay empresas disponibles.</p>}
        </div>
    )
}
