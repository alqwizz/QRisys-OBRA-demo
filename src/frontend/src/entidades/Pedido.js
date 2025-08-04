import { create, edit } from '../utils/PedidosUtils';

export default class Pedido {
    constructor(initialValues) {
        this.adquisiciones = initialValues.adquisiciones || [];
        this.empresaSubcontrata = initialValues.empresaSubcontrata || '';
        this.fechaRecepcion = initialValues.fechaRecepcion || null;
        this.fechaEsperada = initialValues.fechaEsperada || null;
        this.proyecto = initialValues.proyecto || null;
        this.pagare = initialValues.pagare || null;
        this.description = initialValues.description || {solicitar:''};
    }
    setPagare(pagare) {
        this.pagare = pagare;
    }
    setEmpresa(empresaId) {
        this.empresaSubcontrata = empresaId;
    }
    setAdquisiciones(adquisiciones) {
        this.adquisiciones = adquisiciones;
    }
    setFechaRecepcion(fecha) {
        this.fechaRecepcion = fecha;
        return this;
    }
    setFechaEsperada(fecha) {
        this.fechaEsperada = fecha;
    }
    setProyecto(proyecto) {
        this.proyecto = proyecto;
    }
    addAdquisicion(adquisicion) {
        this.adquisiciones.push(adquisicion);
    }
    removeAdquisicion(adquisicion) {
        this.adquisiciones = []
        this.adquisiciones = this.adquisiciones.filter(x => x.adquisicion._id + '' !== adquisicion.adquisicion._id + '')
    }
    getAdquisiciones() {
        return this.adquisiciones;
    }
    save(tarea) {
        return create(this, tarea);
    }
    edit(id) {
        this._id = id;
        return edit(this);
    }
    validate() {
        const empresa = this.empresaSubcontrata && this.empresaSubcontrata.length > 0 ? '' : 'Hay que seleccionar una empresa.'
        const fechaEspera = this.fechaEsperada && new Date(this.fechaEsperada) > new Date() ? '' : 'La fecha debe ser mayor o igual a hoy.'
        const pagare = this.pagare && this.pagare.length > 0 ? '' : 'Hay que seleccionar un método de pago.'
        const adquisiciones = this.adquisiciones && this.adquisiciones.length > 0 ? '' : 'Hay que seleccionar recursos.';
        return {
            empresa: empresa,
            fechaEsperada: fechaEspera,
            pagare: pagare,
            adquisiciones: adquisiciones,
        }

    }
}
