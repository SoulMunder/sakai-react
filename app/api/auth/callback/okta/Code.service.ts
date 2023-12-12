import { generalRequest } from "../../../../config/Api";

// const baseURL = Api.url

export const OktaService = {
    getCode: async (params: string) => {
        try {
            const response = await generalRequest.get(`/Auth/GeTokenOkta?code=${params}`);
            return response.data;
        } catch (error) {
            console.error('Error', error);
            throw error;
        }
    }
}