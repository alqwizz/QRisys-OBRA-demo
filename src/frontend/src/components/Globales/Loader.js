import React from 'react';
import './Loader.css';

export default function Loader({visible}){
    return (
        visible ?
            <div id={'qr-loader'}>
                <div id={'qr-loader-bck'}></div>
                <div id={'qr-loader-container'}>
                    <div className={'loader'}>
                        <svg viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40"/>
                        </svg>
                    </div>
                </div>
            </div>
            :
            <div></div>);
}
