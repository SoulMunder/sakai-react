// import axios from 'axios';
// import { NextApiRequest, NextApiResponse } from 'next';

import axios from "axios";

// const OKTA_CLIENT_ID = '0oa9m6uzogL8S2Y3F697';
// const OKTA_CLIENT_SECRET = 'ySR4tEOYrVzJLNttPGvyQs2bFr6U6D7crYCy8rH7nuktRPnPdgLt';
// const OKTA_ISSUER = 'https://trial-1289597.okta.com/oauth2/default';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {

//   if(req.query.code) {

//     const authCode = req.query.code as string;

//     try {

//       const response = await axios.post(`${OKTA_ISSUER}/v1/token`, {
//         grant_type: 'authorization_code',
//         client_id: OKTA_CLIENT_ID, 
//         client_secret: OKTA_CLIENT_SECRET,
//         redirect_uri: 'http://localhost:3000/api/auth/callback/okta',
//         code: authCode  
//       });

//       const tokenData = response.data;

//       // Guardar token en localStorage
//       localStorage.setItem('oktaToken', tokenData.access_token);

//       return res.status(200).end();

//     } catch (error) {
//       return res.status(500).json(error);
//     }

//   }

//   return res.status(400);

// }


// authToken.server.ts

export default async function AuthToken(code: string ) {

  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_OKTA_ISSUER}/v1/token`, 
    {
      grant_type: 'authorization_code',
      client_id: process.env.NEXT_PUBLIC_OKTA_CLIENT_ID, 
      client_secret: process.env.NEXT_PUBLIC_OKTA_CLIENT_SECRET,
      redirect_uri: process.env.NEXT_PUBLIC_CALLBACK,
      code: code,
    }
  );

  return {
    idToken: data.id_token
  };

}