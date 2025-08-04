import React, { useState } from 'react';
import { Modal } from "../Modal/Modal";
import { addPersonal as AddPersonalToEmpresa } from "../../utils/EmpresasSubcontrataUtils";

export default function ModalAddPersonal({ empresa, open, setOpen, doCargar }) {

    const [personal, setPersonal] = useState(empresa.personal ? empresa.personal : []);
    const [newPersona, setNewPersonal] = useState({ nombre: '', dni: '', confirmacion: false });
    const header = "Añadir personal a la empresa " + empresa.nombre;

    const [errors, setErrors] = useState({ nombre: '', dni: '' });

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [personaDeleting,setPersonaDeleting] = useState(null);

    const onClose = () => {
        doCargar();
        setOpen(false);
    };

    const validateForm = () => {
        let errorNombre = (newPersona.nombre !== '' && newPersona.nombre.length > 3) ? '' : 'Introduce un nombre válido para continuar.';
        let nifRegex = /^[0-9]{8}[A-Z]$/i;
        let nieRegex = /^[XYZ][0-9]{7}[A-Z]$/i;

        let errorDNI = (nifRegex.test(newPersona.dni) || nieRegex.test(newPersona.dni)) && personal.filter(x => x.dni === newPersona.dni).length === 0 ? '' : 'Introduce un DNI válido.';

        return { nombre: errorNombre, dni: errorDNI };

    };

    const addPersonal = (e) => {
        e.preventDefault();
        let validateErrors = validateForm();
        if (validateErrors.nombre === '' && validateErrors.dni === '') {
            setPersonal([...personal, newPersona]);
            setNewPersonal({ nombre: '', dni: '', confirmacion: false });
            setErrors({ nombre: '', dni: '' });
        } else {
            setErrors(validateErrors);
        }
    };

    const removePersona = (persona) => {
        setPersonal(personal.filter(x => x !== persona));
        setShowConfirmDelete(false);
    };

    const handleConfirmPersona = (i) => {
        let newPersonal = [...personal];
        newPersonal[i].confirmacion = !newPersonal[i].confirmacion;
        setPersonal(newPersonal);
    };

    const savePersonal = () => {
        AddPersonalToEmpresa(empresa._id, personal).then(response => {
            if (response.status === 200) {
                onClose();
            }
        }).catch(err => console.error(err));
    };

    const body =
        <React.Fragment>
            <div className={'modal-body'}>
                {
                    showConfirmDelete && personaDeleting ?
                        <div>
                           <b>¿Estás seguro que desea eliminar de la lista de personal a {personaDeleting.nombre}?</b>
                        </div>
                        :
                        <React.Fragment>
                            <form onSubmit={addPersonal}>
                                <div className={'form-group'}>
                                    <div className={'row'}>
                                        <div className={'col-sm-12 col-md-6'}>
                                            <div className={"form-group form-group-default" + (errors.nombre.length > 0 ? " has-error" : "")}>
                                                <label>Nombre</label>
                                                <input id={'nombre'} value={newPersona.nombre} onChange={(e) => setNewPersonal({ ...newPersona, nombre: e.target.value })} type="text" className="form-control" />
                                                {errors.nombre.length > 0 && <label id="nombre-error" className="error" htmlFor="nombre">{errors.nombre}</label>}
                                            </div>
                                        </div>
                                        <div className={'col-sm-12 col-md-6'}>
                                            <div className={"form-group form-group-default" + (errors.dni.length > 0 ? " has-error" : "")}>
                                                <label>DNI</label>
                                                <input id={'dni'} value={newPersona.dni} onChange={(e) => setNewPersonal({ ...newPersona, dni: e.target.value })} type="text" className="form-control" />
                                                {errors.dni.length > 0 && <label id="dni-error" className="error" htmlFor="dni">{errors.dni}</label>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={'row'}>
                                        <div className={'col-sm-12 col-md-6'}>
                                            <div className={'checkbox check-success'}>
                                                <input value={'confirm'} id="confirm" type="checkbox" checked={newPersona.confirmacion} onChange={() => setNewPersonal({ ...newPersona, confirmacion: !newPersona.confirmacion })} />
                                                <label htmlFor={'confirm'}>Documentación validada</label>
                                            </div>
                                        </div>
                                        <div className={'col-sm-12 col-md-6'}>
                                            <button className={'btn btn-primary'} type={'submit'}>Añadir personal</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div>
                                {personal.map((persona, i) => {
                                    return <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textTransform: 'uppercase', padding: '15px 8px' }}>
                                        <b>{persona.nombre}. {persona.dni}</b>
                                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0' }} className={'form-group'}>
                                            <div className={'checkbox check-success'} style={{ margin: '0', display: 'flex' }}>
                                                <input value={'confirm' + i} id={'confirm' + i} type="checkbox" checked={persona.confirmacion} onChange={() => handleConfirmPersona(i)} />
                                                <label htmlFor={'confirm' + i}></label>
                                            </div>
                                            <i className={'fa fa-times'} style={{ cursor: 'pointer' }} onClick={() =>{setShowConfirmDelete(true); setPersonaDeleting(persona);}} />
                                        </div>

                                    </div>
                                })}
                            </div>
                        </React.Fragment>
                }
            </div>
            <div className={'modal-footer'} style={{backgroundColor:'var(--main-color)'}}>
                {
                    showConfirmDelete && <div className={'cancel-container'}><button className={'qr-btn cancel-btn'}  onClick={() => setShowConfirmDelete(false)}>Cancelar</button></div>
                }
                <div style={{backgroundColor:'var(--verde-agua)'}}>
                    <button className={'qr-btn confirm-btn'} onClick={()  => {showConfirmDelete ? removePersona(personaDeleting) : savePersonal()}}>Confirmar</button>
                </div>
            </div>
        </React.Fragment>
    ;

    return (
        <Modal modalOpen={open} setModalOpen={setOpen} header={header} body={body} onClose={onClose} />
    )
}
