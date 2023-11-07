"use client"

import { CustomerService } from '../../../demo/service/CustomerService';
import React, { useState, useEffect, lazy } from 'react';
import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
// import { HistorialCFDIService } from '../../../services/HistorialCFDI.service';
import { HistorialEDIService } from '../../services/HistorialEDI.service';
// import { HistorialCFDI } from '../../../dto/HistorialCFDI.dto';
import { HistorialEDI } from '../../dto/HistorialEDI.dto';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { ProgressBar } from 'primereact/progressbar';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { Tag } from 'primereact/tag';


export default function LazyLoadDemo() {
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedCustomers, setSelectedCustomers] = useState(null);
    const [filters, setFilters] = useState<HistorialEDI[]>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        // cliente: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    interface HistorialEDI {
        cadenaComercial: string;
        cliente: string;
        tipoDocumento: string;
        noDocumento: string;
        fechaRecepsion: string
        horaRecepsion: string;
        fechaProcesado: Date;
        horaProcesado: string;
        entregadoAs2edx: true;
        fechaEntregadoAs2edx: string;
        horaEntregadoAs2edx: string;
        guid: number;
        idTipoEdi: number;
        idTienda: number;
        nombreDoc: string;
        buzon: string;
        noProveedor: string;
        rutabck: string
    }

    const [HistorialEDI, setHistorialEDI] = useState<HistorialEDI[]>([]);

    useEffect(() => {
        fetch('http://localhost:5276/api/edi/HistorialEDI')
            .then((response) => response.json()) // Convierte la respuesta a JSON
            .then((data) => setHistorialEDI(getHistorial(data))); // Llama a la función getHistorial con los datos
    }, []);
    
    const getHistorial = (data: HistorialEDI[]) => {
        return data.map((d) => {
            d.fechaProcesado = new Date(d.fechaProcesado);
            return d;
        });
    };
    
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0">Customers</h4>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </span>
            </div>
        );
    };

    const header = renderHeader();

    const formatDate = (value: string | Date) => {
        return new Date(value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const dateBodyTemplate = (rowData: HistorialEDI) => {
        return formatDate(rowData.fechaProcesado);
    };


    // const onSelectionChange = (event) => {
    //     const value = event.value;

    //     setSelectedCustomers(value);
    //     setSelectAll(value.length === totalRecords);
    // };

    // const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;
    // const paginatorRight = <Button type="button" icon="pi pi-download" text />;

    return (
        <div className="card">
            <DataTable value={HistorialEDI} paginator header={header} rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                filters={filters} globalFilterFields={['cadenaComercial', 'cliente']}
                emptyMessage="Ningun registro para mostrar" currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas">


                <Column field="cadenaComercial" dataKey="guid" loading={loading} header="Cadena comercial" style={{ width: '25%' }} sortable filter filterPlaceholder="Search"></Column>
                <Column field="cliente" header="Cliente" style={{ width: '25%' }} sortable></Column>
                <Column field="tipoDocumento" header="Tipo de documento" style={{ width: '25%' }} sortable ></Column>
                <Column field="fechaProcesado" header="Fecha procesado" body={dateBodyTemplate} style={{ width: '25%' }} sortable></Column>
                <Column field="nombreDoc" header="Nombre documento" style={{ width: '25%' }} sortable></Column>
            </DataTable>
        </div>
    );
}

// import { CustomerService } from '../../../../demo/service/CustomerService';
// import React, { useState, useEffect } from 'react';
// import { FilterMatchMode, FilterOperator } from 'primereact/api';
// import { DataTable, DataTableFilterMeta } from 'primereact/datatable';
// import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
// import { InputText } from 'primereact/inputtext';
// import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
// import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
// import { Button } from 'primereact/button';
// import { ProgressBar } from 'primereact/progressbar';
// import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
// import { MultiSelect, MultiSelectChangeEvent } from 'primereact/multiselect';
// import { Slider, SliderChangeEvent } from 'primereact/slider';
// import { Tag } from 'primereact/tag';

// interface Country {
//   name: string;
//   code: string;
// }

// interface Representative {
//   name: string;
//   image: string;
// }

// interface Customer {
//   id: number;
//   name: string;
//   country: Country;
//   company: string;
//   date: string | Date;
//   status: string;
//   verified: boolean;
//   activity: number;
//   representative: Representative;
//   balance: number;
// }

// export default function CustomersDemo() {
//     const [customers, setCustomers] = useState<Customer[]>([]);
//     const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
//     const [filters, setFilters] = useState<DataTableFilterMeta>({
//         global: { value: null, matchMode: FilterMatchMode.CONTAINS },
//         name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
//         representative: { value: null, matchMode: FilterMatchMode.IN },
//         date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
//         balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
//         activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
//     });
//     const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
//     const [representatives] = useState<Representative[]>([
//         { name: 'Amy Elsner', image: 'amyelsner.png' },
//         { name: 'Anna Fali', image: 'annafali.png' },
//         { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
//         { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
//         { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
//         { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
//         { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
//         { name: 'Onyama Limba', image: 'onyamalimba.png' },
//         { name: 'Stephen Shaw', image: 'stephenshaw.png' },
//         { name: 'XuXue Feng', image: 'xuxuefeng.png' }
//     ]);
//     const [statuses] = useState<string[]>(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

//     const getSeverity = (status: string) => {
//         switch (status) {
//             case 'unqualified':
//                 return 'danger';

//             case 'qualified':
//                 return 'success';

//             case 'new':
//                 return 'info';

//             case 'negotiation':
//                 return 'warning';

//             case 'renewal':
//                 return null;
//         }
//     };

//     useEffect(() => {
//         CustomerService.getCustomersLarge().then((data) => setCustomers(getCustomers(data)));
//     }, []); // eslint-disable-line react-hooks/exhaustive-deps

//     const getCustomers = (data: Customer[]) => {
//         return [...(data || [])].map((d) => {
//             d.date = new Date(d.date);

//             return d;
//         });
//     };

//     const formatDate = (value: string | Date) => {
//         return new Date(value).toLocaleDateString('es-MX', {
//             year: 'numeric',
//             month: '2-digit',
//             day: '2-digit',
//         });
//     };

//     const formatCurrency = (value: number) => {
//         return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
//     };

//     const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         let _filters = { ...filters };

//         _filters['global'].value = value;

//         setFilters(_filters);
//         setGlobalFilterValue(value);
//     };

//     const renderHeader = () => {
//         return (
//             <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
//                 <h4 className="m-0">Customers</h4>
//                 <span className="p-input-icon-left">
//                     <i className="pi pi-search" />
//                     <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
//                 </span>
//             </div>
//         );
//     };

//     const countryBodyTemplate = (rowData: Customer) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt="flag" src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" className={`flag flag-${rowData.country.code}`} style={{ width: '24px' }} />
//                 <span>{rowData.country.name}</span>
//             </div>
//         );
//     };

//     const representativeBodyTemplate = (rowData: Customer) => {
//         const representative = rowData.representative;

//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt={representative.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${representative.image}`} width="32" />
//                 <span>{representative.name}</span>
//             </div>
//         );
//     };

//     const representativeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
//         return (
//             <React.Fragment>
//                 <div className="mb-3 font-bold">Agent Picker</div>
//                 <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
//             </React.Fragment>
//         );
//     };

//     const representativesItemTemplate = (option: Representative) => {
//         return (
//             <div className="flex align-items-center gap-2">
//                 <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
//                 <span>{option.name}</span>
//             </div>
//         );
//     };

//     const dateBodyTemplate = (rowData: Customer) => {
//         return formatDate(rowData.date);
//     };

//     const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
//         return <Calendar value={options.value} onChange={(e: CalendarChangeEvent) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
//     };

//     const balanceBodyTemplate = (rowData: Customer) => {
//         return formatCurrency(rowData.balance);
//     };

//     const balanceFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
//         return <InputNumber value={options.value} onChange={(e: InputNumberValueChangeEvent) => options.filterCallback(e.value, options.index)} mode="currency" currency="USD" locale="en-US" />;
//     };

//     const statusBodyTemplate = (rowData: Customer) => {
//         return <Tag value={rowData.status} severity={getSeverity(rowData.status)} />;
//     };

//     const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
//         return <Dropdown value={options.value} options={statuses} onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
//     };

//     const statusItemTemplate = (option: string) => {
//         return <Tag value={option} severity={getSeverity(option)} />;
//     };

//     const activityBodyTemplate = (rowData: Customer) => {
//         return <ProgressBar value={rowData.activity} showValue={false} style={{ height: '6px' }}></ProgressBar>;
//     };

//     const activityFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
//         return (
//             <>
//                 <Slider value={options.value} onChange={(e: SliderChangeEvent) => options.filterCallback(e.value)} range className="m-3"></Slider>
//                 <div className="flex align-items-center justify-content-between px-2">
//                     <span>{options.value ? options.value[0] : 0}</span>
//                     <span>{options.value ? options.value[1] : 100}</span>
//                 </div>
//             </>
//         );
//     };

//     const actionBodyTemplate = () => {
//         return <Button type="button" icon="pi pi-cog" rounded></Button>;
//     };

//     const header = renderHeader();

//     return (
//         <div className="card">
//             <DataTable value={customers} paginator header={header} rows={10}
//                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
//                     rowsPerPageOptions={[10, 25, 50]} dataKey="id" selectionMode="checkbox" selection={selectedCustomers} 
//                     onSelectionChange={(e) => {
//                         const customers = e.value as Customer[];
//                         setSelectedCustomers(customers);
//                     }}
//                     filters={filters} filterDisplay="menu" globalFilterFields={['name', 'country.name', 'representative.name', 'balance', 'status']}
//                     emptyMessage="No customers found." currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
//                 <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
//                 <Column field="name" header="Name" sortable filter filterPlaceholder="Search by name" style={{ minWidth: '14rem' }} />
//                 <Column field="country.name" header="Country" sortable filterField="country.name" style={{ minWidth: '14rem' }} body={countryBodyTemplate} filter filterPlaceholder="Search by country" />
//                 <Column header="Agent" sortable sortField="representative.name" filterField="representative" showFilterMatchModes={false} filterMenuStyle={{ width: '14rem' }}
//                     style={{ minWidth: '14rem' }} body={representativeBodyTemplate} filter filterElement={representativeFilterTemplate} />
//                 <Column field="date" header="Date" sortable filterField="date" dataType="date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} filter filterElement={dateFilterTemplate} />
//                 <Column field="balance" header="Balance" sortable dataType="numeric" style={{ minWidth: '12rem' }} body={balanceBodyTemplate} filter filterElement={balanceFilterTemplate} />
//                 <Column field="status" header="Status" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
//                 <Column field="activity" header="Activity" sortable showFilterMatchModes={false} style={{ minWidth: '12rem' }} body={activityBodyTemplate} filter filterElement={activityFilterTemplate} />
//                 <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
//             </DataTable>
//         </div>
//     );
// }
        