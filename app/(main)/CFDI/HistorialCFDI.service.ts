import { Api, generalRequest } from '../../config/Api';

const baseURL = Api.url

export const HistorialCFDIService = {
    getHistorial: async (params: Object) => {
        console.log("filtros:", params)
        params.table = "CFDITransferRegistro";
        try {
            const response = await generalRequest.post(`/edi/HistorialCFDI`, params);
            return response.data;
        } catch (error) {
            console.error('Error al enviar filtros:', error);
            throw error; // Si deseas propagar el error después de manejarlo
        }
    }
}