import axios from "axios";
import { Api } from './../config/Api';

const baseURL = Api.urlRickAndMorty

export const RickAndMortyService =  {
    getCharacters: async() => {
        try {
            const response = await axios.get(`${baseURL}/character`);
            return response.data.results;
        } catch (error) {
            
        }
    }
}