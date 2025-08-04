import React from 'react'
import './Header.css';
import LogoWhite from "../../assets/img/logo_qrysis_blanco.png";
import {navigate} from 'hookrouter';

export function HeaderQR() {

    return (
        <React.Fragment>
            <header className={'qr-header'}>
                <img src={LogoWhite} alt="logo" className="brand" data-src={LogoWhite} width="150" height="50" onClick={() => navigate('/')}/>
            </header>

            <div id={'qrisys-header-breadcrumb'}>
                <ul className="breadcrumb">
                    <li>
                        <b>LECTURA DE QR</b>
                    </li>
                </ul>
            </div>
        </React.Fragment>
    );

}
