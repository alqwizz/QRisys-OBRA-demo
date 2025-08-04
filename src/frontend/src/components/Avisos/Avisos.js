import React, { useEffect, useState } from 'react';
import { findByProyecto } from '../../utils/AvisosUtils';
import { findById as findProyectoById } from '../../utils/ProyectosUtils';
import { DetalleAviso } from './DetalleAviso';
import { ModalFormAviso } from './Modal/ModalFormAviso';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import './Avisos.css'

const getDay = date => {
    switch (date.getDay()) {
        case 0:
            return "Domingo";
        case 1:
            return "Lunes";
        case 2:
            return "Martes";
        case 3:
            return "Miércoles";
        case 4:
            return "Jueves";
        case 5:
            return "Viernes";
        case 6:
            return "Sábado";
        default: return "Domingo";
    }
}
export function Avisos({ idProyecto }) {

    const [avisos, setAvisos] = useState([])
    const [editAviso, setEditAviso] = useState(null)
    const [proyecto, setProyecto] = useState(null)
    const [avisoDetalle, setAvisoDetalle] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [cargar, setCargar] = useState(false);

    const doCargar = () => {
        setCargar(!cargar);
    }

    useEffect(() => {
        if (idProyecto) {
            findByProyecto(idProyecto).then(res => {
                setAvisos(res.data.avisos);
            })
            findProyectoById(idProyecto).then(res => {
                setProyecto(res.data.proyecto);
            })
        }
    }, [cargar])
    useEffect(() => {
        if (!openModal)
            setEditAviso(false)
    }, [openModal])

    const handleNuevoAviso = () => {
        setEditAviso(null);
        setOpenModal(true);
    }

    const isEditable = (fecha) => {
        const yesterday = (new Date());
        yesterday.setDate(new Date().getDate() - 1);
        if (fecha >= yesterday.getTime()) return true;
        return false;
    }
    const calculaFecha = (aviso) => {
        return new Date(aviso.fecha)
    }
    const getColor = aviso => {
        if (isEditable(aviso)) {
            return 'blue';
        }
        return 'green'
    }
    const getHoraMinutos = fecha => {
        const hora = ('' + fecha.getHours()).length === 1 ? '0' + fecha.getHours() : fecha.getHours();
        const minutos = ('' + fecha.getMinutes()).length === 1 ? '0' + fecha.getMinutes() : fecha.getMinutes();
        return hora + ':' + minutos
    }
    const handleDoubleClickDate = (date) => (info) => {
        const fecha = new Date(date).getTime();
        if (isEditable(fecha)) {
            setEditAviso({ fecha })
            setOpenModal(true)
        }
    }
    const handleDoubleClickEvent = (aviso) => () => {
        if (isEditable(aviso.fecha)) {
            setEditAviso(aviso);
            setOpenModal(true);
        }
    }
    return (
        <div className="section">
            <div className="section-heading">
                <div className="title">
                    <h3>AVISOS - {proyecto && proyecto.nombre}</h3>
                </div>
            </div>
            <div className="section-content">
                <button onClick={handleNuevoAviso} type="button" className="qr-btn add-btn"><i className={'fa fa-plus'} /><b>Aviso</b></button>
                <div>
                    <FullCalendar
                        buttonText={{
                            today: 'Hoy',
                            month: 'month',
                            week: 'week',
                            day: 'day',
                            list: 'list'
                        }}
                        locale={"es"}
                        firstDay={1}
                        columnHeaderText={getDay}
                        dateClick={function (info) {
                            info.view.el.ondblclick = handleDoubleClickDate(info.date);
                        }}
                        eventClick={function (info) {
                            if (info && info.event && info.event.id) {
                                const aviso = avisos.find(x => x._id + '' === info.event.id)
                                if (aviso) {
                                    setAvisoDetalle(aviso)
                                    info.el.ondblclick = handleDoubleClickEvent(aviso);
                                }
                            }

                            /*
                            info.el.style.backgroundColor = 'black';
                            info.el.style.borderColor = 'black';*/
                        }} events={avisos && avisos.length ? avisos.map(x => {
                            return {
                                id: x._id,
                                title: x.titulo + ' ' + getHoraMinutos(new Date(x.fecha)),
                                date: calculaFecha(x),
                                color: getColor(x),
                                allDay: true,
                                classNames: ['event-editable']
                            }
                        }) : []}
                        height={480}
                        defaultView="dayGridMonth"
                        plugins={[dayGridPlugin, interactionPlugin]} />
                    <DetalleAviso aviso={avisoDetalle} />
                </div>
            </div>
            <ModalFormAviso proyecto={proyecto} aviso={editAviso} doCargar={doCargar} modalOpen={openModal} setModalOpen={setOpenModal} />
        </div>)

}
