"use client"

import { CustomerService } from '../../../demo/service/CustomerService';
import React, { useState, useEffect, lazy } from 'react';
import {
    DataTable, DataTableFilterMeta, DataTableSelectionChangeEvent, DataTableSelectAllChangeEvent,
    DataTablePageEvent, DataTableSortEvent, DataTableFilterEvent
} from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Ticket } from './Ticket.dto';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { ApiEDI } from '../../config/ApiEDI';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { downloadService } from '../../services/Descarga.service';
import { TicketService } from './Ticket.service';

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
            d.fecha = new Date(d.fecha);
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
        setFilters(event.filters)
    };

    // Formatea la fecha para mostrarla en la tabla
    const formatDate = (value: Date) => {
        return value.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Reenderiza las fechas en la tabla
    const dateBodyTemplate = (rowData: Ticket) => {
        const originalDate = new Date(rowData.fecha);
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0');
        const day = String(originalDate.getDate()).padStart(2, '0');

        return `${year}/${month}/${day}`;

        // return formatDate(new Date(rowData.fecha));
    };

    // Funcion para desplegar el calendario en los filtros de las fechas
    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e: CalendarChangeEvent) => options.filterCallback(e.value, options.index)} dateFormat="yy/mm/dd" placeholder="yyyy/mm/dd" mask="99/99/9999" />;
    };

    // Para agregar un input text en el filtro de folios

    const [value, setValue] = useState('');

    const foliosFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <InputTextarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={5}
                cols={30}
                placeholder='111111,222222,333333...'
                onBlur={() => options.filterCallback(value)} // Aplica el filtro al perder el foco
            />
        );
    };

    // Boton de descarga
    const downloadBodyTemplate = (rowData: any) => {
        // const handleDownload = () => {
        //     // Llamar a la función de descarga con los parámetros de la fila
        //     downloadFunction(rowData.id, rowData.rfcEmisor, rowData.folio);
        // };
        // return <Button type="button" icon="pi pi-download" rounded onClick={handleDownload}></Button>;

        const handleDownload = (fileType: any) => {
            // Llamar a la función de descarga con el tipo de archivo y otros parámetros de la fila
            downloadFunction("C:\\Users\\allre\\Downloads\\", "245151101073", "pdf");
        };

        const fileOptions = [
            { label: 'PDF', value: 'pdf', icon: 'pi-file-pdf' },
            { label: 'XML', value: 'xml', icon: 'pi-file' },
        ];

        const optionTemplate = (option: any) => (
            <div className="p-d-flex p-ai-center">
                <i className={classNames('pi', option.icon)} style={{ marginRight: '.5rem' }} />
                <span>{option.label}</span>
            </div>
        );

        return (
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
        );

    };

    const downloadFunction = async (rutaBCK: string, filename: string, extension: string) => {
        await downloadService.downloadFile(rutaBCK, filename, extension);
    };

    // Columnas a mostrar
    const columns = [
        { field: 'rfcEmisor', header: 'RFC Emisor', filter: true },
        { field: 'nombreEmisor', header: 'Nombre Emisor', filter: true },
        { field: 'rfcReceptor', header: 'RFC Receptor', filter: true },
        { field: 'nombreReceptor', header: 'Nombre Receptor', filter: true },
        { field: 'serie', header: 'Serie', filter: true },
        { field: 'dirXml', header: 'Dir XML', filter: true },
        { field: 'oldFileName', header: 'Old File Name', filter: true },
        { field: 'newFileName', header: 'New File Name', filter: true },
        { field: 'uuid', header: 'UUID', filter: true },
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
                <h4 className="m-0">Historial CFDI</h4>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <MultiSelect value={visibleColumns} options={columns} optionLabel="header" onChange={onColumnToggle} style={{ width: '400px' }} display="chip" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    // const header = ;

    return (
        <div className="card">
            <DataTable
                header={header}
                value={Data}
                dataKey="id"
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
                <Column field="id" header="ID" filter></Column>
                <Column field="clienteId" header="Cliente ID" filter></Column>
                <Column field="fileName" header="File Name" filter></Column>
                <Column field="bckDir" header="BCK Dir" filter></Column>
                <Column field="numDoc" header="Num Doc" filter filterElement></Column>
                <Column field="sucursal" header="Sucursal" filter filterElement></Column>
                <Column
                    field="fecha"
                    header="Fecha"
                    dataType="date"
                    body={dateBodyTemplate}
                    filter
                    filterElement={dateFilterTemplate}
                ></Column>
                <Column header="Acciones" headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={downloadBodyTemplate} />
            </DataTable>
        </div>
    );
}
