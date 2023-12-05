'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';

// Okta
import { SessionProvider } from "next-auth/react"
import { Session } from 'next-auth'

interface RootLayoutProps {
    children: React.ReactNode;
    session: Session;
}


export default function RootLayout({ children, session }: RootLayoutProps) {
    console.log("Session",session)
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/md-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <SessionProvider session={session} refetchInterval={5 * 60}>
                        <LayoutProvider>{children}</LayoutProvider>
                    </SessionProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
