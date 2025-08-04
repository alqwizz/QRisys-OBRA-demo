import React from 'react';

export default function AdquisicionForm({adquisicion}){

    return (
            <div className={'modal-body'}>
                <form>
                    <div className={'row'}>
                        <div className={'col-sm-12 col-md-6'}>
                            <div className={'form-group form-group-default required'}>
                                <label>Nombre</label>
                                <input type={"text"} defaultValue={adquisicion.nombre} className={'form-control'} onChange={(e) => adquisicion.setNombre(e.target.value)}/>
                            </div>
                        </div>
                        <div className={'col-sm-12 col-md-6'}>
                            <div className={'form-group form-group-default required'}>
                                <label>Tipo</label>
                                <select defaultValue={adquisicion.tipo || 'default'}  onChange={(e) => adquisicion.setTipo(e.target.value)}  className="form-control">
                                    <option disabled value={"default"}>Seleccione una opción</option>
                                    <option value={'MATERIAL'}>MATERIAL</option>
                                    <option value={'MANO DE OBRA'}>MANO DE OBRA</option>
                                    <option value={'MAQUINA'}>MAQUINA</option>
                                    <option value={'OTROS'}>OTROS GASTOS</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className={'row'}>
                        <div className={'col-sm-12 col-md-6'}>
                            <div className={'form-group form-group-default required'}>
                                <label>Unidad</label>
                                <input type={"text"} defaultValue={adquisicion.unidad} className={'form-control'} onChange={(e) => adquisicion.setUnidad(e.target.value)} />
                            </div>
                        </div>
                        <div className={'col-sm-12 col-md-6'}>
                            <div className={'form-group form-group-default required'}>
                                <label>precio</label>
                                <input type={"text"} defaultValue={adquisicion.precio} className={'form-control'} onChange={(e) => adquisicion.setPrecio(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

    )
}
