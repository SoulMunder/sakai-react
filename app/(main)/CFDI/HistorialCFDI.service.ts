import axios from "axios";
import { ApiEDI } from '../../config/ApiEDI';

const baseURL = ApiEDI.urlEDI

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