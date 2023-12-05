'use client'
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { OktaService } from "./Code.service";
export default function Auth() {

  const searchParams = useSearchParams();
  const code = searchParams.get("code") as string;

  const getToken = async () => {
    const response = await OktaService.getCode(code);
    console.log(response)
  }

  useEffect(() => {
      if (code) {
          getToken();
      }
  }, [code]);

  // const getToken = async () => {

  //     try {
  //         const response = await axios.post(
  //             process.env.NEXT_PUBLIC_OKTA_ISSUER + "/v1/token",
  //             `grant_type=authorization_code&redirect_uri=${process.env.NEXT_PUBLIC_OKTA_CALLBACK}&code=${code}`,
  //             {
  //                 headers: {
  //                     "Content-Type": "application/x-www-form-urlencoded",
  //                     Authorization: 'Basic ' + 'MG9hOW02dXpvZ0w4UzJZM0Y2OTc6eVNSNHRFT1lyVnpKTE50dFBHdnlRczJiRnI2VTZEN2NyWUN5OHJIN251a3RSUG5QZGdMdENkRGRDZXgxN0hOUQ',
  //                     Accept: "application/json",
  //                 },
  //             }
  //         );

  //         console.log(response.data);

  //     } catch (error) {
  //         console.error(error);
  //     }

  // };

  // useEffect(() => {
  //     if (code) {
  //         getToken();
  //     }
  // }, [code]);

  return <div>Authenticating...</div>;

}

// pages/auth.tsx

// import { GetServerSideProps } from 'next';
// import axios from 'axios';

// const Auth = () => {
//   return <div>Authenticating...</div>;
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const code = context.query.code as string;

//   try {
//     const encodedCredentials = Buffer.from(
//       `${process.env.NEXT_PUBLIC_OKTA_CLIENT_ID}:${process.env.NEXT_PUBLIC_OKTA_CLIENT_SECRET}`
//     ).toString('base64');

//     const response = await axios.post(
//       `${process.env.NEXT_PUBLIC_OKTA_ISSUER}/v1/token`,
//       `grant_type=authorization_code&redirect_uri=${process.env.NEXT_PUBLIC_OKTA_CALLBACK}&code=${code}`,
//       {
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//           Authorization: `Basic MG9hOW02dXpvZ0w4UzJZM0Y2OTc6eVNSNHRFT1lyVnpKTE50dFBHdnlRczJiRnI2VTZEN2NyWUN5OHJIN251a3RSUG5QZGdMdENkRGRDZXgxN0hOUQ`,
//         },
//       }
//     );

//     console.log(response.data);

//     // Puedes pasar los datos de respuesta como props para ser utilizados en el componente Auth
//     return {
//       props: {},
//     };
//   } catch (error) {
//     console.error(error);

//     // Puedes redirigir a una página de error si algo sale mal
//     return {
//       redirect: {
//         destination: '/error',
//         permanent: false,
//       },
//     };
//   }
// };

// export default Auth;
