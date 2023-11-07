import axios from "axios";
import { ApiEDI } from './../config/ApiEDI';

const baseURL = ApiEDI.urlEDI

export const HistorialCFDIService = {
    getHistorial: async (params: Object) => {
        try {
            const response = await axios.post(`${baseURL}/HistorialCFDI`, params);
            console.log('Datos recibidos service:', response);
            return response.data;
        } catch (error) {
            console.error('Error al enviar filtros:', error);
            throw error; // Si deseas propagar el error después de manejarlo
        }
    }
}