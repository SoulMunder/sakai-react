import axios from "axios";
import { Api, generalRequest } from '../../config/Api';

// const baseURL = Api.url

// export const TicketService = {
//     getData: async (params: Object) => {
//         params.table = "Tk_Recepcion";
//         try {
//             const response = await axios.post(`${baseURL}/Ticket/FillGridTk_recepcion`, params);
//             return response.data;
//         } catch (error) {
//             console.error('Error al enviar filtros:', error);
//             throw error; 
//         }
//     },
//     sendEmail: async (Id: number, Email: string) => {
//         axios.get(`${baseURL}/Ticket/EnviarTicket`, {
//             params: {
//                 id: Id,
//                 email: Email,
//             },
//         })
//         .then(response => {
//             console.log('Respuesta de la solicitud:', response.data);
//         })
//         .catch(error => {
//             console.error('Error al realizar la solicitud:', error);
//         });
//     }
// }

// import generalRequest from './path-to-general-request';  // Ajusta la ruta según tu estructura de archivos
// import { Api } from '../../config/Api';

const baseURL = Api.url;

export const TicketService = {
    getData: async (params: Object) => {
        console.log(params)
        params.table = "Tk_Recepcion";
        try {
            const response = await generalRequest.post(`/Ticket/FillGridTk_recepcion`, params);
            return response.data;
        } catch (error) {
            console.error('Error al enviar filtros:', error);
            throw error; 
        }
    },
    sendEmail: async (Id: number, Email: string) => {
        try {
            const response = await generalRequest.get(`/Ticket/EnviarTicket?id=${Id}&email=${Email}`);
            console.log('Respuesta de la solicitud:', response.data);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    }
}
