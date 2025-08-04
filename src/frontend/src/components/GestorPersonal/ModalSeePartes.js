import React,{useEffect,useState} from 'react';
import {Modal} from "../Modal/Modal";
import {Tabla} from "../Tablas/Tabla/Tabla";

export default function ModalSeeParte({empresa, open, setOpen, doCargar,partes}){

    const [selectParte,setSelectParte] = useState(partes[0]);

    const header = "Detalle partes";

    useEffect(() => {setSelectParte(partes[0])},[partes,setSelectParte]);

    const body =
        <React.Fragment>
            <div className={'modal-body'}>
                <div className={'body_title'}>
                    <span style={{opacity:'.4',fontSize:'.9em'}}>Fecha</span> <span>{selectParte.fecha}</span>
                    <span  style={{opacity:'.4',fontSize:'.9em',marginLeft:'15px'}}>Nombre Empresa</span> <span>{empresa.nombre}</span>
                </div>
                <div className={'selectors'}>
                    {partes.map((parte,i) => {return <span key={i} className={'selector_item' + (selectParte === parte ? ' active' : '')} onClick={() => setSelectParte(partes[i])}>Parte {i+1}</span>})}
                </div>

                <div className={'detalle-parte'}>
                    <Tabla head={<tr>
                        <th>Nombre</th>
                        <th>DNI</th>
                    </tr>}
                           body={selectParte.asistentes.map(asistente => {
                               return <tr key={asistente._id} style={asistente.asiste ? {backgroundColor:'#71af7159'} : {}}>
                                   <td>{asistente.nombre}</td>
                                   <td>{asistente.dni}</td>
                               </tr>
                           })} />
                </div>
            </div>
        </React.Fragment>
        ;

    const onClose = () => {
        doCargar();
        setOpen(false);
    };
    return (
        <Modal modalOpen={open} setModalOpen={setOpen} header={header} body={body} onClose={onClose} alone />
    )
}
