export default class Pedido {
    constructor(initialValues) {
        this.adquisiciones = initialValues.adquisiciones || [];
        this.empresaSubcontrata = initialValues.empresaSubcontrata || '';
    }
    validate() {
        const empresa = this.empresaSubcontrata && this.empresaSubcontrata.length > 0 ? '' : 'Hay que seleccionar una empresa.'
        const adquisiciones = this.adquisiciones && this.adquisiciones.length > 0 ? '' : 'Hay que seleccionar recursos.';
        return {
            empresa: empresa,
            adquisiciones: adquisiciones,
        }

    }
}
