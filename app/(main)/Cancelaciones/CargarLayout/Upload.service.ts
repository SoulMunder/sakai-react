import axios from "axios";
import { generalRequest } from "../../../config/Api"; 

export const UploadService = {
    uploadFile: async (data: FormData) => {
        try {
            const response = await axios.post("http://localhost:5276/api/CargaManualCremeria", data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log(response)
            return response;
        } catch (error) {
            console.log("Error al subir el archivo", error);
            return error;
        }
    },
}