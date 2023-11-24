export interface Ticket {
    id: number;
    clienteId: number;
    fileName: string;
    bckDir: string;
    numDoc: string;
    sucursal: string;
    fecha: Date;
    eliminado: boolean;
    procesado: boolean;
    procesadoError: string;
    enviado: boolean;
    enviadoError: string;
    email: string;
    apI_RecepcionArchivoId: number;
  }
  