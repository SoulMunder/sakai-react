export interface HistorialCFDI{
    id: number;
    rfcEmisor: string
    nombreEmisor: string;
    rfcReceptor: string;
    nombreReceptor: string;
    serie: string;
    folio: number;
    dirXml: string;
    oldFileName: string;
    newFileName:string;
    fecha: Date;
    hora: string;
    uuid: string;
    alertado: boolean;
    alertadoFecha: Date;
    alertadoHota: Date;
    respuesta: string
    fechaRespuesta: Date
    horaRespuesta: string
}