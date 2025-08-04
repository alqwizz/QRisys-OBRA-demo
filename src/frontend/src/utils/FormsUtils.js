export const formatDate = (date) => {
    if (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    } return '';
}
export const formatDateHour = (date) => {
    if (date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = d.getHours(),
            minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [day, month, year].join('/') + ' ' + hour + ':' + minutes;
    } return '';
}
export const avisoValidations = {
    validateTitulo: (titulo) => {
        if (!titulo || titulo === '' || titulo.length === 0) return 'Hay que introducir un título.';
        return ''
    },
    validateDescripcion: (descripcion) => {
        if (!descripcion || descripcion === '' || descripcion.length === 0) return 'Hay que introducir una descripción.';
        return ''
    },
    validateFecha: (fecha) => {
        if (!fecha || fecha === '') return 'Hay que introducir una fecha.';
        return ''
    },
    validateAutor: (autor) => {
        if (!autor || autor === '') return 'Hay que introducir un autor.';
        return ''
    }
}
export const pedidoValidations = {
    validateCantidad: (cantidad) => {
        if (!cantidad || cantidad === '' || cantidad < 0) return "Introduzca una cantidad válida."
        return ''
    },
    validateFechaRecepcion: (fecha) => {
        //if (fecha === '') return 'Introduzca una fecha de recepción válida.'
        return ''
    }
}
export const adquisicionValidations = {
    validateIdAquisicion: (idAdquisicion) => {
        if (idAdquisicion.length === 0) return 'Hay que introducir un identificador válido.'
        return '';
    },
    validateTipo: (tipo) => {
        const enumerado = ['MATERIAL', 'MANO DE OBRA', 'MAQUINA'];
        if (tipo === null || tipo === undefined || !enumerado.includes(tipo)) return 'Hay que introducir un tipo de recurso válido.'
        return '';
    },
    validateNombreSubcontrata: (nombre) => {
        if (nombre && !(nombre.length > 0)) return 'Hay que introducir un nombre subcontrata válido.'
        return ''
    },
    validateNombreContacto: (nombre) => {
        if (nombre.length === 0) return 'Hay que introducir un nombre de contacto válido.'
        return ''
    },
    validateEmail: (email) => {
        // eslint-disable-next-line
        const esEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email);
        if (!esEmail) return 'Hay que introducir un email válido.'
        return '';
    },
    validateTelefono: (telefono) => {
        if (telefono.length !== 9) return 'Hay que introducir un teléfono válido.'
        return '';
    },
    validateQR: (qr) => {
        return '';
    },
    validateNombreAdquisicion: (nombre) => {
        if (nombre.length === 0) return 'Hay que introducir un nombre válido.'
        return ''
    },
    validatePrecio: (precio) => {
        if (!precio || precio === '' || precio <= 0) return 'Hay que introducir un precio válido.'
        return ''
    },
    validateFechaRecepcion: (fecha) => {
        if (fecha === '') return 'Hay que introducir una fecha de recepción válida.'
        return ''
    },
    validateMedicionAdquirida: (medicion) => {
        if (medicion === '' || medicion < 0) return 'Hay que introducir una medición válida.'
        return ''
    },
    validateUnidad: (unidad) => {
        if (unidad === '') return 'Hay que introducir una unidad  válida.'
        return ''
    }
}
export const userValidations = {
    validatePassword: (password) => {
        if (password.length === 0) return 'Hay que introducir una contraseña válida.'
        return '';
    },
    validateUsername: (username) => {
        if (username.length === 0) return 'Hay que introducir un nombre de usuario válido.'
        return '';
    },
    validateNombre: (nombre) => {
        if (nombre.length === 0) return 'Hay que introducir un nombre válido.'
        return '';
    },
    validateApellidos: (nombre) => {
        if (nombre.length === 0) return 'Hay que introducir unos apellidos válidos.'
        return '';
    },
    validateEmail: (email) => {
        // eslint-disable-next-line
        const esEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email);
        if (!esEmail) return 'Hay que introducir un email válido.'
        return '';
    },
    validateTelefono: (telefono) => {
        if (!telefono || telefono.length !== 9) return 'Hay que introducir un teléfono válido.'
        return '';
    }
}
export const empresaValidations = {
    validateNombre: (nombre) => {
        if (nombre.length < 3) return 'Hay que introducir un nombre de empresa válido';
        return '';
    },
    validateDireccion: (direccion) => {
        return '';
    },
    validateNombreContacto: (nombre) => {
        if (nombre.length === 0) return 'Hay que introducir un nombre válido.';
        return '';
    },
    validateCif: (cif) => {
        if (cif.length === 0) return 'Hay que introducir un cif válido.';
        return '';
    },
    validateEmail: (email) => {
        // eslint-disable-next-line
        const esEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email);
        if (!esEmail) return 'Hay que introducir un email válido.'
        return '';
    },
    validateTelefono: (telefono) => {
        if (telefono.length > 0 && telefono.length !== 9) return 'Hay que introducir un teléfono válido.'
        return '';
    }
}
export const proyectoValidations = {
    validateDireccion: (direccion) => {
        if (direccion.length === 0) return 'Hay que introducir una dirección válida.'
        return '';
    },
    validateLat: (lat) => {
        if (lat.length === 0) return 'Hay que introducir una latitud válida.'
        return '';
    },
    validateLng: (lng) => {
        if (lng.length === 0) return 'Hay que introducir una longitud válida.'
        return '';
    },
    validateNombreContacto: (nombre) => {
        if (nombre.length === 0) return 'Hay que introducir un nombre de contacto válido.'
        return '';
    },
    validateNombre: (nombre) => {
        if (nombre.length === 0) return 'Hay que introducir un nombre de proyecto válido.'
        return '';
    },
    validateEmail: (email) => {
        // eslint-disable-next-line
        const esEmail = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(email);
        if (!esEmail) return 'Hay que introducir un email válido.'
        return '';
    },
    validateTelefono: (telefono) => {
        if (telefono.length !== 9) return 'Hay que introducir un teléfono válido.'
        return '';
    },
    validateEstadoProyecto: (estado) => {
        if (estado.length === 0) return 'Hay que introducir un estado del proyecto válido.'
        return '';
    },
    validateFInicio: (fInicio) => {
        if (!fInicio || fInicio === ' ') return 'Hay que introducir una fecha de inicio del proyecto válida.'
        return '';
    },
    validateFFin: (fFin) => {
        if (!fFin || fFin === ' ') return 'Hay que introducir una fecha de fin del proyecto válida.'
        return '';
    }
}
export const tareaValidations = {
    validateCodigo: (codigo) => {
        if (codigo.length === 0) return 'Hay que introducir un código válido.'
        return '';
    },
    validateNombre: (nombre) => {
        if (nombre.length === 0) return 'Hay que introducir un nombre de tarea válido.'
        return '';
    },
    validateIdPlanificacion: (idPlanificacion) => {
        return '';
    },
    validateIdPresupuesto: (idPresupuesto) => {
        return '';
    },
    validateIdPredecesora: (idPredecesora) => {
        return '';
    },
    validateUnidad: (unidad) => {
        return '';
    },
    validateMedicion: (medicion) => {
        return '';
    },
    validatePresupuesto: (presupuesto) => {
        return '';
    },
    validateCoordenadasGPS: (coordenadasGPS) => {
        return '';
    },
    validatePresupuestoActual: (presupuestoActual) => {
        return '';
    },
    validateMedicionActual: (unidad) => {
        return '';
    },
    validatePorcentajeActual: (medicion) => {
        return '';
    },
    validateIdQrisys: (presupuesto) => {
        return '';
    },
    validateFInicio: (fInicio) => {
        //if (!fInicio || fInicio === ' ') return 'Hay que introducir una fecha de inicio del proyecto válida.'
        return '';
    },
    validateFFin: (fFin) => {
        //if (!fFin || fFin === ' ') return 'Hay que introducir una fecha de fin del proyecto válida.'
        return '';
    }
}
