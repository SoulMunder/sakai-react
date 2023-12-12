'use client'
import React from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';

export default function AdvanceDemo() {
        
    return (
        <div className="card">
            <FileUpload chooseLabel='Elegir' uploadLabel='Subir' cancelLabel='Cancelar' name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Puede intentar arrastrar el archivo.</p>} />
        </div>
    )
}