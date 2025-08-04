export interface ICertificacion {
    _id: string;
    fInicio: number; // fecha de inicio en timestamp unix
    fFin: number; // fecha de fin en timestamp unix
    sobreCoste: number; //Sobre coste en céntimos
    costeCert: number;
    costeTotal: number; //Coste total en el momento de la certificación
    perCert: number;// Porcentaje de produccion certificado en %
    perTotal: number;// Porcentaje del coste certificado en %
    nomber: string; //nombre de la certificación
    validada: boolean; //indicativo de sí la certificacion esta validada o no.
    proyecto: string;
    updated_for: string;
}
