import axios from "axios";
import { Api } from '../../config/ApiEDI';

const baseURL = Api.url

export const TicketService = {
    getData: async (params: Object) => {
        params.table = "Tk_Recepcion";
        try {
            const response = await axios.post(`${baseURL}/Ticket/FillGridTk_recepcion`, params);
            return response.data;
        } catch (error) {
            console.error('Error al enviar filtros:', error);
            throw error; 
        }
    },
    sendEmail: async (Id: number, Email: string) => {
        axios.get(`${baseURL}/Ticket/EnviarTicket`, {
            params: {
                id: Id,
                email: Email,
            },
        })
        .then(response => {
            console.log('Respuesta de la solicitud:', response.data);
        })
        .catch(error => {
            console.error('Error al realizar la solicitud:', error);
        });
    }
}