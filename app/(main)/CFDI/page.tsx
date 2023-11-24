"use client"

import moment from 'moment';
import React, { useState, useEffect, lazy } from 'react';
import {
    DataTable, DataTableFilterMeta, DataTableSelectionChangeEvent, DataTableSelectAllChangeEvent,
    DataTablePageEvent, DataTableSortEvent, DataTableFilterEvent
} from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { HistorialCFDIService } from './HistorialCFDI.service';
import { HistorialCFDI } from './HistorialCFDI.dto';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { downloadService } from '../../services/Descarga.service';

export default function LazyLoadDemo() {
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
        sortField: 'Id',
        sortOrder: 1,
        filters: {
            Id: {
                operator: FilterOperator.AND,
                constraints: [{ value: '415', matchMode: FilterMatchMode.STARTS_WITH }],
            },
            RfcEmisor: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            NombreEmisor: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            RfcReceptor: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            NombreReceptor: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Serie: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Folio: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }],
            },
            DirXml: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            OldFileName: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            NewFileName: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Fecha: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }],
            },
            Hora: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Uuid: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Alertado: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            AlertadoFecha: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            AlertadoHora: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            Respuesta: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
            },
            FechaRespuesta: {
                operator: FilterOperator.AND,
                constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
            },
            HoraRespuesta: {
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
            d.Fecha = new Date(d.Fecha);
            d.AlertadoFecha = new Date(d.AlertadoFecha);
            d.FechaRespuesta = new Date(d.FechaRespuesta);
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
    };

    // Formatea la fecha para mostrarla en la tabla
    const formatDate = (value: Date) => {
        return moment(value).format('YYYY/MM/DD'); 
    };

    // Reenderiza cada fila de la tabla dando formato a la fecha
    const dateBodyTemplate = (rowData: HistorialCFDI) => {
        return formatDate(new Date(rowData.Fecha));
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

        var archivo =  await downloadService.downloadFile(rutaBCK, filename, extension);

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
        { field: 'RfcEmisor', header: 'RFC Emisor', filter: false },
        { field: 'NombreEmisor', header: 'Nombre Emisor', filter: true },
        { field: 'RfcReceptor', header: 'RFC Receptor', filter: true },
        { field: 'NombreReceptor', header: 'Nombre Receptor', filter: true },
        { field: 'Serie', header: 'Serie', filter: true },
        // { field: 'folio', header: 'Folio', filter: true },
        { field: 'DirXml', header: 'Dir XML', filter: true },
        { field: 'OldFileName', header: 'Old File Name', filter: true },
        { field: 'NewFileName', header: 'New File Name', filter: true },
        // { field: 'fecha', header: 'Fecha', filter: true, dataType: 'date', bodyTemplate: dateBodyTemplate, filterElement: dateFilterTemplate },
        // { field: 'hora', header: 'Hora', filter: true },
        { field: 'Uuid', header: 'UUID', filter: true },
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
                <Column field="Id" header="Id" filter sortable></Column>
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
                <Column field="Folio" header="Folio" filter filterElement={foliosFilterTemplate}></Column>
                <Column field="Fecha" header="Fecha" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate} ></Column>
                <Column field="AlertadoFecha" header="Fecha alertado" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate}></Column>
                <Column field="FechaRespuesta" header="Fecha respuesta" dataType="date" body={dateBodyTemplate} filter filterElement={dateFilterTemplate} ></Column>
                <Column header="Acciones" headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={downloadBodyTemplate} />
            </DataTable>
        </div>
    );
}
