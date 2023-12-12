import jwt, { JwtPayload, decode } from 'jsonwebtoken';

export const decodeToken = () => {
    const token = window.localStorage.getItem('token');
    if(token){
        try {
            const decoded = decode(token) as JwtPayload
            console.log(decoded)
            // return decoded;
        } catch (error) {
            console.error('Error decoding token:', error);
            // return null;
        }
    }
};
