
export default class AdquisicionPedido {
    constructor(initialValues) {
        this.nombre = initialValues.nombre;
        this._id = initialValues._id;
        this.tipo = initialValues.tipo;
        this.precio = initialValues.precio || '';
        this.estado = initialValues.estado || 'PENDIENTE';
        this.cantidad = initialValues.cantidad || '';
        this.unidad = initialValues.unidad || '';
    }
    setAdquisicion(adquisicion) {
        this.nombre = adquisicion.nombre;
        this._id = adquisicion._id;
        this.tipo = adquisicion.tipo;
    }
    setPrecio(precio) {
        if (precio) {
            this.precio = precio;
        }
    }
    setCantidad(cantidad) {
        this.cantidad = cantidad;
    }
    validateCantidad(cantidad) {
        if (!cantidad || cantidad.length === 0) return 'Hay que indicar una cantidad.'
        if (cantidad < 0) return 'La cantidad tiene que ser un valor positivo.';
        if (this.tipo === 'MAQUINA' && cantidad > 10) return 'No se pueden seleccionar más de 10 máquinas.';
        return ''
    }
    validate() {
        const nombre = this.nombre && this.nombre.length > 0 ? '' : 'Hay que seleccionar un recurso.'
        const precio = this.precio && this.precio > 0 ? '' : 'El precio tiene que ser un valor positivo.'
        const cantidad = this.validateCantidad(this.cantidad)
        const unidad = this.unidad && this.unidad.length > 0 ? '' : 'Hay que indicar una unidad.';
        return {
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            unidad: unidad
        }

    }
}
