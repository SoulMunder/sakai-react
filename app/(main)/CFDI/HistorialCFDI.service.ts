import axios from "axios";
import { Api } from '../../config/ApiEDI';

const baseURL = Api.url

export const HistorialCFDIService = {
    getHistorial: async (params: Object) => {
        params.table = "CFDITransferRegistro";
        try {
            const response = await axios.post(`${baseURL}/edi/HistorialCFDI`, params);
            return response.data;
        } catch (error) {
            console.error('Error al enviar filtros:', error);
            throw error; // Si deseas propagar el error después de manejarlo
        }
    }
}