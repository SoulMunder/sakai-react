import axios from "axios";
import { ApiEDI } from "../config/ApiEDI";

const baseURL = ApiEDI.urlEDI

export const HistorialEDIService =  {
    getHistorial: async() => {
        try {
            const response = await axios.get(`${baseURL}/edi/HistorialEDI`);
            return response.data;
        } catch (error) {
            
        }
    },
    // getHistorialFiltrado: async(filtro) => {
    //     // const queryParams = params
    //     //     ? Object.keys(params)
    //     //           .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    //     //           .join('&')
    //     //     : '';
    //     try {
    //         const response = await axios.get(`${baseURL}/edi/HistorialEDI?cadenaComercial=${filtro.value}`);
    //         return response.data;
    //     } catch (error) {
            
    //     }
    // }
    // getHistorialFiltrado(filtro) {
        // const queryParams = params
        //     ? Object.keys(params)
        //           .map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        //           .join('&')
        //     : '';
        //     console.log(queryParams)
        // console.log(`${baseURL}/edi/HistorialEDI?cadenaComercial=${filtro.value}`)
        // return fetch(`${baseURL}/edi/HistorialEDI?cadenaComercial=${filtro.value}`).then((res) => res.json());
    // }
}