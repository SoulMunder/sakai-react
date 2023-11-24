export interface HistorialCFDI{
    Id: number;
    RfcEmisor: string
    NombreEmisor: string;
    RfcReceptor: string;
    NombreReceptor: string;
    Serie: string;
    Folio: number;
    DirXml: string;
    OldFileName: string;
    NewFileName:string;
    Fecha: Date;
    Hora: string;
    Uuid: string;
    Alertado: boolean;
    AlertadoFecha: Date;
    AlertadoHota: Date;
    Respuesta: string
    FechaRespuesta: Date
    HoraRespuesta: string
}