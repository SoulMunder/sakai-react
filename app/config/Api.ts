import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"
import { useSession } from "next-auth/react";

export const Api = {
    url: "http://localhost:5276/api"
}

axios.defaults.baseURL = "http://localhost:5276/api";

interface GeneralRequest {
    get: (url: string, params?: object) => Promise<AxiosResponse<any>>,
    post: <T>(url: string, body: T) => Promise<AxiosResponse<any>>,
    put: <T>(url: string, body: T) => Promise<AxiosResponse<any>>,
    delete: (url: string) => Promise<AxiosResponse<any>>
}

export const generalRequest: GeneralRequest = {
    get: (url, params) => axios.get(url, { params }),
    post: (url, body) => axios.post(url, body),
    put: (url, body) => axios.put(url, body),
    delete: (url) => axios.delete(url)
}


// Función para obtener el token almacenado en localStorage
// const getToken = (): string | null => {
//     return window.localStorage.getItem('token');
// };

// Interceptores de Axios para incluir el token en las cabeceras de las solicitudes
// axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//     const { data: session } = useSession()
//     // let id = session?.user.ClienteId;
//     // const token = getToken();
//     if (session?.user?.Token) {
//         config.headers.Authorization = `Bearer ${session?.user?.Token}`;
//     }
//     return config;
// });