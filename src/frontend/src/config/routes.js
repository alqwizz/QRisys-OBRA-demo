import React from 'react';
import { Login } from '../components/Login/Login';
import { UsuariosEmpresa } from '../components/Usuarios/UsuariosEmpresa';
import { Empresas } from '../components/Empresas/Empresas';
import { Roles } from '../components/Roles/Roles';
import { DetalleProyecto } from '../components/Proyectos/DetalleProyecto';
import { NotAllowed } from '../components/NotAllowed/NotAllowed';
import { DetalleEmpresa } from '../components/Empresas/DetalleEmpresa';
import { RolesEmpresa } from '../components/Roles/RolesEmpresa';
import { DetalleTarea } from '../components/Tareas/DetalleTarea';
import { DetallePedidoQR } from '../components/Pedidos/DetallePedidoQR';
import { DetalleAdquisicionQR } from '../components/Pedidos/DetalleAdquisicionQR';
import { Avisos } from '../components/Avisos/Avisos';

export const routes = (userSession, hasPermission, setTitle) => {
    const QRS = {
        '/QR/:idPedido': ({ idPedido }) => <DetallePedidoQR idPedido={idPedido} />,
        '/QR/:idPedido/:idAdquisicion/:number': ({ idPedido, idAdquisicion, number }) => <DetalleAdquisicionQR idAdquisicion={idAdquisicion} idPedido={idPedido} number={number} />,
    }
    /*if (!userSession) return {
        ...QRS,
        '/*': () => <Login />
    }
    else */
    return {
        '/roles': hasPermission("GR") ? () => <Roles /> : () => <NotAllowed />,
        '/roles/:idEmpresa': hasPermission("GR") ? ({ idEmpresa }) => <RolesEmpresa idEmpresa={idEmpresa} /> : () => <NotAllowed />,
        '/empresas': hasPermission(["VEP", "VEPU"]) ? () => <Empresas setTitle={setTitle}/> : () => <NotAllowed />,
        '/avisos/:idProyecto': hasPermission(["CA"]) ? ({ idProyecto }) => <Avisos idProyecto={idProyecto} /> : () => <NotAllowed />,
        '/detalleEmpresa/:idEmpresa': hasPermission(["VEP", "VEPU"]) ? ({ idEmpresa }) => <DetalleEmpresa idEmpresa={idEmpresa} /> : () => <NotAllowed />,
        '/detalleProyecto/:idProyecto/:origin': hasPermission(["VEP", "VEPU"]) ? ({ idProyecto, origin }) => <DetalleProyecto idProyecto={idProyecto} origin={origin} /> : () => <NotAllowed />,
        '/detalleProyecto/:idProyecto': hasPermission(["VEP", "VEPU"]) ? ({ idProyecto }) => <DetalleProyecto idProyecto={idProyecto} setTitle={setTitle} /> : () => <NotAllowed />,

        //'/admin/proyectos/:idEmpresa': hasPermission("VAPE") ? ({ idEmpresa }) => <ProyectosEmpresa idEmpresa={idEmpresa} /> : () => <NotAllowed />,
        // '/admin/proyectos': hasPermission(["VAPE", "VP"]) ? () => <ProyectosEmpresa /> : () => <NotAllowed />,
        '/tareas/:idTarea': hasPermission(["VTRP", "VTP"]) ? ({ idTarea }) => <DetalleTarea idTarea={idTarea} /> : () => <NotAllowed />,
        '/usuarios/:idEmpresa': hasPermission("VAUE") ? ({ idEmpresa }) => <UsuariosEmpresa idEmpresa={idEmpresa} /> : () => <NotAllowed />,
        ...QRS,
        '/login': () => <Login />,
        '/*': userSession ? () => <Empresas /> : () => <Login />,
    }
}
