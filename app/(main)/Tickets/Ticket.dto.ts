export interface Ticket {
  Id: number;
  ClienteId: number;
  FileName: string;
  bckDir: string;
  NumDoc: string;
  Sucursal: string;
  Fecha: Date;
  Eliminado: boolean;
  Procesado: boolean;
  ProcesadoError: string;
  Enviado: boolean;
  EnviadoError: string;
  Email: string;
  API_RecepcionArchivoId: number;
}
