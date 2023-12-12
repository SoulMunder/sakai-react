/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';
import { signIn, signOut, useSession } from "next-auth/react"



const AppMenu = () => {
    const { data: session, status } = useSession()
    const { layoutConfig } = useContext(LayoutContext);

    // const model: AppMenuItem[] = [
    //     
    //     {
    //         label: 'Menu desplegable',
    //         items: [
    //             {
    //                 label: 'Submenu 1',
    //                 icon: 'pi pi-fw pi-bookmark',
    //                 items: [
    //                     {
    //                         label: 'Submenu 1.1',
    //                         icon: 'pi pi-fw pi-bookmark',
    //                         items: [
    //                             { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
    //                             { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
    //                             { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
    //                         ]
    //                     },
    //                     {
    //                         label: 'Submenu 1.2',
    //                         icon: 'pi pi-fw pi-bookmark',
    //                         items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
    //                     }
    //                 ]
    //             },
    //         ]
    //     },
    // ];

    const model: AppMenuItem[] = []

    model.push(
        {
            label: 'Inicio',
            items: [{ label: 'Inicio', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Usuarios',
            items: [{ label: 'Usuarios', icon: 'pi pi-users', to: '/Usuarios' }]
        }
    );

    if (session?.user.AccesoCancelaciones) {
        model.push(
            {
                label: 'Cancelación de facturas',
                items: [
                    { label: 'Cargar layout', icon: 'pi pi-fw pi-upload', to: '/Cancelaciones/CargarLayout' },
                    { label: 'Archivos cargados', icon: 'pi pi-file-o', to: '' },
                    { label: 'Estatus cancelados', icon: 'pi pi-times', to: '' }
                ]
            }
        );
    }

    if (session?.user.AccesoCertificados) {
        model.push(
            {
                label: 'Certificados',
                items: [{ label: 'Empresas disponibles', icon: 'pi pi-building', to: '' }]
            }
        )
    }

    if (session?.user.AccesoEdicionAddenda) {
        model.push(
            {
                label: 'Edición de Addenda',
                items: [
                    {
                        label: 'Corporación Sánchez',
                        icon: 'pi pi-fw pi-bookmark',
                        items: [
                            {
                                label: 'Carga de cross reference',
                                icon: 'pi pi-fw pi-upload',
                                items: [
                                    { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                    { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                                ]
                            },
                            {
                                label: 'Submenu 1.2',
                                icon: 'pi pi-fw pi-bookmark',
                                items: [{ label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                            }
                        ]
                    },
                ]
            },
        )
    }

    if (session?.user.AccesoEDI) {
        model.push(
            {
                label: 'Addenda',
                items: [
                    { label: 'EDI', icon: 'pi pi-fw pi-briefcase', to: '/EDI' },
                    { label: 'CFDI', icon: 'pi pi-file-o', to: '/CFDI' },
                ]
            },
        )
    }

    if (session?.user.AccesoFacturacion) {
        model.push(
            {
                label: 'Facturación electronica',
                items: [
                    { label: 'Carga manual', icon: 'pi pi-upload', to: '' },
                    { label: 'Monitor de archivos', icon: 'pi pi-list', to: '' },
                    { label: 'Documentos timbrados', icon: 'pi pi-bell', to: '' },
                    { label: 'Notas de venta', icon: 'pi pi-file', to: '' },
                    { label: 'Addenda comercial', icon: 'pi pi-file', to: '' },
                    { label: 'Reglas de distribución', icon: 'pi pi-file', to: '' }
                ]
            },
        )
    }

    if (session?.user.AccesoTickets) {
        model.push(
            {
                label: 'Adidas',
                items: [
                    { label: 'Tickets', icon: 'pi pi-fw pi-ticket', to: '/Tickets' },
                ]
            },
        )
    }

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
