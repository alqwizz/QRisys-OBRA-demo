import React from 'react';
import { Tabla } from '../../Tablas/Tabla/Tabla';
export function TablaAdquisicionesPedidos({ adquisiciones, total, pedido, handleClick}) {

    const header = () => <tr role="row">
        <th>Nombre</th>
        <th>Cantidad</th>
        <th>Unidad</th>
        <th>Precio unitario</th>
        <th>Precio</th>
        {
            pedido.estado !== 'PENDIENTE' && pedido.estado !== 'RECHAZADO' && pedido.estado !== 'ANULADO' &&
            <th>QR</th>
        }
    </tr>;


    const makeBody = (adquisiciones) => {
        function getAdquisiciones(){
            return adquisiciones.map(u => {
                return (
                    <tr key={u._id} role="row">
                        <td className="v-align-middle sorting_1">
                            <span>{u.nombre}</span>
                        </td>
                        <td className="v-align-middle">
                            <span>{u.cantidad}</span>
                        </td>
                        <td className="v-align-middle">
                            <span>{u.unidad}</span>
                        </td>
                        <td className="v-align-middle">
                            <span>{u.precio}</span>
                        </td>
                        <td>
                            <span>{(u.precio * u.cantidad).toFixed(2)}</span>
                        </td>
                        {
                            pedido.estado !== 'RECHAZADO' && pedido.estado !== 'ANULADO' &&
                            <td className="v-align-middle" style={u.tipo === 'MAQUINA' ? {cursor:'pointer'} :  {}} onClick={ () => handleClick ? handleClick(u) :''}>
                                {
                                    u.tipo === 'MAQUINA' && <i className={'fas fa-qrcode'}/>
                                }
                            </td>
                        }
                    </tr>)
            });
        }
        return <React.Fragment>
            {getAdquisiciones()}
            {
                total &&
                    <React.Fragment>
                        <tr style={{backgroundColor:'#70adf947'}}>
                            <td ><b>Total</b></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{whiteSpace:'nowrap'}}><b>{total().toFixed(2)} €</b></td>
                        </tr>
                        <tr>
                            <td ><b>IVA</b></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{whiteSpace:'nowrap'}}><b>21%</b></td>
                        </tr>
                        <tr style={{backgroundColor:'#70adf947'}}>
                            <td ><b>Total Pedido</b></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td style={{whiteSpace:'nowrap'}}><b>{(total() * 1.21).toFixed(2)} €</b></td>
                        </tr>
                    </React.Fragment>

            }
        </React.Fragment>
    }

    return (
        <Tabla head={header()} body={makeBody(adquisiciones)} />
    )
}
