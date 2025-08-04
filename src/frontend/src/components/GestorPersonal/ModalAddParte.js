import React, { useState, useEffect } from 'react';
import { Modal } from "../Modal/Modal";
import { create } from '../../utils/ParteAsistenciaUtils';

export default function ModalAddParte({ empresa, open, setOpen, doCargar }) {

    const getMaxDate = () => {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return year + '-' + month + '-' + dt;

    }


    const header = "Parte díario - " + empresa.nombre;

    const [personalParte, setPersonalParte] = useState([]);
    const [errorHoras, setErrorHoras] = useState(false);
    const [errorFecha, setErrorFecha] = useState(false);
    const [fechaParte, setFechaParte] = useState(getMaxDate);




    const onClose = () => {
        doCargar();
        setOpen(false);
    };

    useEffect(() => {
        let array = [];
        empresa.personal.forEach(persona => {
            if (persona.confirmacion) {
                array.push({ nombre: persona.nombre, dni: persona.dni, horas: 0, asiste: false });
            }
        });
        setPersonalParte(array);

    }, []);

    const handleAsiste = (i) => {
        let newParte = [...personalParte];
        newParte[i].asiste = !newParte[i].asiste;
        setPersonalParte(newParte);
    };

    const saveParte = () => {
        if (!errorFecha && !errorHoras) {
            let parte = { fecha: fechaParte, asistentes: personalParte, empresa: empresa._id, proyecto: empresa.proyecto }
            create(parte).then(response => {
                if (response.status === 200) {
                    onClose();
                    setPersonalParte([]);
                }
            });
        }
    };

    const setHoras = (e, i) => {
        let newParte = [...personalParte];
        newParte[i].horas = e.target.value;
        setPersonalParte(newParte);
    };

    const changeHorasTodos = (e) => {
        if (e.target.value < 0) {
            setErrorHoras(true);
        } else {
            setErrorHoras(false);
            let arr = [...personalParte];
            arr.forEach(persona => {
                persona.horas = e.target.value;
            });
            setPersonalParte(arr);
        }
    };

    const setFecha = (e) => {
        let d = new Date().getDate();
        let nd = new Date().setDate(d);
        if (new Date(e.target.value) > new Date(nd)) {
            setErrorFecha(true);
        } else {
            setErrorFecha(false);
        }
        setFechaParte(e.target.value);
    };


    const body =
        <React.Fragment>
            <div className={'modal-body'}>
                <div className={'row'}>
                    <div className={'col-sm-12 col-md-6'}>
                        <div className={"form-group form-group-default" + (errorFecha ? " has-error" : "")} style={{ width: 'fit-content' }}>
                            <label>Fecha parte</label>
                            <input type="date" value={fechaParte} onChange={setFecha} className="form-control" max={getMaxDate()} />
                            {errorFecha > 0 && <label id="fFin-error" className="error" htmlFor="fFin">Introduce una fecha válida.</label>}
                        </div>
                    </div>
                    <div className={'col-sm-12 col-md-6'}>
                        <div className={'form-group form-group-default m-b-30' + (errorHoras ? ' has-error' : '')} style={{ width: 'fit-content' }}>
                            <label>Horas para todos</label>
                            <input id={'horas'} onChange={changeHorasTodos} type="number" className="form-control" />
                            {errorHoras && <label id="horas-error" className="error" htmlFor="horas">Introduce unas horas válidas.</label>}
                        </div>
                    </div>
                </div>

                {empresa.personal && personalParte.length > 0 && personalParte.map((persona, i) => {
                    return <div key={i} style={Object.assign({}, { display: 'grid', gridTemplateColumns: '60% 20% 20%', alignItems: 'center', margin: '8px 0', padding: '15px 8px' }, persona.asiste ? { backgroundColor: '#71af7159' } : { backgroundColor: '#f2f2f2' })}>
                        <div className={'persona-info'}>
                            <b>{persona.nombre} - {persona.dni}</b>
                        </div>
                        <div className={'form-group form-group-default' + (persona.horas < 0 ? ' has-error' : '')}>
                            <label>Horas</label>
                            <input id={'horas'} value={persona.horas} onChange={(e) => setHoras(e, i)} type="number" className="form-control" placeholder={'Horas'} />
                            {persona.horas < 0 && <label id="horas-error" className="error" htmlFor="horas">Introduce unas horas válidas.</label>}
                        </div>
                        <div className={'form-group'} style={{ marginBottom: '0' }}>
                            <div className={'checkbox check-primary'} style={{ margin: '0', display: 'flex', justifyContent: 'flex-end' }}>
                                <input value={'confirm'} id={"confirm-" + i} type="checkbox" checked={persona.asiste} onChange={() => handleAsiste(i)} />
                                <label htmlFor={'confirm-' + i} />
                            </div>
                        </div>
                    </div>
                })}
            </div>
            <div className={'modal-footer'} style={{ backgroundColor: 'var(--main-color)' }}>
                <div style={{ backgroundColor: 'var(--verde-agua)' }}>
                    <button className={'qr-btn confirm-btn'} onClick={saveParte}>Confirmar</button>
                </div>
            </div>
        </React.Fragment>
        ;


    return (
        <Modal modalOpen={open} setModalOpen={setOpen} header={header} body={body} onClose={onClose} />
    )
}
