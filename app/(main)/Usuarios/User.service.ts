import axios from "axios";
import { Api, generalRequest } from '../../config/Api';
const baseURL = Api.url;

export const UsersService = {
    getUsers: async (id: number) => {
        try {
            const response = await generalRequest.get(`/Usuarios/ListByClient?clienteId=${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios', error);
            throw error;
        }
    },
    createUser: async (usuario: UserCreate) => {
        try {
            const response = await generalRequest.post(`/Usuarios`, usuario);
            console.log('Respuesta de la solicitud:', response.data);
        } catch (error) {
            console.error('Error al realizar la solicitud:', error);
        }
    },
    deleteUser: async (id: number) => {
        try {
            const response = await generalRequest.delete(`/Usuarios/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener usuarios', error);
            throw error;
        }
    },
    updateUser: async (usuario: UserEdit) => {
        try {
            const response = await generalRequest.put(`/Usuarios/${usuario.Id}`, usuario);
            return response.data;
        } catch (error) {
            console.error('Error al editar usuario', error);
            throw error;
        }
    }
}
