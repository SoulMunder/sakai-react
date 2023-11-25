"use client"
import moment from 'moment';
import React, { useState, useEffect, lazy } from 'react';
import {
    DataTable, DataTableFilterMeta, DataTableSelectionChangeEvent, DataTableSelectAllChangeEvent,
    DataTablePageEvent, DataTableSortEvent, DataTableFilterEvent
} from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Ticket } from './Ticket.dto';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Tooltip } from 'primereact/tooltip';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { downloadService } from '../../services/Descarga.service';
import { TicketService } from './Ticket.service';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

export default function FillGrid() {
    // variables de lazy load
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        table: "",
        sortField: 'id',
        sortOrder: 1,
        filters: {
            Id: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            ClienteId: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            FileName: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            bckDir: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            NumDoc: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Sucursal: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Fecha: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
            },
            Eliminado: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            Procesado: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            ProcesadoError: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Enviado: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            EnviadoError: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Email: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            API_RecepcionArchivoId: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            }
        }
    });

    // Contenedor de los datos de la api
    const [Data, obtenerData] = useState<Ticket[]>([]);

    // funcion para sacar los datos de la api
    const fetchData = async () => {
        setLoading(true);
        if (lazyState.multiSortMeta) {
            delete lazyState.multiSortMeta;
        }
        const response = await TicketService.getData(lazyState);
        const formattedData = getData(response.registrosPagina);
        obtenerData(formattedData);
        setTotalRecords(response.totalRegistros);
        obtenerData(response.registrosPagina);
        setLoading(false);
    }

    // Hace el casteo de la fecha
    const getData = (data: Ticket[]) => {
        return data.map((d) => {
            // fechas de la tabla
            d.Fecha = new Date(d.Fecha);
            return d;
        });
    };

    // Se hace fetchData cada que lazyState cambia
    useEffect(() => {
        fetchData();
        console.log(lazyState)
    }, [lazyState]);

    const onPage = (event: any) => {
        setlazyState(event);
    };

    const onSort = (event: any) => {
        setlazyState(event);
    };

    // cuando se hace el filtrado se mandan los filtros mediate post
    const onFilter = async (event: any) => {
        event['first'] = 0;
        event['rows'] = lazyState.rows;
        event['page'] = lazyState.page;
        setlazyState(event);
        // setFilters(event.filters)
    };

    // Formatea la fecha para mostrarla en la tabla
    const formatDate = (value: Date) => {
        return moment(value).format('YYYY/MM/DD');
    };

    // Reenderiza las fechas en la tabla
    const dateBodyTemplate = (rowData: Ticket) => {
        return formatDate(new Date(rowData.Fecha));
    };

    // Funcion para desplegar el calendario en los filtros de las fechas
    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e: CalendarChangeEvent) => options.filterCallback(e.value, options.index)} dateFormat="yy/mm/dd" placeholder="yyyy/mm/dd" mask="99/99/9999" />;
    };

    const procBodyTemplate = (rowData: Ticket) => {
        let iconClass: string;
        let iconTooltip: string;

        if (rowData.Procesado === true) {
            iconClass = 'pi pi-check'; // Icono de palomita
            iconTooltip = 'Procesado';
        } else if (rowData.Procesado === false) {
            iconClass = 'pi pi-times'; // Icono de X
            iconTooltip = 'No procesado';
        } else {
            iconClass = 'pi pi-question'; // Icono de interrogación
            iconTooltip = 'Pendiente';
        }

        return (
            <div className="border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm">
                <i className={iconClass} style={{ fontSize: '1rem' }} title={iconTooltip}></i>
            </div>
        );
    };

    const sendBodyTemplate = (rowData: Ticket) => {
        let iconClass: string;
        let iconTooltip: string;

        if (rowData.Enviado === true) {
            iconClass = 'pi pi-check';
            iconTooltip = 'Enviado';
        } else if (rowData.Enviado === false) {
            iconClass = 'pi pi-times';
            iconTooltip = 'No Enviado';
        } else {
            iconClass = 'pi pi-question';
            iconTooltip = 'Pendiente';
        }

        return (
            <div className="border-circle w-2rem h-2rem inline-flex font-bold justify-content-center align-items-center text-sm">
                <i className={iconClass} style={{ fontSize: '1rem' }} title={iconTooltip}></i>
            </div>
        );
    };

    const errorBodyTemplate = (rowData: Ticket) => {

        let iconClass: string;
        let iconTooltip: string;
        if (rowData.ProcesadoError !== null) {
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

    // Modal para editar email
    const sendEmailBodyTemplate = (rowData: Ticket) => {
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
                        <label htmlFor="description" className="font-bold">
                            Puede agregar/editar 1 o varios correos separados por ';'
                        </label>
                        <InputTextarea
                            id="description"
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

    // Boton de descarga
    const downloadBodyTemplate = (rowData: any) => {

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

    // Columnas a mostrar
    const columns = [
        // { field: 'ClienteId', header: 'Cliente ID', filter: true },
        // { field: 'FileName', header: 'Archivo', filter: true },
        { field: 'bckDir', header: 'Bck Dir', filter: true },
        { field: 'NumDoc', header: 'Ticket', filter: true },
        { field: 'Sucursal', header: 'Sucursal', filter: true },
        // { field: 'ProcesadoError', header: 'Procesado Error', filter: true },
        { field: 'Email', header: 'Email', filter: true },
        { field: 'API_RecepcionArchivoId', header: 'API Recepcion Archivo ID', filter: true },
        // { field: 'EnviadoError', header: 'Enviado Error', filter: true },
    ];

    const [visibleColumns, setVisibleColumns] = useState(columns);

    const onColumnToggle = (event: MultiSelectChangeEvent) => {
        let selectedColumns = event.value;
        let orderedSelectedColumns = columns.filter((col) => selectedColumns.some((sCol: any) => sCol.field === col.field));

        setVisibleColumns(orderedSelectedColumns);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Tickets</h4>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{ width: '400px' }} display="chip" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    return (
        <div className="card">
            <DataTable
                header={header}
                value={Data}
                dataKey="Id"
                loading={loading}
                lazy
                filterDisplay="menu"
                paginator
                first={lazyState.first}
                onFilter={onFilter}
                onPage={onPage}
                rowsPerPageOptions={[10, 25, 50, 100]}
                rows={lazyState.rows}
                onSort={onSort}
                sortField={lazyState.sortField}
                sortOrder={lazyState.sortOrder}
                size="small"
                totalRecords={totalRecords}
                filters={lazyState.filters}
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
            >
                <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={downloadBodyTemplate} />
                <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={sendEmailBodyTemplate} />
                <Column field="Id" header="ID" filter></Column>
                {visibleColumns.map((col) => (
                    <Column key={col.field} field={col.field} header={col.header} filter={col.filter} />
                ))}
                <Column field='Enviado' header='Enviado' filter body={sendBodyTemplate}></Column>
                <Column field='Procesado' header='Procesado' filter body={procBodyTemplate}></Column>
                <Column field='ProcesadoError' header='Error' filter body={errorBodyTemplate}></Column>
                <Column
                    field="Fecha"
                    header="Fecha"
                    dataType="date"
                    body={dateBodyTemplate}
                    filter
                    filterElement={dateFilterTemplate}
                ></Column>
            </DataTable>
        </div>
    );
}
