import { create, edit } from '../utils/EmpresasSubcontrataUtils';

export default class EmpresaSubcontrata {
    constructor(initialValues) {
        this.nombre = initialValues.nombre || '';
        this.nombreContacto = initialValues.nombreContacto || '';
        this.email = initialValues.email || '';
        this.telefono = initialValues.telefono || '';
        this.proyecto = initialValues.proyecto || '';
        this.adquisiciones = initialValues.adquisiciones || [];
        this.cif = initialValues.cif || '';
    }
    get() {
        return this;
    }
    setCif(cif) {
        this.cif = cif;
    }
    setNombre(nombre) {
        this.nombre = nombre;
    }
    setNombreContacto(nombre) {
        this.nombreContacto = nombre;
    }
    setEmail(email) {
        this.email = email;
    }
    setTelefono(phone) {
        this.telefono = phone;
    }
    setProyecto(proyecto) {
        this.proyecto = proyecto;
    }
    setAdquisiciones(adquisiciones) {
        this.adquisiciones = [];
        adquisiciones.forEach(adq => {
            this.adquisiciones.push({ _id: adq._id, tipo: adq.tipo, unidad: adq.unidad, precio: adq.precio, nombre: adq.nombre, tareas: adq.tareas });
        });
    }
    addAdquisicion(adquisicion) {
        this.adquisiciones.push(adquisicion);
    }
    save() {
        return create(this);
    }
    setId(id) {
        this._id = id;
    }
    setVersion(version) {
        this._version = version;
    }
    validate() {
        const nombre = this.nombre && this.nombre.length > 0 ? '' : 'Hay que indicar un nombre de empresa.';
        const cif = this.cif && this.cif.length > 0 ? '' : 'Hay que indicar un CIF';
        const nombreContacto = this.nombreContacto && this.nombreContacto.length > 0 ? '' : 'Hay que indicar un nombre de contacto válido.';
        const adquisiciones = this.adquisiciones && this.adquisiciones.length > 0 ? '' : 'Hay que añadir al menos una adquisición';
        return {
            nombre: nombre,
            cif: cif,
            nombreContacto: nombreContacto,
            adquisiciones: adquisiciones
        }
    }
    edit(id, userId) {
        this._id = id;
        this.updated_for = userId;
        return edit(this);
    }
}
