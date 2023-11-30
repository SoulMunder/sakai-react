import { Button } from "primereact/button";
import { Ticket } from "./Ticket.dto";
import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { TicketService } from "./Ticket.service";

// Modal para editar email
export const sendEmailBodyTemplate = (rowData: Ticket) => {
    const [ticketDialog, setTicketDialog] = useState<boolean>(false);
    const [ticket, setTicket] = useState({ email: '' });

    const openNew = () => {
        setTicket({ email: rowData.Email });
        setTicketDialog(true);
    };

    const hideDialog = () => {
        setTicketDialog(false);
    };

    const saveEmail = async () => {
        console.log("Contenido del InputTextarea:", ticket.email);
        try {
            await TicketService.sendEmail(rowData.Id, ticket.email);
            console.log('Correo electrónico enviado exitosamente');
        } catch (error) {
            console.error('Error al enviar el correo electrónico:', error);
        }
        setTicketDialog(false);
    };

    const ticketDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Enviar" icon="pi pi-check" onClick={saveEmail} />
        </React.Fragment>
    );

    return (
        <>
            <Button icon="pi pi-send" rounded outlined className="mr-2" onClick={openNew}/>
            <Dialog
                visible={ticketDialog}
                style={{ width: '32rem' }}
                header="Reenviar ticket"
                modal
                className="p-fluid"
                footer={ticketDialogFooter}
                onHide={hideDialog}
            >
                <div className="field">
                    <label htmlFor="email" className="font-bold">
                        Puede agregar/editar 1 o varios correos separados por `&apos;`
                    </label>
                    <InputTextarea
                        id="email"
                        placeholder='Ej1: c1@test.com / Ej2: c1@test.com;c2@test.com'
                        value={ticket.email}
                        onChange={(e) => setTicket({ ...ticket, email: e.target.value })}
                        required
                        rows={3}
                        cols={20}
                    />
                </div>
            </Dialog>
        </>
    );
}

export const procBodyTemplate = (rowData: Ticket) => {
    let iconClass: string;
    let iconTooltip: string;

    if (rowData.Procesado === true) {
        iconClass = 'pi pi-check';
        iconTooltip = 'Procesado';
    } else if (rowData.Procesado === null) {
        iconClass = 'pi pi-question';
        iconTooltip = `${rowData.ProcesadoError}`;
    } else {
        iconClass = 'pi pi-times';
        iconTooltip = `${rowData.ProcesadoError}`;
    } 

    return (
        <div className="border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm">
            <i className={iconClass} style={{ fontSize: '1rem' }} title={iconTooltip}></i>
        </div>
    );
};

export const sendBodyTemplate = (rowData: Ticket) => {
    let iconClass: string;
    let iconTooltip: string;

    if (rowData.Enviado === true) {
        iconClass = 'pi pi-check';
        iconTooltip = 'Enviado';
    } else if (rowData.Enviado === null) {
        iconClass = 'pi pi-question';
        iconTooltip = `${rowData.EnviadoError}`;
    } else {
        iconClass = 'pi pi-times';
        iconTooltip = `${rowData.EnviadoError}`;
    } 

    return (
        <div className="border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm">
            <i className={iconClass} style={{ fontSize: '1rem' }} title={iconTooltip}></i>
        </div>
    );
};



// Boton de descarga
export const downloadBodyTemplate = (rowData: any) => {

    const handleDownload = (fileType: string) => {
        // Llamar a la función de descarga con el tipo de archivo y otros parámetros de la fila
        downloadFunction(rowData.bckDir, rowData.FileName, fileType);
    };

    const fileOptions = [
        { label: 'PDF', value: 'pdf', icon: 'pi-file-pdf' },
        { label: 'Spool', value: 'spf', icon: 'pi-file' },
        { label: 'XML', value: 'xml', icon: 'pi-file' },
    ];

    const optionTemplate = (option: any) => (
        <>
            <i className={classNames('pi', option.icon)} style={{ marginRight: '.5rem' }} />
            <span>{option.label}</span>
        </>
    );

    return (
        <div>
            <Dropdown
                options={fileOptions}
                onChange={(e) => handleDownload(e.value)}
                optionLabel="label"
                placeholder={
                    <div className="p-d-flex p-ai-center">
                        <i className={classNames('pi', 'pi-download')} style={{ marginRight: '.5rem' }} />
                        <span>Archivos</span>
                    </div>
                }
                itemTemplate={optionTemplate}
            />
        </div>
    );
};

const downloadFunction = async (rutaBCK: string, filename: string, extension: string) => {
    // await downloadService.downloadFile(rutaBCK, filename, extension);
    console.log(rutaBCK, filename, extension)
};