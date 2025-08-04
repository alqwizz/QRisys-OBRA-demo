
export default class Certificacion{
    constructor(){
        this.fInicio = new Date();
        let date = new Date();
        this.fFin = new Date(date.setMonth(date.getMonth()+1));
        this.nombre= '';
        this.sobreCoste=0;
        this.costeTotal = 0;
        this.costeCert = 0;
        this.perCert = 0;
        this.perTotal = 0;
        this.validada = false;
    }
}

