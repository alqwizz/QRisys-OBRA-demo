import React, { useState } from 'react'
import useGlobal from "../../store/store";
import { A } from 'hookrouter'
import './Header.css';
import LogoWhite from "../../assets/img/logo_qrysis_blanco.png";
import LogoQ from "../../assets/img/logo_qrysis_q.png";
import { logout } from '../../utils/AuthenticationUtils';
import { navigate } from 'hookrouter'
export function Header({title}) {

    const [state, actions] = useGlobal();
    const breadcrumb = state.breadcrumb;

    const [openMenu, setOpenMenu] = useState(false);

    const hasPermission = actions.hasPermission();

    function closeMenu() {
        setOpenMenu(false);
        document.querySelector('#menu-bck').removeEventListener('click', closeMenu);
    }
    function handleOpenMenu() {
        setOpenMenu(true);
        document.querySelector('#menu-bck').addEventListener('click', closeMenu);
    }
    const clickLogout = () => {
        actions.setUserSession(null);
        logout().then(() => { navigate('/') }).catch(err => console.error(err));
        closeMenu();
    };

    if (state.userSession)
        return (
            <React.Fragment>
                <header className={'qr-header'}>
                    <img src={LogoQ} alt="logo" className="brand" data-src={LogoWhite} />
                    <h3 style={{ fontWeight: 'bold', fontSize: '1.5em', color:"white", margin:"0"}}>
                        {title}
                    </h3>
                    <i className={'fa fa-bars'} onClick={handleOpenMenu} />
                </header>
                <div id={'header-menu'} className={openMenu ? 'open' : ''}>
                    <A href="/empresas" onClick={closeMenu}>
                        <div className={'item'}>
                            <i className="fa fa-briefcase" />
                            <span>Empresas</span>
                        </div>
                    </A>
                    {hasPermission("GR") && <A href="/roles" onClick={closeMenu}>
                        <div className={'item'}>
                            <i className="fa fa-user-tag" />
                            <span>Gestión de roles</span>
                        </div>
                    </A>}
                    <div className={'item'} onClick={clickLogout}>
                        <i className={'fa fa-power-off'} />
                        <span>Cerrar sesión</span>
                    </div>
                </div>
                <div id={'menu-bck'}></div>
                <div id={'qrisys-header-breadcrumb'}>
                    <ul className="breadcrumb">
                        <li>
                            <span>Qrisys</span>
                        </li>
                        {breadcrumb.map((bread, index) => {
                            return <li key={index}>
                                <A href={bread.link} className="active">{bread.name}</A>
                            </li>
                        })}
                    </ul>
                </div>
            </React.Fragment>
        );
    return <div />

}
