'use client'
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';

export default function UsersTable() {
    let emptyUser: User = {
        id: null,
        username: '',
        status: 'activo',
        dateAdded: new Date(),
        role: '',
    };

    const [users, setUsers] = useState<User[]>([]);
    const [userDialog, setUserDialog] = useState<boolean>(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState<boolean>(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState<boolean>(false);
    const [user, setUser] = useState<User>(emptyUser);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);

    useEffect(() => {
        // Cambiar ProductService por el servicio que obtiene la lista de usuarios
        // UserService.getUsers().then((data) => setUsers(data));
        // Ejemplo de inicialización con datos de prueba
        setUsers([
            {
                id: '1',
                username: 'user1',
                status: 'activo',
                dateAdded: new Date(),
                role: 'admin',
            },
            {
                id: '2',
                username: 'user2',
                status: 'inactivo',
                dateAdded: new Date(),
                role: 'user',
            },
        ]);
    }, []);

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    };

    const hideDeleteUsersDialog = () => {
        setDeleteUsersDialog(false);
    };

    const saveUser = () => {
        setSubmitted(true);

        if (user.username.trim()) {
            let _users = [...users];
            let _user = { ...user };

            if (user.id) {
                const index = findIndexById(user.id);

                _users[index] = _user;
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            } else {
                _user.id = createId();
                _users.push(_user);
                toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            }

            setUsers(_users);
            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const editUser = (user: User) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        let _users = users.filter((val) => val.id !== user.id);

        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };

    const findIndexById = (id: string) => {
        let index = -1;

        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = (): string => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Lista de usuarios</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    placeholder="Search..."
                    onInput={(e) => {
                        const target = e.target as HTMLInputElement;
                        setGlobalFilter(target.value);
                    }}
                />
            </span>
        </div>
    );

    const userDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveUser} />
        </React.Fragment>
    );

    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteUser} />
        </React.Fragment>
    );

    const dateBodyTemplate = (rowData: User) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return rowData.dateAdded.toLocaleDateString(undefined, options);
    };

    const actionBodyTemplate = (rowData: User) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (user: User) => {
        return user.status === 'activo' ? 'success' : 'danger';
    };

    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const cities: City[] = [
        { name: 'New York', code: 'NY' },
        { name: 'Rome', code: 'RM' },
        { name: 'London', code: 'LDN' },
        { name: 'Istanbul', code: 'IST' },
        { name: 'Paris', code: 'PRS' }
    ];


    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                <Toolbar className="mb-4" left={() => <Button label="Create New User" icon="pi pi-plus" severity="success" onClick={openNew} />} />
                <DataTable
                    value={users}
                    dataKey="id"
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column field="username" header="Usuario" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="status" header="Estatus" body={(rowData) => <Tag value={rowData.status} severity={getSeverity(rowData)}></Tag>} style={{ minWidth: '12rem' }}></Column>
                    <Column field="dateAdded" header="Fecha alta" body={dateBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="role" header="Rol" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={userDialog} style={{ width: '32rem' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="username" className="font-bold">
                        Nombre de usuario
                    </label>
                    <InputText
                        id="username"
                        value={user.username}
                        onChange={(e) => onInputChange(e, 'username')}
                        required
                        autoFocus
                        className={classNames({ 'p-invalid': submitted && !user.username })}
                    />

                    <div className="card flex justify-content-center">
                        <Dropdown value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name"
                            placeholder="Select a City" className="w-full md:w-14rem" />
                    </div>

                    {submitted && !user.username && <small className="p-error">Username is required.</small>}
                </div>
                {/* Resto del código sigue igual... */}
            </Dialog>
            <Dialog visible={deleteUserDialog} style={{ width: '32rem' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && <span>Are you sure you want to delete <b>{user.username}</b>?</span>}
                </div>
            </Dialog>
            <Dialog visible={deleteUsersDialog} style={{ width: '32rem' }} header="Confirm" modal onHide={hideDeleteUsersDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && <span>Are you sure you want to delete the selected users?</span>}
                </div>
            </Dialog>
        </div>
    );
}
