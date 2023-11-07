"use client"

import { CustomerService } from '../../../demo/service/CustomerService';
import React, { useState, useEffect, lazy } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { HistorialCFDIService } from '../../services/HistorialCFDI.service';
import { HistorialCFDI } from '../../dto/HistorialCFDI.dto';
import { Button } from 'primereact/button';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import axios from 'axios';
import { ApiEDI } from '../../config/ApiEDI';

const baseURL = ApiEDI.urlEDI;

const defaultFilters: DataTableFilterMeta = {
    id: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    rfcEmisor: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    nombreEmisor: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    rfcReceptor: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    nombreReceptor: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    serie: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    folio: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    dirXml: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    oldFileName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    newFileName: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    fecha: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
    },
    hora: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    uuid: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    alertado: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    alertadoFecha: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    alertadoHora: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    respuesta: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
    fechaRespuesta: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
    },
    horaRespuesta: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
    },
};

export default function LazyLoadDemo() {
    const [filters, setFilters] = useState<DataTableFilterMeta>(defaultFilters);
    // variables de lazy load
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        filters: {
            id: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            rfcEmisor: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            nombreEmisor: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            rfcReceptor: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            nombreReceptor: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            serie: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            folio: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            dirXml: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            oldFileName: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            newFileName: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            fecha: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
            },
            hora: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            uuid: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            alertado: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            alertadoFecha: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            alertadoHora: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            respuesta: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            fechaRespuesta: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            horaRespuesta: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
        }
    });

    // Contenedor de los datos de la api
    const [HistorialCFDI, setHistorialCFDI] = useState<HistorialCFDI[]>([]);

    // funcion para sacar los datos de la api
    const fetchDataCFDI = async () => {
        setLoading(true);
        const response = await HistorialCFDIService.getHistorial(lazyState);
        const formattedData = getHistorial(response.registrosPagina);
        setHistorialCFDI(formattedData);
        setTotalRecords(response.totalRegistros);
        setHistorialCFDI(response.registrosPagina);
        console.log(HistorialCFDI)
        setLoading(false);
    }

    // Hace el casteo de la fecha
    const getHistorial = (data: HistorialCFDI[]) => {
        return data.map((d) => {
            d.fecha = new Date(d.fecha);
            d.alertadoFecha = new Date(d.alertadoFecha);
            d.fechaRespuesta = new Date(d.fechaRespuesta);
            return d;
        });
    };

    // Se hace fetchDataCFDI cada que lazyState cambia
    useEffect(() => {
        fetchDataCFDI();
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

    // Reenderiza cada fila de la tabla dando formato a la fecha
    const dateBodyTemplate = (rowData: HistorialCFDI) => {
        return formatDate(new Date(rowData.fecha));
    };

    // Funcion para desplegar el calendario en los filtros de las fechas
    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value} onChange={(e: CalendarChangeEvent) => options.filterCallback(e.value, options.index)} dateFormat="yy/mm/dd" placeholder="yyyy/mm/dd" mask="99/99/9999" />;
    };

    // const initFilters = () => {
    //     setFilters(null);
    // };

    // // Funcion para limpiar los filtros
    // const clearFilter = () => {
    //     initFilters();
    // };



    return (
        <div className="card">
            <DataTable value={HistorialCFDI} dataKey="id" loading={loading} lazy filterDisplay="menu" paginator totalRecords={totalRecords} rows={lazyState.rows} rowsPerPageOptions={[10, 25, 50, 100]} first={lazyState.first} onPage={onPage} onFilter={onFilter} filters={lazyState.filters} tableStyle={{ minWidth: '50rem' }} paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} a {last} de {totalRecords}">

                <Column field="id" header="Id" filter ></Column>
                <Column field="rfcReceptor" header="Rfc Receptor" filter filterPlaceholder="Search" ></Column>
                <Column field="nombreReceptor" header="Nombre del receptor" filter filterPlaceholder="Search" ></Column>
                <Column field="rfcEmisor" header="Rfc emisor" filter filterPlaceholder="Search" ></Column>
                <Column field="nombreEmisor" header="Nombre emisor" filter filterPlaceholder="Search" ></Column>
                <Column field="serie" header="Serie" filter filterPlaceholder="Search" ></Column>
                <Column field="folio" header="Folio" filter filterPlaceholder="Search" ></Column>
                {/* <Column field="uuid" header="UUID" style={{ width: '25%' }} filter filterPlaceholder="Search" ></Column> */}
                <Column field="fecha" header="Fecha" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate} ></Column>
            </DataTable>
        </div>
    );
}
