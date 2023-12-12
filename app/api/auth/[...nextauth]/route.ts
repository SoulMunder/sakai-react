import NextAuth, { User } from "next-auth"
import OktaProvider from "next-auth/providers/okta";
import CredentialsProvider from 'next-auth/providers/credentials';
import { loginService } from "../../../(full-page)/auth/login/login.service";
import { generalRequest } from "../../../config/Api";
import { JwtPayload, decode } from "jsonwebtoken";

const handler = NextAuth({
    pages: {
        signIn: '/auth/login',
        // signOut: '/auth/signout',
        // error: '/auth/error', // Error code passed in query string as ?error=
        // verifyRequest: '/auth/verify-request', // (used for check email message)
        // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials, req) {

                try {
                    const res = await fetch("http://localhost:5276/api/Auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            Username: credentials?.username,
                            Password: credentials?.password,
                        }),
                    });

                    const response = await res.json();
                    // const  = responseBody ? JSON.parse(responseBody) : null;

                    if (response) {
                        const data = decode(response.Token) as JwtPayload;
                        // console.log("Token decodificado", data);

                        const user = { ...data }

                        // console.log("User", user);
                        return user;
                    } else {
                        return null;
                    }
                } catch (error) {
                    console.error("Error during authentication:", error);
                    return null;
                }

            }
        }),
        OktaProvider({
            clientId: process.env.NEXT_PUBLIC_OKTA_CLIENT_ID as string,
            clientSecret: process.env.NEXT_PUBLIC_OKTA_CLIENT_SECRET as string,
            issuer: process.env.NEXT_PUBLIC_OKTA_ISSUER as string,
            idToken: true,
        }),
        // ...add more providers here
    ],
    secret: process.env.NEXT_PUBLIC_SECRET as string,
    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },
        async session({ session, token, user }) {
            session.user = token as any;
            return session;
        },
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
    },
})

export { handler as GET, handler as POST }