export default class AdquisicionPresupuesto {
    constructor(initialValues) {
        this.nombre = initialValues.nombre;
        this._id = initialValues._id;
        this.cantidad = initialValues.cantidad || '';
        this.unidad = initialValues.unidad || '';
    }
    validate() {
        const nombre = this.nombre && this.nombre.length > 0 ? '' : 'Hay que seleccionar un recurso.'
        const cantidad = this.cantidad && this.cantidad.length > 0 ? '' : 'Hay que indicar una cantidad.'
        const unidad = this.unidad && this.unidad.length > 0 ? '' : 'Hay que indicar una unidad.';
        return {
            nombre,
            cantidad,
            unidad
        }

    }
}
