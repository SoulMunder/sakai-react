'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { UsersService } from './User.service';
import { Password } from 'primereact/password';

export default function UsersTable() {

    const { data: session } = useSession()

    let id = session?.user.ClienteId;

    let emptyUser: Usuario = {
        Id: null,
        UserName: '',
        Password: '',
        passTemp: '',
        Activo: true,
        FechaAlta: new Date(),
        RolId: null,
        ClienteId: id,
        Correo: ''
    };

    const [users, setUsers] = useState<Usuario[]>([]);
    const [user, setUser] = useState<Usuario>(emptyUser);
    const [tempUser, setTempUser] = useState<UserEdit>();
    const [userDialog, setUserDialog] = useState<boolean>(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState<boolean>(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState<boolean>(false);
    const [editUserDialog, setEditUserDialog] = useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const toast = useRef<Toast>(null);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, name: string) => {
        const val = e.target.value;
        setUser((prevUser) => ({ ...prevUser, [name]: val }));
    };

    const fetchData = useCallback(async () => {
        try {
            if (typeof id !== 'undefined') {
                const response = await UsersService.getUsers(id);
                setUsers(response);
            } else {
                console.error('id is undefined');
            }
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al solicitar datos al servidor',
                life: 3000,
            });
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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

    const saveUser = async() => {
        setSubmitted(true);

        if (user.UserName.trim()) {
            if (user.UserName.trim() && user.Password === user.passTemp) {
                let _users = [...users];
                // let _user = { ...user, RolId: selectedRole };
                const _user: UserCreate = {
                    UserName: user.UserName,
                    Password: user.Password,
                    FechaAlta: user.FechaAlta, // Convertir a cadena en formato ISO
                    RolId: selectedRole,
                    ClienteId: user.ClienteId,
                    Correo: user.Correo,
                };

                await UsersService.createUser(_user)

                setUserDialog(false);
                fetchData();
                setUser(emptyUser);
                setUsers(_users);
                // Lógica adicional para asegurar que 'password' y 'passwordConfirm' coincidan
            } else {
                // Muestra un mensaje de error si los campos no coinciden
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Las contraseñas no coinciden',
                    life: 3000,
                });
            }

            setUserDialog(false);
            setUser(emptyUser);
        }
    };

    const editUser = (rowData: Usuario) => {
        setSelectedRole(rowData.RolId);
        setChecked(rowData.Activo);
        setUser({ ...rowData })
        setEditUserDialog(true);
        console.log("Antes de editar", rowData)
    };

    const hideEditUserDialog = () => {
        setSubmitted(false);
        setEditUserDialog(false);
    };

    const saveUserEdited = async () => {
        setSubmitted(true);

        // validar que el campo Password no este vacio
        if (user.Password === '') {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'La contraseña no puede estar vacia',
                life: 3000,
            });
            return;
        }

        const userEdited: UserEdit = {
            Id: user.Id,
            UserName: user.UserName,
            Password: user.Password,
            RolId: selectedRole,
            Activo: checked,
            Correo: user.Correo,
        };

        console.log("Usuario editado", userEdited)

        await UsersService.updateUser(userEdited)

        toast.current?.show({
            severity: 'success',
            summary: 'Completado',
            detail: 'Usuario editado correctamente',
            life: 3000,
        });

        // actualizar users
        let _users = [...users];
        fetchData();
        setUser(emptyUser);
        setUsers(_users);

        // limpiar tempUser
        setTempUser(emptyUser);
        // limpiar editedUser
        // cerrar dialogo
        setEditUserDialog(false);
    };

    const editUserDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideEditUserDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveUserEdited} />
        </React.Fragment>
    );


    const [userToDeleteId, setUserToDeleteId] = useState<number | null>(null);

    const confirmDeleteUser = (rowData: Usuario) => {
        setUserToDeleteId(rowData.Id)
        console.log("id", userToDeleteId)
        setDeleteUserDialog(true);
    };

    const deleteUser = async() => {
        if (userToDeleteId) {
            await UsersService.deleteUser(userToDeleteId)
            toast.current?.show({ severity: 'success', summary: 'Completado', detail: 'Usuario eliminado', life: 3000 });
        }
        setDeleteUserDialog(false);
        fetchData();
        setUserToDeleteId(null);
    };

    const header = (
        <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 className="m-0">Lista de usuarios</h4>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    placeholder="Buscar..."
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
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" onClick={saveUser} />
        </React.Fragment>
    );

    const deleteUserDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
            <Button label="Eliminar" icon="pi pi-check" severity="danger" onClick={deleteUser} />
        </React.Fragment>
    );

    const dateBodyTemplate = (rowData: Usuario) => {
        return formatDate(new Date(rowData.FechaAlta));
    };

    const formatDate = (value: Date) => {
        return moment(value).format('YYYY/MM/DD');
    };

    const actionBodyTemplate = (rowData: Usuario) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
                <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
            </React.Fragment>
        );
    };

    const getSeverity = (user: Usuario) => {
        return user.Activo === true ? 'success' : 'danger';
    };

    const statusBodyTemplate = (rowData: Usuario) => {
        const statusText = rowData.Activo ? 'Activo' : 'Inactivo';

        return (
            <Tag value={statusText} severity={getSeverity(rowData)}></Tag>
        );
    };


    const getRolSeverity = (user: Usuario) => {
        return user.RolId === 1 ? 'primary' : 'success';
    };

    const rolBodyTemplate = (rowData: Usuario) => {
        const statusText = rowData.RolId === 1 ? 'Administrador' : 'General';

        return (
            <Tag value={statusText} severity={getRolSeverity(rowData)}></Tag>
        );
    };


    const [selectedRole, setSelectedRole] = useState<number | null>(null);
    const roles = [
        { label: 'Administrador', value: 1 },
        { label: 'General', value: 2 },
    ];

    const [checked, setChecked] = useState<boolean>(false);

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                {/* <Toolbar className="mb-4" left={() => } /> */}
                <Button label="Nuevo usuario" icon="pi pi-plus" onClick={openNew} className='mb-4' />
                <DataTable
                    value={users}
                    dataKey="Id"
                    paginator
                    size='small'
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} usuarios"
                    globalFilter={globalFilter}
                    header={header}
                >
                    <Column field="UserName" header="Usuario" sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="Activo" header="Estatus" body={statusBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                    <Column field="dateAdded" header="Fecha alta" body={dateBodyTemplate} sortable style={{ minWidth: '12rem' }}></Column>
                    <Column field="RolId" header="Rol" sortable body={rolBodyTemplate} style={{ minWidth: '12rem' }}></Column>
                    <Column header='Acciones' body={actionBodyTemplate} exportable={false} style={{ minWidth: '12rem' }}></Column>
                </DataTable>
            </div>
            <Dialog visible={userDialog} style={{ width: '32rem' }} header="Crear usuario" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                <div className="flex flex-wrap gap-3 mt-5">

                    <div className='w-full'>
                        <label htmlFor="email" className="font-bold block mb-2">
                            Correo electrónico
                        </label>
                        <InputText
                            id="email"
                            value={user.Correo}
                            onChange={(e) => onInputChange(e, 'Correo')}
                        />
                    </div>

                    <div className="flex-auto">
                        <label htmlFor="username" className="font-bold block mb-2">
                            Nombre de usuario
                        </label>
                        <InputText
                            id="username"
                            value={user.UserName}
                            onChange={(e) => onInputChange(e, 'UserName')}
                            required
                            autoFocus
                            autoComplete="off"
                            className={classNames({ 'p-invalid': submitted && !user.UserName })}
                        />
                        {submitted && !user.UserName && <small className="p-error flex-auto">El nombre de usuario es requerido.</small>}
                    </div>
                    <div className="flex-auto">
                        <label htmlFor="rol" className="font-bold block mb-2">
                            Rol
                        </label>
                        <Dropdown
                            id="role"
                            value={selectedRole}
                            options={roles}
                            onChange={(e) => setSelectedRole(e.value)}
                            placeholder="Seleccione un rol"
                        />
                    </div>

                    <div className="flex-auto">
                        <label htmlFor="Password" className="font-bold block mb-2">
                            Contraseña
                        </label>
                        <Password
                            id="Password"
                            type="password"
                            value={user.Password}
                            onChange={(e) => onInputChange(e, 'Password')}
                            toggleMask
                            required
                        />
                    </div>

                    <div className="flex-auto">
                        <label htmlFor="passTemp" className="font-bold block mb-2">
                            Confirmar Contraseña
                        </label>
                        <Password
                            id="passTemp"
                            type="password"
                            value={user.passTemp}

                            onChange={(e) => onInputChange(e, 'passTemp')}
                            required
                        />
                    </div>

                    {/* <div className="flex justify-content-center">
                        <ToggleButton onLabel="Activo" offLabel="Inactivo" checked={checked} onChange={(e: ToggleButtonChangeEvent) => setChecked(e.value)} className="w-8rem" />
                    </div> */}
                </div>
            </Dialog>
            <Dialog visible={deleteUserDialog} style={{ width: '32rem' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && <span>Esta seguro que desea eliminar el usuario <b>{user.UserName}</b>?</span>}
                </div>
            </Dialog>
            <Dialog visible={deleteUsersDialog} style={{ width: '32rem' }} header="Confirm" modal onHide={hideDeleteUsersDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {user && <span>Are you sure you want to delete the selected users?</span>}
                </div>
            </Dialog>


            <Dialog visible={editUserDialog} style={{ width: '32rem' }} header="Editar usuario" modal className="p-fluid" footer={editUserDialogFooter} onHide={hideEditUserDialog}>
                <div className="flex flex-wrap gap-3 mt-5">

                    <div className='w-full'>
                        <label htmlFor="email" className="font-bold block mb-2">
                            Correo electrónico
                        </label>
                        <InputText
                            id="email"
                            value={user.Correo}
                            onChange={(e) => onInputChange(e, 'Correo')}
                        />
                    </div>

                    <div className="flex-auto">
                        <label htmlFor="username" className="font-bold block mb-2">
                            Nombre de usuario
                        </label>
                        <InputText
                            id="username"
                            value={user.UserName}
                            onChange={(e) => onInputChange(e, 'UserName')}
                            required
                            autoFocus
                            autoComplete="off"
                            className={classNames({ 'p-invalid': submitted && !user.UserName })}
                        />
                        {submitted && !user.UserName && <small className="p-error flex-auto">El nombre de usuario es requerido.</small>}
                    </div>
                    <div className="flex-auto">
                        <label htmlFor="rol" className="font-bold block mb-2">
                            Rol
                        </label>
                        <Dropdown
                            id="role"
                            value={selectedRole}
                            options={roles}
                            onChange={(e) => setSelectedRole(e.value)}
                            placeholder="Seleccione un rol"
                        />
                    </div>

                    <div className="flex-auto">
                        <label htmlFor="Password" className="font-bold block mb-2">
                            Contraseña
                        </label>
                        <Password
                            id="Password"
                            type="password"
                            value={user.Password}
                            onChange={(e) => onInputChange(e, 'Password')}
                            toggleMask
                            required
                        />
                    </div>

                    <div className="flex-auto">
                        <div className="flex mt-4">
                            <ToggleButton onLabel="Activo" offLabel="Inactivo" checked={checked} onChange={(e: ToggleButtonChangeEvent) => setChecked(e.value)} className="w-8rem" />
                        </div>
                    </div>

                </div>
            </Dialog>

        </div>
    );
}
