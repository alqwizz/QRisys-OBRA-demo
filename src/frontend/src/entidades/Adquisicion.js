import { create, edit } from '../utils/AdquisicionesUtils';

export default class Adquisicion {
    constructor(initialValues) {
        this.tipo = initialValues.tipo || 'MATERIAL';
        this.nombre = initialValues.nombre || '';
        this.unidad = initialValues.unidad || '';
        this.proyecto = initialValues.proyecto || {};
        this.tareas = initialValues.tareas || [];
        this.precio = initialValues.precio || 1.0;
        this.empresaSubcontrata = initialValues.empresaSubcontrata || '';
    }
    get() {
        return this;
    }
    setTipo(tipo) {
        this.tipo = tipo;
        return this;
    }
    setNombre(nombre) {
        this.nombre = nombre;
        return this;
    }
    setUnidad(unidad) {
        this.unidad = unidad;
        return this;
    }
    setPrecio(precio) {
        this.precio = precio;
    }

    setProyecto(proyecto) {
        this.proyecto = proyecto;
        return this;
    }
    setTareas(tareas) {
        this.tareas = tareas;
        return this;
    }
    addTarea(tareaId,tareaFactor) {
        this.tareas.push({tarea:tareaId, factor: tareaFactor ? tareaFactor : 1 });
        return this.tareas;
    }
    validate() {
        const nombre = this.nombre && this.nombre.length > 0 ? '' : 'Hay que seleccionar un recurso.';
        const precio = this.precio && this.precio > 0 ? '' : 'El precio tiene que ser un valor positivo.';
        const unidad = this.unidad && this.unidad.length > 0 ? '' : 'Hay que indicar una unidad.';
        return {
            nombre: nombre,
            precio: precio,
            unidad: unidad
        }

    }
    save() {
        return create(this);
    }
    edit(id) {
        this._id = id;
        return edit(this);
    }
}
