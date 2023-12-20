'use client'
import React, { useRef } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { UploadService } from './Upload.service';
import { useSession } from 'next-auth/react';

export default function AdvanceDemo() {

    const toast = useRef<Toast>(null); // Agrega la referencia al componente Toast

    const { data: session } = useSession()
    const id = session?.user.ClienteId;

    const onUpload = async (event: any) => {
        const files = event.files;
        if (id != null) {
            const formData = new FormData();
            formData.append('id', id.toString());
            // formData.append('json', file);
            files.forEach((file: any, index: number) => {
                formData.append('json', file);
            });

            const model = {
                id: id,
                json: [files] // Debe ser un array de archivos
            };

            // const response = await UploadService.uploadFile(formData);
            // // mostrar un toast si la respuesta es exitosa
            // console.log(response);

            try {
                // Realiza la carga del archivo utilizando una función asíncrona
                const response = await UploadService.uploadFile(formData);

                // Muestra un mensaje de éxito
                // toast.current.show({ severity: 'success', summary: 'File(s) Uploaded Successfully', detail: '' });
                if (response != null && response.status === 200) {
                    // const result = await response.json();
                    toast.current?.show({ severity: 'success', summary: 'Subida de archivos exitosa', detail: `Se ha(n) almacenado ${response.data} archivo(s)` });
                } else {
                    // La respuesta no es exitosa, muestra un mensaje de error
                    // const errorResponse = await response.json();
                    toast.current?.show({ severity: 'error', summary: 'Error', detail: response });
                }
                console.log(response);
            } catch (error) {
                console.error('Error uploading file:', error);

                // Muestra un mensaje de error
                // toast.current.show({ severity: 'error', summary: 'Error', detail: 'File upload failed' });
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Fallo al subir archivo(s)' });
            }
        }
    };


    return (
        <>
            <Toast ref={toast} />
            <div className="card">
                <FileUpload chooseLabel='Elegir' multiple uploadLabel='Subir' cancelLabel='Limpiar' customUpload={true} accept=".json" maxFileSize={1000000} emptyTemplate={<p className="m-0">Arraste y suelte los archivos .json aquí.</p>} uploadHandler={onUpload} />
            </div>
        </>
    )
}