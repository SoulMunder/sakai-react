"use client"

import { CustomerService } from '../../../demo/service/CustomerService';
import React, { useState, useEffect, lazy } from 'react';
import {
    DataTable, DataTableFilterMeta, DataTableSelectionChangeEvent, DataTableSelectAllChangeEvent,
    DataTablePageEvent, DataTableSortEvent, DataTableFilterEvent
} from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { HistorialCFDIService } from '../../services/HistorialCFDI.service';
import { HistorialCFDI } from '../../dto/HistorialCFDI.dto';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { ApiEDI } from '../../config/ApiEDI';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';

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
        constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
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
    const [selectedRows, setSelectedRows] = useState<HistorialCFDI[] | null>(null);
    const [selectAll, setSelectAll] = useState<boolean>(false);
    const [lazyState, setlazyState] = useState({
        first: 0,
        rows: 10,
        page: 0,
        table: "",
        sortField: 'id',
        sortOrder: 1,
        filters: {
            id: {
                operator: FilterOperator.AND,
                constraints: [{ value: '415', matchMode: FilterMatchMode.CONTAINS }],
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
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
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
        if (lazyState.multiSortMeta) {
            delete lazyState.multiSortMeta;
        }
        const response = await HistorialCFDIService.getHistorial(lazyState);
        const formattedData = getHistorial(response.registrosPagina);
        setHistorialCFDI(formattedData);
        setTotalRecords(response.totalRegistros);
        setHistorialCFDI(response.registrosPagina);
        // console.log(HistorialCFDI)
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
        console.log("Folio", lazyState.filters.folio)
    }, [lazyState]);

    const onPage = (event: any) => {
        setlazyState(event);
    };

    const onSelectionChange = (event: DataTableSelectionChangeEvent) => {
        const value = event.value;

        setSelectedRows(value);
        setSelectAll(value.length === totalRecords);
    };

    const onSelectAllChange = (event: DataTableSelectAllChangeEvent) => {
        const selectAll = event.checked;

        if (selectAll) {
            // CustomerService.getCustomers().then((data) => {
            //     setSelectAll(true);
            //     setSelectedCustomers(data.customers);
            // });
        } else {
            setSelectAll(false);
            setSelectedRows([]);
        }
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

    // const foliosFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
    //     return <InputTextarea value={value} onChange={(e) => setValue(e.target.value)} rows={5} cols={30} placeholder='111111,222222,333333...'/>
    // };

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
            downloadFunction(rowData.id, rowData.rfcEmisor, rowData.folio, fileType);
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

    const downloadFunction = (id: string, rfc: string, folio: string, fileType: string) => {

        console.log(id, rfc, folio)

        // fetch(`servidor/ruta_de_descarga?id=${id}&rfc=${rfc}&folio=${folio}`)
        //     .then((response) => {
        //         // Manejar la respuesta del servidor
        //         if (response.ok) {
        //             // Éxito, puedes manejar la respuesta como sea necesario
        //         } else {
        //             // Error, manejar el error según tus necesidades
        //         }
        //     })
        //     .catch((error) => {
        //         // Manejar errores de red u otros errores
        //         console.error('Error en la petición:', error);
        //     });
    };

    // Columnas a mostrar
    const columns = [
        // { field: 'id', header: 'Id', filter: true, sortable: true },
        { field: 'rfcEmisor', header: 'RFC Emisor', filter: true },
        { field: 'nombreEmisor', header: 'Nombre Emisor', filter: true },
        { field: 'rfcReceptor', header: 'RFC Receptor', filter: true },
        { field: 'nombreReceptor', header: 'Nombre Receptor', filter: true },
        { field: 'serie', header: 'Serie', filter: true },
        // { field: 'folio', header: 'Folio', filter: true },
        { field: 'dirXml', header: 'Dir XML', filter: true },
        { field: 'oldFileName', header: 'Old File Name', filter: true },
        { field: 'newFileName', header: 'New File Name', filter: true },
        // { field: 'fecha', header: 'Fecha', filter: true, dataType: 'date', bodyTemplate: dateBodyTemplate, filterElement: dateFilterTemplate },
        // { field: 'hora', header: 'Hora', filter: true },
        { field: 'uuid', header: 'UUID', filter: true },
        // { field: 'alertado', header: 'Alertado', filter: true },
        // { field: 'alertadoFecha', header: 'Alertado Fecha', filter: true, dataType: 'date', bodyTemplate: dateBodyTemplate, filterElement: dateFilterTemplate },
        // { field: 'alertadoHora', header: 'Alertado Hora', filter: true },
        // { field: 'respuesta', header: 'Respuesta', filter: true },
        // { field: 'fechaRespuesta', header: 'Fecha Respuesta', filter: true, dataType: 'date', bodyTemplate: dateBodyTemplate, filterElement: dateFilterTemplate },
        // { field: 'horaRespuesta', header: 'Hora Respuesta', filter: true },
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
                value={HistorialCFDI}
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
                selection={selectedRows}
                onSelectionChange={onSelectionChange}
                selectAll={selectAll}
                onSelectAllChange={onSelectAllChange}
                size="small"
                totalRecords={totalRecords}
                filters={lazyState.filters}
                tableStyle={{ minWidth: '50rem' }}
                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                currentPageReportTemplate="{first} a {last} de {totalRecords}"
            >
                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} /> */}
                <Column field="id" header="Id" filter sortable></Column>
                {/* <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="id" header="Id" filter sortable></Column>
                <Column field="rfcReceptor" header="Rfc Receptor" filter filterPlaceholder="Search" ></Column>
                <Column field="nombreReceptor" header="Nombre del receptor" filter filterPlaceholder="Search" ></Column>
                <Column field="rfcEmisor" header="Rfc emisor" filter filterPlaceholder="Search" ></Column>
                <Column field="nombreEmisor" header="Nombre emisor" filter filterPlaceholder="Search" ></Column>
                <Column field="serie" header="Serie" filter filterPlaceholder="Search" ></Column>
                <Column field="folio" header="Folio" filter filterPlaceholder="Search" ></Column>
                <Column field="fecha" header="Fecha" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate} ></Column> */}

                {visibleColumns.map((col) => (
                    <Column key={col.field} field={col.field} header={col.header} filter={col.filter} />
                ))}
                <Column field="folio" header="Folio" filter filterElement={foliosFilterTemplate}></Column>
                <Column field="fecha" header="Fecha" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate} ></Column>
                <Column field="alertadoFecha" header="Fecha alertado" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate}></Column>
                <Column field="fechaRespuesta" header="Fecha respuesta" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate} ></Column>
                <Column header="Acciones" headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={downloadBodyTemplate} />
            </DataTable>
        </div>
    );
}
