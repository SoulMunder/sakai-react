import axios from 'axios';
import { ApiEDI } from '../config/ApiEDI';

const baseURL = ApiEDI.urlEDI;

export const downloadService = {
    downloadFile: async (rutaBCK: string, filename: string, extension: string) => {
        try {
            console.log(rutaBCK, filename, extension);
            const response = await axios.get(`${baseURL}/Herrameintas?rutaBCK=${rutaBCK}&filename=${filename}&extension=${extension}`, {
                responseType: 'blob', // Indica que la respuesta es de tipo blob (archivo binario)
            });

            // Crear un enlace temporal para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${filename}.${extension}`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            console.error('Error al descargar el archivo:', error);
            if (error.response) {
                // El servidor respondió con un código de estado diferente de 2xx
                console.error('Respuesta del servidor:', error.response.data);
                console.error('Código de estado:', error.response.status);
            } else if (error.request) {
                // La solicitud se hizo pero no se recibió respuesta
                console.error('No se recibió respuesta del servidor');
            }

        }
    },
}
