import axios from "axios";
import { Api, generalRequest } from "../../../config/Api"
import { JwtPayload, decode } from "jsonwebtoken";

const baseUrl = Api.url

export const loginService = {
    sendCredentials: async (username: string | undefined, password: string | undefined,) => {
        // event: React.FormEvent
        // event.preventDefault();
        try {
            const response = await generalRequest.post(`/Auth/login`, {
                username,
                password
            });
            // const { token } = response.data.Token;
            // const decoded = decode(token) as JwtPayload
            return response.data
            // window.localStorage.setItem('token', response.data.Token)
            // console.log(response.data)
            // Redirigir al usuario o manejar el estado de inicio de sesión
        } catch (error) {
            console.error('Error de autenticación', error);
        }
        // console.log(username, password)
    }
}
