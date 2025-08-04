import React, { useState, useEffect } from 'react'
import { AutocompleteSelect } from "../Globales/AutocompleteSelect/AutocompleteSelect";
import { findByProyectoNombre, findAllByNombre, generarComparativo } from '../../utils/AdquisicionesUtils'

export default function Comparativos({ proyecto }) {

    const [recursos, setRecursos] = useState([])
    const [recursosSelected, setRecursosSelected] = useState([])
    const [empresas, setEmpresas] = useState([])
    const [reset, setReset] = useState(0)

    const [comparativos, setComparativos] = useState([])

    useEffect(() => {
        findByProyectoNombre(proyecto._id).then(res => {
            setRecursos(res.data.adquisiciones)
        })
    }, [])

    const handleClick = (recursoNombre) => {
        let recursosAct = [...recursos]
        recursosAct = recursosAct.filter(x => x !== recursoNombre);
        setRecursos(recursosAct);
        setRecursosSelected([...recursosSelected, recursoNombre])
        setReset(reset + 1)

        findAllByNombre(proyecto._id, recursoNombre).then(res => {
            const adqs = res.data.adquisiciones;
            const comp = { recurso: recursoNombre, costeEmpresa: [] }
            for (let i = 0; i < adqs.length; i++) {
                const adq = adqs[i];
                if (!empresas.find(x => x._id + '' === adq.empresaSubcontrata._id + '')) {
                    setEmpresas(empOld => [...empOld, adq.empresaSubcontrata])
                }
                if (adq.unidad && !comp.unidad)
                    comp.unidad = adq.unidad
                comp.costeEmpresa.push({ nombreEmpresa: adq.empresaSubcontrata.nombre, coste: adq.precio })
            }
            setComparativos(oldComparativos => [...oldComparativos, comp])
        })

    }
    /*
        Ejemplo obj comparativos:
       [
           {
            recurso: "Obrero",
            unidad:"Personas",
            costeEmpresa:[{nombreEmpresa: "Boorpret", coste: 25.5, medicion: 2}, 
                            {nombreEmpresa: "Amazon", coste: 30.5, medicion: 2}
                            ]
            }
        ]
    */
    const handleRemove = (recNombre) => () => {
        let recursosSelAct = [...recursosSelected]
        recursosSelAct = recursosSelAct.filter(x => x !== recNombre);
        let oldComparativos = [...comparativos];
        oldComparativos = oldComparativos.filter(x => x.recurso !== recNombre);
        setRecursosSelected(recursosSelAct);
        setRecursos([...recursos, recNombre])
        setComparativos(oldComparativos)
    }
    const getCoste = (rec, nombreEmpresa) => {
        const comp = comparativos.find(x => x.recurso === rec)
        if (!comp) return 0;
        const find = comp.costeEmpresa.find(x => x.nombreEmpresa === nombreEmpresa)
        if (!find) return 0;
        return find.coste;
    }
    const getUnidad = (rec) => {
        const comp = comparativos.find(x => x.recurso === rec);
        const unidad = comp && comp.unidad ? comp.unidad : ''
        return unidad;

    }
    const handleChangeCoste = (rec, nombreEmpresa) => (event) => {
        const value = event.target.value;
        const compsOld = [...comparativos];
        const comp = compsOld.find(x => x.recurso === rec)
        if (!comp) throw Error("No se encuentra el recurso");
        const find = comp.costeEmpresa.find(x => x.nombreEmpresa === nombreEmpresa)
        if (!find) comp.costeEmpresa.push({ nombreEmpresa: nombreEmpresa, coste: value })
        else find.coste = value;
        setComparativos(compsOld)
    }

    const getMedicion = (rec, nombreEmpresa) => {
        const comp = comparativos.find(x => x.recurso === rec)
        if (!comp) return '';
        const find = comp.costeEmpresa.find(x => x.nombreEmpresa === nombreEmpresa)
        if (!find) return '';
        return find.medicion ? find.medicion : '';
    }
    const handleChangeMedicion = (rec, nombreEmpresa) => (event) => {
        const value = event.target.value;
        const compsOld = [...comparativos];
        const comp = compsOld.find(x => x.recurso === rec)
        if (!comp) throw Error("No se encuentra el recurso");
        const find = comp.costeEmpresa.find(x => x.nombreEmpresa === nombreEmpresa)
        if (!find) comp.costeEmpresa.push({ nombreEmpresa: nombreEmpresa, medicion: value })
        else find.medicion = value;
        setComparativos(compsOld)
    }
    const getTotal = (nombreEmpresa) => {
        let total = 0;
        for (let i = 0; i < comparativos.length; i++) {
            const comparativo = comparativos[i];
            const costeEmpresa = comparativo.costeEmpresa.find(x => x.nombreEmpresa === nombreEmpresa);
            if (costeEmpresa) {
                const medicion = costeEmpresa.medicion ? costeEmpresa.medicion : 0
                const coste = costeEmpresa.coste ? costeEmpresa.coste : 0;
                const totalThis = medicion * coste;
                total += totalThis;
            }
        }
        return total.toFixed(2);
    }

    const handleExportar = () => {
        generarComparativo(comparativos).then(response => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'comparativo.xlsx');
            document.body.appendChild(link);
            link.click();
        })
    }
    const handleRemoveEmpresa = (nombre) => () => {
        setEmpresas(oldEmpresa => oldEmpresa.filter(x => x.nombre !== nombre))
        let comparativosOld = [...comparativos]
        for (let i = 0; i < comparativosOld.length; i++) {
            const comparativo = comparativosOld[i];
            const costeEmpresaOld = [...comparativo.costeEmpresa]
            comparativo.costeEmpresa = costeEmpresaOld.filter(c => c.nombreEmpresa !== nombre)
        }
        setComparativos(comparativosOld)
    }
    return (
        <div>
            <div className="comparativos-header">
                <AutocompleteSelect
                    showNew={false}
                    reset={reset}
                    onlyNames={true}
                    label={'Selecciona un conjunto de recursos'}
                    id={'comp-recursos'}
                    suggestions={recursos}
                    initialSuggestions={recursos}
                    clickEvent={handleClick}
                    defaultValue={''}
                    onlySelector={true} />
                <button className={'qr-btn add-btn'} onClick={handleExportar} >
                    <i className={'far fa-file-excel'} />
                    <b>Exportar</b>
                </button>
            </div>
            <div className="comparativos-table">
                <table >
                    <thead>
                        <tr>
                            <th></th>
                            {empresas && empresas.length > 0 && empresas.map(empresa => {
                                return <th key={empresa._id + 'th'} colSpan="2">{empresa.nombre}<i style={{ cursor: 'pointer', color: 'red' }} className="fa fa-times" onClick={handleRemoveEmpresa(empresa.nombre)} /></th>;
                            })}
                        </tr>
                        <tr>
                            <th></th>
                            {empresas && empresas.length > 0 && empresas.map(empresa => {
                                return [<td key={empresa._id + '01'}>COSTE</td>, <td key={empresa._id + '11'}>MEDICIÓN</td>];
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {recursosSelected && recursosSelected.length > 0 && recursosSelected.map((rec, index) => {
                            return <tr key={"tr" + rec + index}>
                                <td>{rec}<i style={{ cursor: 'pointer', color: 'red' }} className="fa fa-times" onClick={handleRemove(rec)} /> <b> {getUnidad(rec)}</b></td>
                                {empresas && empresas.length > 0 && empresas.map(empresa => {
                                    return [
                                        <td key={rec + index + '01'}><input type="number" value={getCoste(rec, empresa.nombre)} onChange={handleChangeCoste(rec, empresa.nombre)} /></td>,
                                        <td key={rec + index + 'td1'}><input type="number" value={getMedicion(rec, empresa.nombre)} onChange={handleChangeMedicion(rec, empresa.nombre)} /></td>];
                                })}
                            </tr>
                        })}
                        <tr>
                            <td></td>
                            {empresas && empresas.length > 0 && empresas.map(empresa => {
                                return <td key={empresa._id + 'td01'} colSpan="2">Total: {getTotal(empresa.nombre)} €</td>
                            })}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}
