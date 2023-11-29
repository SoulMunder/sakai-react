import axios from "axios";
import { Api } from "../../../config/ApiEDI"

const baseUrl = Api.url

export const loginService = {
    handleLogin: async (username: string, password: string, event: React.FormEvent) => {
        event.preventDefault();
        // try {
        //     const response = await axios.post(`${baseUrl}/auth/login`, {
        //         username,
        //         password
        //     });
        //     const { token } = response.data;
        //     localStorage.setItem('token', token);
        //     // Redirigir al usuario o manejar el estado de inicio de sesión
        // } catch (error) {
        //     console.error('Error de autenticación', error);
        // }
        console.log(username, password)
    }
}

// event.preventDefault();
//         


