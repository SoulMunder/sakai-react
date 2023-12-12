import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios"

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

// interface TokenInterceptorError {
//     config?: AxiosRequestConfig;
//     response?: AxiosResponse;
//     message?: string;
// }

// axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//     config.headers = config.headers || {};
//     const token = window.localStorage.getItem('token')
    
//     if (token) {
//         config.headers.Authorization = "Bearer " + token
//         return config ;
//     }
//     return config
// }, error => {
//     return Promise.reject(error)
// });

export const generalRequest: GeneralRequest = {
    get: (url, params) => axios.get(url, { params }),
    post: (url, body) => axios.post(url, body),
    put: (url, body) => axios.put(url, body),
    delete: (url) => axios.delete(url)
}


// Función para obtener el token almacenado en localStorage
const getToken = (): string | null => {
    return window.localStorage.getItem('token');
};

// Interceptores de Axios para incluir el token en las cabeceras de las solicitudes
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});