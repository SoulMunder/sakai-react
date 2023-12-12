/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { loginService } from './login.service';
import { signIn, signOut, useSession } from "next-auth/react"


const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('mt-2 surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const handleSubmit = async () => {

        await signIn('credentials', {
            username: username,
            password: password,
            redirect: true,
            callbackUrl: "/"
        });
    };

    const { data: session, status } = useSession()

    console.log({ session })
    // console.log({ status })

    if (status === 'loading') {
        return (
            <>
                Loading...
            </>
        )
    }

    if (session) {
        return (
            <>
                You have logged in <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <img src={`/layout/images/egrid.svg`} alt="Sakai logo" className="my-5 w-14rem flex-shrink-0" />
                            <div className="text-900 text-3xl font-medium mb-3">¡Bienvenido otra vez!</div>
                            <span className="text-600 font-medium">Inicie sesión para continuar</span>
                        </div>

                        <div>
                            <div>
                                <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                    Usuario
                                </label>
                                <InputText id="email1" type="text" placeholder="Usuario" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} value={username} onChange={(e) => setUsername(e.target.value)} />

                                <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                    Contraseña
                                </label>
                                <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                                <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                    <div className="flex align-items-center">
                                        <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                        <label htmlFor="rememberme1">Mantener sesión iniciada</label>
                                    </div>
                                </div>
                                <Button onClick={handleSubmit} label="Ingresar" className="w-full p-3 text-xl" ></Button>

                                <div className="flex justify-content-center mt-5 mb-3">
                                    <span className="">O si lo prefiere</span>
                                </div>
                                <Button
                                    severity="info"
                                    label="Inicie sesión con Okta"
                                    icon="pi pi-check-circle"
                                    className="w-full p-3 text-xl mt-2"
                                    onClick={() => signIn('okta')}
                                />
                                {/* <>
                                    Not Logged In <button onClick={() => signIn('okta')}>Sign in</button>
                                </> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
