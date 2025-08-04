import React, { useEffect, useRef, useState } from 'react';
import EmpresaSubForm from "./EmpresaSubForm";
import Adquisicion from "../../entidades/Adquisicion";
import EmpresaSubcontrata from "../../entidades/Empresa";
import Pedido from "../../entidades/Pedido";
import AdquisicionForm from "./AdquisicionForm";
import { AutocompleteSelect } from "../Globales/AutocompleteSelect/AutocompleteSelect";
import {
    findByEmpresaSub,
    findByTarea,
    findByProyectoNombre,
    findByNombre
} from '../../utils/AdquisicionesUtils';
import AdquisicionPedido from "../../entidades/AdquisicionPedido";
import { findByProyecto as findEmpresasByProyecto } from "../../utils/EmpresasSubcontrataUtils";
import documento from "../../assets/img/document.svg";
import { create, sendPhoto, generateExcel } from '../../utils/PedidosUtils'
import {TablaAdquisicionesPedidos} from "../Adquisiciones/Tablas/TablaAdquisicionesPedidos";
import {TablaAdquisiciones} from "../Adquisiciones/Tablas/TablaAdquisiciones";


export default function PedidoForm({ empresa, modalOpen, idProyecto, pedido, empresaDisabled, setModalContent, callbackPedido, adquisicionSelected, tarea, empresaSelected }) {

    const [nuevoPedido, setNuevoPedido] = useState(new Pedido(pedido ? pedido : (empresa ? { empresaSubcontrata: empresa._id, proyecto: idProyecto } : { proyecto: idProyecto })));

    const [errors, setErrors] = useState(null);
    const [errorsAdquisicion, setErrorsAdquisicion] = useState(null);
    const [page, setPage] = useState(0);
    const [nuevaAdquisicionPedido, setNuevaAdquisicionPedido] = useState(new AdquisicionPedido(adquisicionSelected ? adquisicionSelected : {}));

    let [files, setFiles] = useState([]);

    const [adquisicionesPedido, setAdquisicionesPedido] = useState(pedido ? pedido.adquisiciones : []);
    const [addingAdquisicion, setAddingAdquisicion] = useState(true);

    const thisRef = useRef();

    const [adquisionesProyecto, setAdquisicionesProyecto] = useState(false);
    const [empresasProyecto, setEmpresasProyecto] = useState(false);
    const [empresasTarea,setEmpresasTarea] = useState(false);
    const [adquisicionesEmpresa,setAdquisicionesEmpresa] = useState(false);
    const [adquisicionesTarea,setAdquisicionesTarea] = useState(false);
    const [adquisicionesPosibles,setAdquisicionesPosibles] = useState(false);

    const [empresaPedido, setEmpresaPedido] = useState(empresaSelected ? empresaSelected : null);

    useEffect(() => {
        if (modalOpen === false) {
            setNuevoPedido(new Pedido(pedido ? pedido : (empresa ? { empresaSubcontrata: empresa._id, proyecto: idProyecto } : { proyecto: idProyecto })));
            setNuevaAdquisicionPedido(new AdquisicionPedido(adquisicionSelected ? { adquisicion: adquisicionSelected, precio: adquisicionSelected.precio } : {}));
            setAdquisicionesPedido([]);
            setAddingAdquisicion(true);
            setErrors(null);
            setErrorsAdquisicion(null);
            setPage(0);
            setEmpresaPedido(null)
        }
        if (empresa) {
            setEmpresaPedido(empresa);
        }
    }, [modalOpen, adquisicionSelected, empresa, idProyecto, pedido,setEmpresaPedido]);
    const confirmPedidoContent = (pedido, callback) => {
        return (
            <React.Fragment>
                <div className={'modal-body'}>
                    <b>Recursos</b>
                    <TablaAdquisiciones adquisiciones={adquisicionesPedido} />
                    {/*{adquisicionesPedido.map((adquisicionPedido, i) => {*/}
                    {/*    return (*/}
                    {/*        <div key={i} style={{ backgroundColor: '#addead8c', padding: '8px', margin: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>*/}
                    {/*            <div>*/}
                    {/*                <span>{adquisicionPedido.nombre}</span> <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{adquisicionPedido.precio} €</span> <span style={{ fontWeight: 'bold' }}> - {adquisicionPedido.cantidad + ' ' + adquisicionPedido.unidad}</span>*/}
                    {/*            </div>*/}
                    {/*        </div>)*/}
                    {/*})}*/}
                    <span style={{ fontWeight: 'bold', fontSize: '1.1em' }} className={'m-t-15 m-b-15'}>¡PEDIDO AÑADIDO CORRECTAMENTE!</span>
                </div>
                <div className={'modal-footer'} style={{backgroundColor:'var(--main-color)'}}>
                    <div className={'cancel-container'}>
                        <button className={'qr-btn cancel-btn'} onClick={() => { if (callback) callback.call() }}>CERRAR</button>
                    </div>
                    <div style={{backgroundColor:'var(--verde-agua)'}}>
                        <button className={'qr-btn confirm-btn'} onClick={() => descargarExcel(pedido)}>Exportar pedido</button>
                    </div>
                </div>
            </React.Fragment>
        );
    };
    const descargarExcel = (pedido) => {
        generateExcel(pedido._id).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', pedido._id + '.xlsx'); //or any other extension
            document.body.appendChild(link);
            link.click();

        });
    }

    const hasErrors = (errors) => {
        let res = false;
        for (var prop in errors) {
            if (Object.prototype.hasOwnProperty.call(errors, prop)) {
                if (errors[prop] !== '') {
                    res = true;
                    break;
                }
            }
        }
        return res;
    }

    const createPedido = (e) => {
        e.preventDefault();
        create({ ...nuevoPedido, adquisiciones: adquisicionesPedido }, tarea ? tarea._id : null).then(response => {
            if (response.data.status === 200) {
                if (files.length > 0) {
                    let p = []
                    for (let i = 0; i < files.length; i++) {
                        const data = new FormData()
                        data.append('file', files[i])
                        p.push(sendPhoto(response.data.pedido._id, data))
                    }
                    Promise.all(p).then(values => {
                        const confirmContent = confirmPedidoContent(response.data.pedido, callbackPedido);
                        setModalContent({ header: 'Pedido creado correctamente', body: confirmContent });
                        // if(callbackPedido){
                        //     callbackPedido.call();
                        // }
                    })
                } else {
                    const confirmContent = confirmPedidoContent(response.data.pedido, callbackPedido);
                    setTimeout(() => { setModalContent({ header: 'Pedido creado correctamente', body: confirmContent }) }, 200);
                    // if(callbackPedido){
                    //     callbackPedido.call();
                    // }
                }

            } else {
                console.error('ERROR EN LA CREACION DEL PEDIDO');
            }
        }).catch(err => console.error(err));

    };


    useEffect(() => {
        if(tarea){
            findByTarea(tarea._id).then(response => {
                let adqs = response.data.adquisiciones;
                let e = [];
                let a = [];
                adqs.forEach(adq =>{
                    e.push(adq.empresa[0]);
                    a = a.concat(adq.adquisiciones);
                });
                setEmpresasTarea(e);
                setAdquisicionesTarea(new Set(a.map(x => x.nombre)));
                if(empresa){
                    getAdquisiciones(empresa._id,new Set(a.map(x => x.nombre)));
                }
                findByProyectoNombre(idProyecto).then(response => {
                    setAdquisicionesProyecto(response.data.adquisiciones);
                }).catch(err => console.error(err));
            }).catch(err => console.error(err));
        }else{
            findByProyectoNombre(idProyecto).then(response => {
                setAdquisicionesProyecto(response.data.adquisiciones);
            })
            if (empresa) {
                getAdquisiciones(empresa._id);
            }
        }
        if (!empresaDisabled) {
            findEmpresasByProyecto(idProyecto).then(response => {
                if (response.data.status === 200) {
                    setEmpresasProyecto(response.data.empresasSubcontratas);
                } else {
                    //console.error("error al obtener las empresas por proyecto");
                }
            }).catch(err => console.error(err));
        }

    }, [empresaDisabled, idProyecto,empresa,tarea,setEmpresasTarea,setEmpresasProyecto]);

    const handleImages = (event) => {
        let eventFiles = event.target.files;
        let newFiles = [...files];
        for (let i = 0; i < eventFiles.length; i++) {
            newFiles.push(eventFiles[i]);
        }
        setFiles(newFiles);
    };

    const returnBack = (pedido, empresaPasada, adquisicion) => {
        setModalContent({
            header: 'Nuevo pedido', body: <PedidoForm empresa={empresaPasada}
                adquisiciones={adquisicionesPedido}
                idProyecto={idProyecto}
                pedido={pedido}
                setModalContent={setModalContent}
                adquisicionSelected={adquisicion}
                callbackPedido={callbackPedido}
                empresaDisabled={!!empresaPedido}
                tarea={tarea}
                empresaSelected={empresaPasada}
            />
        });
    };

    function addAdquisicion(e) {
        e.preventDefault();
        const newAdquisicion = new AdquisicionPedido(nuevaAdquisicionPedido);
        const errors = newAdquisicion.validate();
        setErrorsAdquisicion(errors);
        if (!hasErrors(errors)) {
            setAddingAdquisicion(false);
            adquisicionesPedido.push(JSON.parse(JSON.stringify(nuevaAdquisicionPedido)))
            setAdquisicionesPedido(adquisicionesPedido);
            setNuevaAdquisicionPedido(new AdquisicionPedido({}));
            setNuevoPedido({ ...nuevoPedido, adquisiciones: adquisicionesPedido });
        }
    }

    function selectAdquisicion(option) {
        if (empresaPedido) {
            findByNombre(idProyecto, empresaPedido._id, option).then(response => {
                let adq = response.data.adquisicion;
                if (adq !== null) {
                    setNuevaAdquisicionPedido({
                        precio: adq.precio,
                        unidad: adq.unidad,
                        tipo: adq.tipo,
                        nombre: adq.nombre,
                        _id: adq._id
                    });
                }else{
                    const nuevaAdquisicion = new Adquisicion({ proyecto: idProyecto, nombre: option, empresaSubcontrata: empresaPedido._id });

                    function saveAdquisicion() {
                        if (tarea) nuevaAdquisicion.addTarea(tarea._id, tarea.factor);
                        nuevaAdquisicion.save().then(response => {
                            if (response.data.status === 200) {
                                returnBack(nuevoPedido, empresaPedido, response.data.adquisicion);
                            } else {
                                //console.error('error al crear la adquisicion');
                            }
                        }).catch(err => console.error(err));
                    }

                    function cancelOperation() {
                        returnBack(nuevoPedido);
                    }
                    const buttonsAdquisicion =
                        <div className={'modal-footer'} style={{backgroundColor:'var(--main-color)'}}>
                            <div className={'cancel-container'}>
                                <div  onClick={cancelOperation} className={'continue-row'}  style={{cursor:'pointer'}}><i className={'fa fa-arrow-left'}/><span>Atrás</span></div>
                            </div>
                            <div style={{backgroundColor:'var(--verde-agua)'}}>
                                <button type={'button'} onClick={saveAdquisicion} className={'qr-btn confirm-btn'}>Crear</button>
                            </div>
                        </div>;


                    const bodyAdquisicion = <React.Fragment> <AdquisicionForm adquisicion={nuevaAdquisicion} /> {buttonsAdquisicion}</React.Fragment>;
                    setModalContent({ header: 'Nuevo recurso', body: bodyAdquisicion });
                }
            })

        } else {
            window.alert('primero mete una empresa MAQUINA');
        }
    }


    function getAdquisiciones(empresa,adquisiciones) {
        findByEmpresaSub(empresa).then(response => {
            if (response.data.status === 200) {
                let adqs = response.data.adquisiciones;
                if(tarea){
                    let allAdqs = [];
                    if(adquisiciones) {
                        allAdqs = new Set([...new Set(adqs.map(x =>x.nombre)),...adquisiciones]);
                    }else{
                        allAdqs = new Set([...new Set(adqs.map(x =>x.nombre))]);
                    }
                    setAdquisicionesPosibles(allAdqs);
                }else{
                    setAdquisicionesEmpresa(new Set([...new Set(adqs.map(x =>x.nombre))]));
                }
            } else {
                console.error('error al obtener las adquisiciones');
            }
        }).catch(err => console.error(err));
    }
    function selectEmpresa(option) {
        if (option._id) {
            setNuevoPedido({ ...nuevoPedido, adquisiciones:[], empresaSubcontrata: option._id });
            setAdquisicionesPedido([]);
            setEmpresaPedido(option);
            getAdquisiciones(option._id,tarea ? adquisicionesTarea :  adquisionesProyecto);
        } else {
            let newEmpresa = new EmpresaSubcontrata({ proyecto: idProyecto, nombre: option.nombre });
            function saveEmpresa() {
                newEmpresa.save().then(response => {
                    if (response.data.status === 200) {
                        //setNuevoPedido({ ...nuevoPedido, empresa: response.data.empresaSubcontrata._id })
                        nuevoPedido.adquisiciones = [];
                        returnBack(nuevoPedido, response.data.empresaSubcontrata, undefined);
                    } else {
                        console.error('error al crear la empresa');
                    }
                }).catch(err => console.error(err));
            }
            function cancelOperation() {
                returnBack(nuevoPedido);
            }

            const buttonsEmpresa =
                <div className={'modal-footer'} style={{backgroundColor:'var(--main-color)'}}>
                    <div className={'cancel-container'}>
                        <div  onClick={cancelOperation} className={'continue-row'} style={{cursor:'pointer'}}><i className={'fa fa-arrow-left'}/><span>Atrás</span> </div>
                    </div>
                    <div style={{backgroundColor:'var(--verde-agua)'}}>
                        <button type={'button'} onClick={saveEmpresa} className={'qr-btn confirm-btn'}>Crear</button>
                    </div>
                </div>;
            const bodyEmpresa = <React.Fragment><EmpresaSubForm proyectoId={idProyecto} empresa={newEmpresa} fromPedido /> {buttonsEmpresa}</React.Fragment>;

            setModalContent({ header: 'Nueva empresa', body: bodyEmpresa });
        }
    }

    const handleXRecursos = (adquisicion) => () => {
        setAdquisicionesPedido(adquisicionesPedido.filter(x => x._id + '' !== adquisicion._id + ''))
    }
    const handleSiguiente = () => {
        const creandoEmpresa = nuevoPedido.empresaSubcontrata ? nuevoPedido.empresaSubcontrata : (empresa ? empresa._id ? empresa._id : empresa ? empresa : null : null);
        if (creandoEmpresa !== nuevoPedido.empresaSubcontrata) {
            setNuevoPedido({ ...nuevoPedido, empresaSubcontrata: creandoEmpresa });
        }
        const pedidoCreate = new Pedido({ ...nuevoPedido, adquisiciones: adquisicionesPedido, empresaSubcontrata: creandoEmpresa });
        const errors = pedidoCreate.validate()
        setErrors(errors);
        if (!hasErrors(errors)) {
            setPage(1);
        }
    }

    function handleXFiles(i) {
        let newFiles = [...files];
        newFiles.splice(i, 1);
        setFiles(newFiles);
    }

    return (
        <React.Fragment>
            <div className={'modal-body'}>
                {page === 0 && < div ref={thisRef}>
                    <b style={{color:'#b7b5b5',fontSize:'.9em'}}>Pedido para</b>
                    {
                        empresaDisabled && empresa ? <p style={{ fontWeight: 'bold' }}>{empresa.nombre}</p> : <AutocompleteSelect showNew={!tarea} reset={!modalOpen} errorMessage={errors && errors.empresa} label={'Nombre de la empresa subcontrata'} id={'empresa-name'} suggestions={empresasProyecto} initialSuggestions={tarea ? empresasTarea : empresasProyecto} clickEvent={selectEmpresa} defaultValue={empresaSelected ? empresaSelected.nombre : ''} onlySelector={!!tarea}/>
                    }
                    <form>
                        <div className={'row'}>
                            <div className={'col-xs-6'}>
                                <div className={'form-group form-group-default required' + (errors && errors.fechaEsperada.length > 0 ? " has-error" : "")}>
                                    <label>Fecha esperada</label>
                                    <input type={"date"} value={nuevoPedido.fechaEsperada || ''} name={'name'} aria-required={true} className={'form-control'} onChange={(e) => setNuevoPedido({ ...nuevoPedido, fechaEsperada: e.target.value })} />
                                    {errors && errors.fechaEsperada.length > 0 && <label id="error" className="error">{errors.fechaEsperada}</label>}
                                </div>
                            </div>
                            <div className={'col-xs-6'}>
                                <div className={'form-group form-group-default required' + (errors && errors.pagare.length > 0 ? " has-error" : "")}>
                                    <label>Pagaré a</label>
                                    <select value={nuevoPedido.pagare || 'default'} onChange={(e) => setNuevoPedido({ ...nuevoPedido, pagare: e.target.value })} type="text" className="form-control">
                                        <option disabled value={"default"}>Seleccione una opción</option>
                                        <option value={'0 DÍAS'}>0 DÍAS</option>
                                        <option value={'30 DÍAS'}>30 DÍAS</option>
                                        <option value={'60 DÍAS'}>60 DÍAS</option>
                                        <option value={'90 DÍAS'}>90 DÍAS</option>
                                        <option value={'120 DÍAS'}>120 DÍAS</option>
                                        <option value={'150 DÍAS'}>150 DÍAS</option>
                                        <option value={'180 DÍAS'}>180 DÍAS</option>
                                    </select>
                                    {errors && errors.pagare.length > 0 && <label id="error" className="error">{errors.pagare}</label>}
                                </div>
                            </div>
                        </div>
                    </form>
                    {errors && errors.adquisiciones.length > 0 && <label id="error" className="error">{errors.adquisiciones}</label>}
                    {
                       empresaPedido &&
                       <div style={{textAlign:'center'}}>
                           <b style={{margin:'8px 15px'}}>Recursos del pedido</b><br/>
                           <TablaAdquisiciones adquisiciones={adquisicionesPedido}/>
                           {/*{adquisicionesPedido.map((adquisicionPedido, i) => {*/}
                           {/*    return (*/}
                           {/*        <div key={i} style={{ backgroundColor: '#addead8c', padding: '8px', margin: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>*/}
                           {/*            <div>*/}
                           {/*                <span>{adquisicionPedido.nombre}</span> <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{adquisicionPedido.precio} €</span> <span style={{ fontWeight: 'bold' }}> - {adquisicionPedido.cantidad + ' ' + adquisicionPedido.unidad}</span>*/}
                           {/*            </div>*/}
                           {/*            <span onClick={handleXRecursos(adquisicionPedido)} style={{ cursor: 'pointer', border: 'solid 1px', padding: '0 4px', borderRadius: '4px' }}>X</span>*/}
                           {/*        </div>)*/}
                           {/*})}*/}
                           {
                               addingAdquisicion &&
                               <form onSubmit={addAdquisicion} style={{textAlign:'left',marginTop:'8px'}}>
                                   <div className={'row'}>
                                       <div className={'col-sm-12'}>
                                           <AutocompleteSelect errorMessage={errorsAdquisicion && errorsAdquisicion.nombre} reset={!modalOpen} label={'Nombre recurso'} id={'adquisicion-name'} suggestions={adquisionesProyecto} initialSuggestions={tarea ? adquisicionesPosibles : adquisicionesEmpresa} clickEvent={selectAdquisicion} defaultValue={nuevaAdquisicionPedido.nombre || ''} onlyNames />
                                       </div>
                                   </div>
                                   <div className={'row'}>
                                       <div className={'col-xs-4'}>
                                           <div className={'form-group form-group-default required' + (errorsAdquisicion && errorsAdquisicion.precio && errorsAdquisicion.precio.length > 0 ? " has-error" : "")}>
                                               <label>Precio / Unidad</label>
                                               <input type={"number"} value={nuevaAdquisicionPedido.precio || ''} name={'precio'} aria-required={true}
                                                      className={'form-control'} onChange={(e) => setNuevaAdquisicionPedido({ ...nuevaAdquisicionPedido, precio: e.target.value })} id={'adquisicion-price'} />
                                               {errorsAdquisicion && errorsAdquisicion.precio.length > 0 && <label id="error" className="error">{errorsAdquisicion.precio}</label>}
                                           </div>
                                       </div>
                                       <div className={'col-xs-4'}>
                                           <div className={'form-group form-group-default required' + (errorsAdquisicion && errorsAdquisicion.cantidad && errorsAdquisicion.cantidad.length > 0 ? " has-error" : "")}>
                                               <label>Cantidad</label>
                                               <input type={"number"} name={'cantidad'} aria-required={true} className={'form-control'} onChange={(e) => setNuevaAdquisicionPedido({ ...nuevaAdquisicionPedido, cantidad: e.target.value })} id={'adquisicion-cantidad'} />
                                               {errorsAdquisicion && errorsAdquisicion.cantidad && errorsAdquisicion.cantidad.length > 0 && <label id="error" className="error">{errorsAdquisicion.cantidad}</label>}
                                           </div>
                                       </div>
                                       <div className={'col-xs-4'}>
                                           <div className={'form-group form-group-default required' + (errorsAdquisicion && errorsAdquisicion.unidad && errorsAdquisicion.unidad.length > 0 ? " has-error" : "")}>
                                               <label>Unidad</label>
                                               <input type={"text"} value={nuevaAdquisicionPedido.unidad || ''} name={'unidad'} aria-required={true} className={'form-control'} onChange={(e) => setNuevaAdquisicionPedido({ ...nuevaAdquisicionPedido, unidad: e.target.value })} id={'adquisicion-unidad'} />
                                               {errorsAdquisicion && errorsAdquisicion.unidad && errorsAdquisicion.unidad.length > 0 && <label id="error" className="error">{errorsAdquisicion.unidad}</label>}
                                           </div>
                                       </div>
                                   </div>
                                   <button type={'submit'} className={'qr-btn add-btn'} style={{padding:'8px 30px'}}>Añadir recurso</button>
                               </form>
                           }
                           {
                               !addingAdquisicion && <button type={'button'} className={'qr-btn add-btn'} onClick={() => setAddingAdquisicion(true)}><i className={'fa fa-plus'}/> <b>Recurso</b></button>
                           }
                       </div>
                    }
                </div>}
                {page === 1 && <div>
                    <h3>Recursos</h3>
                    <TablaAdquisiciones adquisiciones={adquisicionesPedido} />
                    {/*{adquisicionesPedido.map((adquisicionPedido, i) => {*/}
                    {/*    return (*/}
                    {/*        <div key={i} style={{ backgroundColor: '#addead8c', padding: '8px', margin: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>*/}
                    {/*            <div>*/}
                    {/*                <span>{adquisicionPedido.nombre}</span> <span style={{ marginLeft: '8px', fontWeight: 'bold' }}>{adquisicionPedido.precio} €</span> <span style={{ fontWeight: 'bold' }}> - {adquisicionPedido.cantidad + ' ' + adquisicionPedido.unidad}</span>*/}
                    {/*            </div>*/}
                    {/*        </div>)*/}
                    {/*})}*/}
                    <div>
                        <b>¿Desea adjuntar algún fichero o comentario?</b>
                        <input type={'file'} id={'files-pedido'} style={{ display: 'none' }} onChange={handleImages} multiple />
                        <label htmlFor={'files-pedido'}>
                            <span type={'button'} className={'btn btn-info m-l-15'}><i className={'fas fa-file-upload'} /></span>
                        </label>
                    </div>

                    <div className={'form-group form-group-default'}>
                        <label>Comentario</label>
                        <textarea className={'form-control'} value={nuevoPedido.description.solicitar} onChange={(event) => setNuevoPedido({ ...nuevoPedido, description: { ...nuevoPedido.description, solicitar: event.target.value } })} />
                    </div>
                    {
                        files.length > 0 &&
                        <div className={'m-b-15'} style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
                            {files.map((file, i) => {
                                return <div style={{position: 'relative', marginRight: '15px', marginBottom: '15px'}}
                                            key={i}>
                                    <i className={'fa fa-times close-icon'} onClick={() => handleXFiles(i)}/>
                                    <img style={{objectFit: 'contain'}} src={URL.createObjectURL(file)}
                                         alt={'previsualizacion fichero'} onError={(e) => e.target.src = documento}
                                         width={150} height={100}/>
                                </div>
                            })}
                        </div>
                    }

                </div>}
            </div >
            {
                page === 0 &&
                <div className={'modal-footer'} style={{backgroundColor:'var(--verde-agua)'}}>
                    <div style={{backgroundColor:'var(--main-color)'}}>
                        <div onClick={handleSiguiente} className={'continue-row'} style={{cursor:'pointer'}}><span>Continuar</span> <i className={'fa fa-arrow-right'}/></div>
                    </div>
                </div>
            }
            {
                page === 1 &&
                <div className={'modal-footer'} style={{backgroundColor:'var(--main-color)'}}>
                    <div className={'cancel-container'}>
                        <div onClick={() => setPage(0)} className="continue-row"><i className={'fa fa-arrow-left'}/><span>Atrás</span></div>
                    </div>
                    <div style={{backgroundColor:'var(--verde-agua)'}}>
                        <button onClick={createPedido} className="qr-btn confirm-btn">Hacer pedido</button>
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

