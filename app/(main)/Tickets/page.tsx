"use client"
import moment from 'moment';
import React, { useState, useEffect, lazy } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Ticket } from './Ticket.dto';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { TicketService } from './Ticket.service';
import { sendEmailBodyTemplate, procBodyTemplate, sendBodyTemplate, downloadBodyTemplate } from './Config';
import { getJwtClaims } from '../../services/Claims.service';

export default function FillGrid() {
    // variables de lazy load
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        table: "",
        sortField: 'Id',
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
