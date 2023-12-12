'use client'
import { LoginCallback } from "@okta/okta-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { OktaService } from "./Code.service";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { JwtPayload, decode } from "jsonwebtoken";
import { getServerSession } from "next-auth";
export default function Auth() {

  const searchParams = useSearchParams();
  const code = searchParams?.get("code") as string;

  const { data: session } = useSession();

  console.log()

  const getToken = async () => {
    const response = await OktaService.getCode(code);
    if (response) {
      const data = decode(response.Token) as JwtPayload;
      // console.log("Token decodificado", data);

      const user = { ...data }
      console.log(user)
      // const session = await getServerSession(ctx.req, ctx.res, response); 
    }
    console.log(response)
  }

  useEffect(() => {
    if (code) {
      getToken();
    }
  }, []);

  return <div>Authenticating...</div>;

}

// pages/[id].tsx





// import { getCsrfToken } from "next-auth/react"
// import { hasAuthorizationCode } from "@okta/okta-auth-js"; 
// import { useOktaAuth } from '@okta/okta-react';

// // const oktaAuth = new Auth({issuer: "{ISSUER}", clientId: "{CLIENT_ID}"})
  
//   const token = await oktaAuth.token.getWithAuthorizationCode({
//     code,
//     scopes: [],
//   })

// export default function Callback() {
//   getCsrfToken()
//   return null
// }








// import { GetServerSideProps, NextPage } from 'next';
// import { ParsedUrlQuery } from 'querystring';

// interface PageProps {
//   id: string;
// }

// const Page: NextPage<PageProps> = ({ id }) => {
//   return (
//     <div>
//       <h1>Obteniendo parámetros de la URL del lado del servidor</h1>
//       <p>ID: {id}</p>
//     </div>
//   );
// };

// export const getServerSideProps: GetServerSideProps<PageProps, { id: string }> = async ({ params }) => {
//   const id = params?.id as string;

//   // Aquí podrías realizar lógica adicional según tus necesidades.

//   return {
//     props: {
//       id,
//     },
//   };
// };

// export default Page;
