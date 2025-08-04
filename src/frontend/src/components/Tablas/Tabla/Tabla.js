import React from 'react';
import './Tabla.css';

export function Tabla({ head, body }) {

    return (
        <div className="table-container">
            <table className="table-qrisys">
                <thead>
                    {head}
                </thead>
                <tbody>
                    {body}
                </tbody>
            </table>
        </div>
    );
}
